const express = require('express');
const router = express.Router();
const prisma = require('../database/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para guardar archivos en /uploads/lab-evidence
const evidenceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '../uploads/lab-evidence');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadEvidence = multer({ storage: evidenceStorage });

// ============================================================================
// PRODUCTOS Y MATERIALES (CON PRISMA)
// ============================================================================

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.lab_product.findMany({
      where: { status: 'active' },
      include: { lab_material: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar productos', error: error.message });
  }
});

router.get('/materials', async (req, res) => {
  try {
    const materials = await prisma.lab_material.findMany({
      include: { lab_product: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: materials, count: materials.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar materiales', error: error.message });
  }
});

router.get('/materials/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const material = await prisma.lab_material.findUnique({
      where: { id: parseInt(id) },
    });

    if (!material) {
      return res.status(404).json({ success: false, message: 'Material no encontrado' });
    }

    res.json({ success: true, data: material });
  } catch (error) {
    console.error('Error fetching single lab material with Prisma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar el material',
      error: error.message
    });
  }
});

// ... (otras rutas de materiales)

// ============================================================================
// ACTIVIDADES (CON PRISMA)
// ============================================================================

router.get('/activities', async (req, res) => {
  const maxRetries = 3;
  let retryCount = 0;

  const attemptQuery = async () => {
    try {
      const { searchTerm, grade_level, subject, lab_material_id, page = 1, limit = 12 } = req.query;
      const filterConditions = [];
      if (searchTerm) {
        filterConditions.push({
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        });
      }
      if (grade_level && grade_level !== 'all') {
        filterConditions.push({ target_cycle: grade_level });
      }
      if (subject && subject !== 'all') {
        filterConditions.push({ subject: subject });
      }
      if (lab_material_id && lab_material_id !== 'all') {
        filterConditions.push({ lab_material_id: parseInt(lab_material_id) });
      }
      const whereClause = {
        AND: [
          ...filterConditions,
          { status: 'active' },
        ],
      };
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const [activities, total] = await prisma.$transaction([
        prisma.lab_activity.findMany({
          where: whereClause,
          select: {
            id: true, title: true, slug: true, status: true, created_at: true,
            description: true, cover_image_url: true, tags: true,
            target_cycle: true, duration_minutes: true, creator_id: true,
          },
          skip: offset,
          take: parseInt(limit),
          orderBy: { created_at: 'desc' },
        }),
        prisma.lab_activity.count({ where: whereClause }),
      ]);
      res.json({
        success: true,
        data: activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error(`Error fetching lab activities with Prisma (attempt ${retryCount + 1}):`, error);
      
      // Si es error de conexión y no hemos agotado los reintentos
      if (error.code === 'P1001' && retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 Reintentando conexión a base de datos (${retryCount}/${maxRetries})...`);
        
        // Esperar 1 segundo antes del reintento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reintentar
        return attemptQuery();
      }
      
      // Si no es error de conexión o agotamos reintentos
      res.status(500).json({ 
        success: false, 
        message: 'Error al cargar actividades', 
        error: error.message,
        retries: retryCount 
      });
    }
  };

  await attemptQuery();
});

router.get('/activities/id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await prisma.lab_activity.findUnique({
      where: { id: id },
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching activity by ID:', error);
    res.status(500).json({ success: false, message: 'Error al cargar la actividad' });
  }
});

router.get('/activities/:slug', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.user_id;

    const activity = await prisma.lab_activity.findUnique({
      where: { slug: slug },
      include: {
        lab_material: true,
        lab_activity_metrics: true,
        lab_activity_favorites: {
          where: { teacher_id: userId },
          select: { id: true }
        },
        lab_activity_log: {
          where: { teacher_id: userId },
          select: {
            id: true,
            execution_date: true,
            student_count: true,
            success_rating: true,
            duration_actual_minutes: true,
            notes: true,
            courses: {
              select: {
                course_id: true,
                course_name: true
              }
            },
            lab_evidence: {
              select: {
                id: true,
                file_url: true,
                file_type: true,
                file_name: true,
                mime_type: true
              }
            }
          },
          orderBy: { execution_date: 'desc' },
          take: 5
        }
      }
    });

    if (!activity || (activity.status !== 'active' && activity.creator_id !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada o no tienes permiso para verla.'
      });
    }

    const responseData = {
      ...activity,
      is_favorite: activity.lab_activity_favorites.length > 0,
      my_recent_executions: activity.lab_activity_log.map(log => ({
        ...log,
        course: log.courses,
        evidence: log.lab_evidence
      }))
    };

    console.log('Activity data sent to frontend:', JSON.stringify(responseData, null, 2));

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching activity detail with Prisma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar detalle de actividad',
      error: error.message
    });
  }
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[ \-]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

router.post('/activities', authenticateToken, requireRole('teacher', 'admin_escolar', 'superadmin'), async (req, res) => {
  try {
    const {
      title,
      description,
      cover_image_url,
      tags,
      target_cycle,
      duration_minutes,
      group_size,
      difficulty_level,
      lab_material_id,
      // Puedes agregar más campos aquí si es necesario
    } = req.body;

    // Validación básica
    if (!title || !description || !target_cycle || !duration_minutes) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
    }

    const slug = slugify(title);

    // Construir el objeto de datos dinámicamente, solo agregando los campos si existen
    const activityData = {
      title,
      description,
      cover_image_url,
      tags: tags || [],
      target_cycle,
      duration_minutes: Number(duration_minutes),
      status: 'active',
      slug,
    };
    if (group_size !== undefined) activityData.group_size = Number(group_size);
    if (difficulty_level !== undefined) activityData.difficulty_level = Number(difficulty_level);
    if (lab_material_id !== undefined && lab_material_id !== null && lab_material_id !== "") activityData.lab_material_id = Number(lab_material_id);

    const newActivity = await prisma.lab_activity.create({
      data: activityData,
    });

    res.status(201).json({ success: true, data: newActivity });
  } catch (error) {
    console.error('Error creando actividad:', error);
    res.status(500).json({ success: false, message: 'Error al crear actividad', error: error.message });
  }
});

router.put('/activities/:id', authenticateToken, requireRole('SUPER_ADMIN_FULL', 'ADMIN_ESCOLAR', 'TEACHER'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.user_id;

    console.log('🔍 [DEBUG PUT] Inicio del endpoint');
    console.log('🔍 [DEBUG PUT] ID actividad:', id);
    console.log('🔍 [DEBUG PUT] User recibido:', req.user);
    console.log('🔍 [DEBUG PUT] Token recibido:', req.headers.authorization);

    // Validar que la actividad existe y el usuario tiene permisos
    const existingActivity = await prisma.lab_activity.findUnique({
      where: { id: id },
    });

    if (!existingActivity) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }

    console.log('🔍 [DEBUG PUT] Actividad encontrada:', {
      id: existingActivity.id,
      creator_id: existingActivity.creator_id,
      title: existingActivity.title
    });

    // Solo permitir edición si es el creador o es SUPER_ADMIN_FULL
    const userRole = req.user.role;
    const isSuperAdmin = userRole === 'SUPER_ADMIN_FULL';
    const isCreator = existingActivity.creator_id === userId;
    const hasNoCreator = existingActivity.creator_id === null;

    console.log('🔍 [DEBUG PUT] Permisos edición actividad:', {
      id_actividad: id,
      userRole,
      userId,
      creatorId: existingActivity.creator_id,
      isSuperAdmin,
      isCreator,
      hasNoCreator
    });

    // Solo Super Admin puede editar actividades sin creador o actividades que no creó
    if (!isCreator && !isSuperAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: hasNoCreator 
          ? 'No tienes permisos para editar esta actividad del sistema. Solo los Super Administradores pueden editar actividades sin creador.' 
          : 'No tienes permisos para editar esta actividad. Solo puedes editar las actividades que creaste.'
      });
    }

    console.log('🔍 [DEBUG PUT] Permisos aprobados, procediendo con actualización');

    // Procesar arrays que vienen como strings separados por saltos de línea
    const processedData = {
      ...updateData,
      learning_objectives: updateData.learning_objectives ? 
        updateData.learning_objectives.split('\n').filter(obj => obj.trim()) : [],
      resource_urls: updateData.resource_urls ? 
        updateData.resource_urls.split('\n').filter(url => url.trim()) : [],
      oa_ids: updateData.oa_ids ? 
        updateData.oa_ids.split('\n').filter(oa => oa.trim()) : [],
      tags: updateData.tags ? 
        updateData.tags.split('\n').filter(tag => tag.trim()) : [],
      lab_material_id: updateData.lab_material_id ? parseInt(updateData.lab_material_id) : null,
      duration_minutes: updateData.duration_minutes ? parseInt(updateData.duration_minutes) : null,
      group_size: updateData.group_size ? parseInt(updateData.group_size) : null,
      difficulty_level: updateData.difficulty_level ? parseInt(updateData.difficulty_level) : null,
      preparation_time_minutes: updateData.preparation_time_minutes ? parseInt(updateData.preparation_time_minutes) : null,
      cleanup_time_minutes: updateData.cleanup_time_minutes ? parseInt(updateData.cleanup_time_minutes) : null,
      updated_at: new Date()
    };

    // Actualizar la actividad
    const updatedActivity = await prisma.lab_activity.update({
      where: { id: id },
      data: processedData,
    });

    res.json({ 
      success: true, 
      message: 'Actividad actualizada correctamente',
      data: updatedActivity 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la actividad',
      error: error.message 
    });
  }
});

router.delete('/activities/:id', authenticateToken, async (req, res) => {
  // ... (código de la ruta de eliminación)
});

// ============================================================================
// LOGS DE EJECUCIÓN (CON PRISMA)
// ============================================================================
router.post('/activity-logs', authenticateToken, requireRole('teacher'), uploadEvidence.single('evidence'), async (req, res) => {
  const {
    activity_id,
    course_id,
    execution_date,
    student_count,
    duration_actual_minutes,
    success_rating,
    engagement_rating,
    difficulty_perceived,
    notes,
    challenges_faced
  } = req.body;

  // Obtener teacher_id y school_id del usuario autenticado
  const teacher_id = req.user?.user_id;
  const school_id = req.user?.school_id;

  // Convertir student_count, duration_actual_minutes y success_rating a número
  const studentCount = parseInt(student_count, 10);
  const durationActualMinutes = duration_actual_minutes !== undefined ? parseInt(duration_actual_minutes, 10) : null;
  const successRating = success_rating !== undefined ? parseInt(success_rating, 10) : null;

  // Validación básica
  if (!activity_id || !student_count || !execution_date) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
  }
  if (isNaN(studentCount)) {
    return res.status(400).json({ success: false, message: 'El número de estudiantes no es válido.' });
  }

  // Validar que course_id sea un UUID o null
  function isValidUUID(str) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
  }
  const courseIdToSave = course_id && isValidUUID(course_id) ? course_id : null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el registro de ejecución
      const newLog = await tx.lab_activity_log.create({
        data: {
          activity_id,
          teacher_id,
          school_id,
          course_id: courseIdToSave,
          execution_date: new Date(execution_date),
          student_count: studentCount,
          duration_actual_minutes: durationActualMinutes,
          success_rating: successRating,
          engagement_rating,
          difficulty_perceived,
          notes,
          challenges_faced,
        },
      });

      // 2. Si hay archivo de evidencia, crear registro en lab_evidence
      if (req.file) {
        const fileUrl = `/uploads/lab-evidence/${req.file.filename}`;
        const mimeType = req.file.mimetype;
        let fileType = 'document';
        if (mimeType.startsWith('image/')) fileType = 'photo';
        else if (mimeType.startsWith('video/')) fileType = 'video';
        else if (mimeType.startsWith('audio/')) fileType = 'audio';
        else if (mimeType === 'application/pdf') fileType = 'document';
        await tx.lab_evidence.create({
          data: {
            activity_log_id: newLog.id,
            file_url: fileUrl,
            file_type: fileType,
            file_size_bytes: req.file.size,
            file_name: req.file.originalname,
            mime_type: mimeType,
            description: '',
            is_student_work: false,
          },
        });
      }

      // 2. Update or create the activity metrics
      // Promedio de duración solo con registros que tengan duration_actual_minutes
      const logsWithDuration = await tx.lab_activity_log.findMany({
        where: {
          activity_id,
          duration_actual_minutes: { not: null },
        },
      });
      const totalWithDuration = logsWithDuration.length;
      const sumDuration = logsWithDuration.reduce((acc, log) => acc + (typeof log.duration_actual_minutes === 'number' ? log.duration_actual_minutes : parseInt(log.duration_actual_minutes || '0', 10)), 0);
      const avgDuration = totalWithDuration > 0 ? sumDuration / totalWithDuration : null;

      // Promedio de rating solo con registros que tengan success_rating
      const logsWithRating = await tx.lab_activity_log.findMany({
        where: {
          activity_id,
          success_rating: { not: null },
        },
      });
      const totalWithRating = logsWithRating.length;
      const sumRating = logsWithRating.reduce((acc, log) => acc + (typeof log.success_rating === 'number' ? log.success_rating : parseInt(log.success_rating || '0', 10)), 0);
      const avgRating = totalWithRating > 0 ? sumRating / totalWithRating : null;

      const currentMetrics = await tx.lab_activity_metrics.findUnique({
        where: { activity_id },
      });

      if (currentMetrics) {
        await tx.lab_activity_metrics.update({
          where: { activity_id },
          data: {
            total_executions: await tx.lab_activity_log.count({ where: { activity_id } }),
            avg_rating: avgRating,
            avg_duration_minutes: avgDuration,
            last_execution_date: new Date(execution_date),
            // unique_teachers y unique_schools pueden mejorarse en el futuro
          },
        });
      } else {
        await tx.lab_activity_metrics.create({
          data: {
            activity_id,
            total_executions: await tx.lab_activity_log.count({ where: { activity_id } }),
            unique_teachers: 1,
            unique_schools: 1,
            avg_rating: avgRating,
            avg_duration_minutes: avgDuration,
            last_execution_date: new Date(execution_date),
          },
        });
      }

      return newLog;
    });

    res.status(201).json({ success: true, message: 'Ejecución registrada con éxito', data: result });

  } catch (error) {
    console.error('Error logging activity execution:', error);
    res.status(500).json({ success: false, message: 'Error al registrar la ejecución', error: error.message });
  }
});


module.exports = router;
