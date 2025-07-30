const express = require('express');
const { requireRole, authenticateToken } = require('../middleware/auth');
const { skinSystemService } = require('../services/skinSystemData');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/skins - Obtener todas las skins
router.get('/', async (req, res) => {
  try {
    console.log('🎨 GET /api/skins - Fetching all skins');
    
    const { engine, subject, category } = req.query;
    let result;
    
    if (engine) {
      console.log(`🎮 Filtering by engine: ${engine}`);
      result = skinSystemService.getSkinsByEngine(engine);
    } else if (subject) {
      console.log(`📚 Filtering by subject: ${subject}`);
      result = skinSystemService.getSkinsBySubject(subject);
    } else {
      console.log('🎨 Getting all skins');
      result = skinSystemService.getAllSkins();
    }
    
    // Filtrar por categoría si se especifica
    if (category && result.success) {
      result.data = result.data.filter(skin => skin.category === category);
      result.total = result.data.length;
    }
    
    console.log(`✅ Returning ${result.total} skins`);
    
    res.json({
      success: true,
      skins: result.data,
      total: result.total,
      filters: {
        engine: engine || null,
        subject: subject || null,
        category: category || null
      }
    });
    
  } catch (error) {
    logger.error('Get skins error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve skins',
        code: 'SKINS_FETCH_ERROR'
      }
    });
  }
});

// GET /api/skins/stats - Obtener estadísticas del sistema de skins
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 GET /api/skins/stats - Fetching skin statistics');
    
    const stats = skinSystemService.getSkinStats();
    
    console.log(`📊 Skin statistics:`, stats.data);
    
    res.json({
      success: true,
      stats: stats.data
    });
    
  } catch (error) {
    logger.error('Get skin stats error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve skin statistics',
        code: 'SKIN_STATS_ERROR'
      }
    });
  }
});

// GET /api/skins/:id - Obtener skin específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🎨 GET /api/skins/${id} - Fetching specific skin`);
    
    const result = skinSystemService.getSkinById(id);
    
    if (!result.success) {
      return res.status(404).json({
        error: {
          message: 'Skin not found',
          code: 'SKIN_NOT_FOUND'
        }
      });
    }
    
    console.log(`✅ Found skin: ${result.data.name}`);
    
    res.json({
      success: true,
      skin: result.data
    });
    
  } catch (error) {
    logger.error('Get skin by id error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve skin',
        code: 'SKIN_FETCH_ERROR'
      }
    });
  }
});

// POST /api/skins/apply - Aplicar skin a un juego
router.post('/apply', authenticateToken, requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { skin_id, game_session_id } = req.body;
    
    console.log(`🎨 POST /api/skins/apply - Applying skin ${skin_id} to game ${game_session_id}`);
    console.log(`👤 User: ${req.user?.user_id} (${req.user?.role}) from school: ${req.user?.school_id}`);
    
    if (!skin_id || !game_session_id) {
      return res.status(400).json({
        error: {
          message: 'skin_id and game_session_id are required',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const result = skinSystemService.applySkinToGame(skin_id, game_session_id);
    
    if (!result.success) {
      return res.status(404).json({
        error: {
          message: result.error,
          code: 'SKIN_APPLY_ERROR'
        }
      });
    }
    
    console.log(`✅ Skin applied successfully: ${result.message}`);
    
    res.json({
      success: true,
      message: result.message,
      skin_config: result.data
    });
    
  } catch (error) {
    logger.error('Apply skin error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to apply skin',
        code: 'SKIN_APPLY_ERROR'
      }
    });
  }
});

// GET /api/skins/engine/:engineId - Obtener skins específicas de un engine
router.get('/engine/:engineId', async (req, res) => {
  try {
    const { engineId } = req.params;
    console.log(`🎮 GET /api/skins/engine/${engineId} - Fetching skins for engine`);
    
    const result = skinSystemService.getSkinsByEngine(engineId);
    
    console.log(`✅ Found ${result.total} skins for engine ${engineId}`);
    
    res.json({
      success: true,
      engine_id: engineId,
      skins: result.data,
      total: result.total
    });
    
  } catch (error) {
    logger.error('Get skins by engine error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve skins for engine',
        code: 'ENGINE_SKINS_FETCH_ERROR'
      }
    });
  }
});

// GET /api/skins/preview/:skinId - Obtener preview de una skin
router.get('/preview/:skinId', async (req, res) => {
  try {
    const { skinId } = req.params;
    console.log(`🖼️ GET /api/skins/preview/${skinId} - Fetching skin preview`);
    
    const result = skinSystemService.getSkinById(skinId);
    
    if (!result.success) {
      return res.status(404).json({
        error: {
          message: 'Skin not found',
          code: 'SKIN_NOT_FOUND'
        }
      });
    }
    
    // Generar preview config específico
    const previewConfig = {
      skin_id: skinId,
      name: result.data.name,
      description: result.data.description,
      theme: result.data.theme,
      elements: result.data.elements,
      preview_url: result.data.preview_url,
      category: result.data.category,
      engine_id: result.data.engine_id
    };
    
    console.log(`🖼️ Generated preview for skin: ${result.data.name}`);
    
    res.json({
      success: true,
      preview: previewConfig
    });
    
  } catch (error) {
    logger.error('Get skin preview error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate skin preview',
        code: 'SKIN_PREVIEW_ERROR'
      }
    });
  }
});

module.exports = router; 
