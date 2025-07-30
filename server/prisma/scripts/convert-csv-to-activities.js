const fs = require('fs');
const path = require('path');

// Función para generar un slug a partir del título
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .trim();
}

// Función para generar un UUID simple (para desarrollo)
function generateSimpleId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Función para extraer OAs del texto
function extractOAs(text) {
  const oaMatches = text.match(/OA\s+\d+/g);
  return oaMatches ? oaMatches : [];
}

// Función para determinar el nivel de Bloom
function determineBloomLevel(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('reconocer') || text.includes('identificar') || text.includes('recordar')) {
    return 'recordar';
  } else if (text.includes('comprender') || text.includes('explicar') || text.includes('describir')) {
    return 'comprender';
  } else if (text.includes('aplicar') || text.includes('usar') || text.includes('implementar')) {
    return 'aplicar';
  } else if (text.includes('analizar') || text.includes('comparar') || text.includes('diferenciar')) {
    return 'analizar';
  } else if (text.includes('evaluar') || text.includes('juzgar') || text.includes('valorar')) {
    return 'evaluar';
  } else if (text.includes('crear') || text.includes('diseñar') || text.includes('construir')) {
    return 'crear';
  }
  
  return 'comprender'; // Por defecto
}

// Función para determinar el nivel de dificultad
function determineDifficultyLevel(description) {
  const text = description.toLowerCase();
  
  if (text.includes('básico') || text.includes('simple') || text.includes('inicial')) {
    return 1;
  } else if (text.includes('intermedio') || text.includes('medio')) {
    return 2;
  } else if (text.includes('avanzado') || text.includes('complejo')) {
    return 3;
  }
  
  return 2; // Por defecto
}

// Función para determinar la duración estimada
function estimateDuration(description) {
  const text = description.toLowerCase();
  
  if (text.includes('corto') || text.includes('rápido') || text.includes('breve')) {
    return 20;
  } else if (text.includes('largo') || text.includes('extenso') || text.includes('completo')) {
    return 60;
  }
  
  return 45; // Por defecto
}

// Función para procesar una fila de datos CSV
function processActivityRow(row, index) {
  const slug = generateSlug(row['NOMBRE ACTIVIDAD']);
  const oaIds = extractOAs(row['TEXTO DE LA CLASE']);
  const bloomLevel = determineBloomLevel(row['NOMBRE ACTIVIDAD'], row['TEXTO DE LA CLASE']);
  const difficultyLevel = determineDifficultyLevel(row['TEXTO DE LA CLASE']);
  const durationMinutes = estimateDuration(row['TEXTO DE LA CLASE']);
  
  // Separar instrucción general y específica
  const text = row['TEXTO DE LA CLASE'];
  const generalMatch = text.match(/Instrucción General:(.*?)(?=Instrucción Específica:|Objetivo:|$)/s);
  const specificMatch = text.match(/Instrucción Específica:(.*?)(?=Objetivo:|$)/s);
  const objectiveMatch = text.match(/Objetivo:(.*?)(?=Indicadores:|$)/s);
  const indicatorsMatch = text.match(/Indicadores:(.*?)(?=$)/s);
  
  const generalInstruction = generalMatch ? generalMatch[1].trim() : '';
  const specificInstruction = specificMatch ? specificMatch[1].trim() : '';
  const objectives = objectiveMatch ? [objectiveMatch[1].trim()] : [];
  const indicators = indicatorsMatch ? indicatorsMatch[1].trim() : '';
  
  // Procesar URLs de recursos
  const resourceUrls = row['URL RECURSO'] 
    ? row['URL RECURSO'].split(',').map(url => url.trim()).filter(url => url)
    : [];
  
  return {
    metadata: {
      id: generateSimpleId(),
      slug: slug,
      title: row['NOMBRE ACTIVIDAD'],
      product: row['PRODUCTO'],
      thematic_axis: row['EJE TEMATIC'],
      material_name: row['NOMBRE DE MATERIAL DIDACTICO'],
      status: 'active'
    },
    
    activity: {
      description: generalInstruction,
      steps_markdown: specificInstruction,
      learning_objectives: objectives,
      indicators_markdown: indicators,
      assessment_markdown: `- ¿Participa en la actividad?
- ¿Sigue las instrucciones?
- ¿Colabora con el grupo?
- ¿Alcanza los objetivos de aprendizaje?`,
      resource_urls: resourceUrls,
      cover_image_url: 'https://i.imgur.com/placeholder.png',
      video_url: '',
      oa_ids: oaIds,
      duration_minutes: durationMinutes,
      group_size: 4,
      bloom_level: bloomLevel,
      target_cycle: 'PK',
      difficulty_level: difficultyLevel,
      subject: 'Ciencias Naturales',
      grade_level: 'Pre-Kínder'
    },
    
    material: {
      name: row['NOMBRE DE MATERIAL DIDACTICO'],
      internal_code: `PARVULAB-M${String(index + 1).padStart(2, '0')}`,
      quantity_per_kit: 9
    }
  };
}

// Función principal para convertir CSV a archivos individuales
function convertCsvToActivities(csvData) {
  const activitiesDir = path.join(__dirname, '..', 'seed-data', 'activities');
  
  // Crear directorio si no existe
  if (!fs.existsSync(activitiesDir)) {
    fs.mkdirSync(activitiesDir, { recursive: true });
  }
  
  const activities = [];
  
  csvData.forEach((row, index) => {
    try {
      const activityData = processActivityRow(row, index);
      activities.push(activityData);
      
      // Crear archivo individual
      const fileName = `${String(index + 1).padStart(3, '0')}-${activityData.metadata.slug}.js`;
      const filePath = path.join(activitiesDir, fileName);
      
      const fileContent = `module.exports = ${JSON.stringify(activityData, null, 2)};`;
      fs.writeFileSync(filePath, fileContent);
      
      console.log(`✅ Creado: ${fileName}`);
    } catch (error) {
      console.error(`❌ Error procesando fila ${index + 1}:`, error.message);
    }
  });
  
  return activities;
}

// Ejemplo de uso con datos de ejemplo
const sampleData = [
  {
    'PRODUCTO': 'LABORATORIO MOVIL DE PARVULO',
    'EJE TEMATIC': 'VIDA Y RELACIONES',
    'NOMBRE DE MATERIAL DIDACTICO': 'MEMORICE EL ANIMAL',
    'NOMBRE ACTIVIDAD': 'El hábitat de los animales',
    'TEXTO DE LA CLASE': 'Instrucción General: La educadora dispone las 9 mesas... Instrucción Específica: Objetivo de la actividad... Objetivo: OA 7, OA 1, OA 10 Indicadores: Se integra espontáneamente...',
    'URL RECURSO': 'https://docs.google.com/presentation/d/1oxTbRqWMA0t2uws5YWen2kVdMQB-Eiy0/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
  }
];

// Función para procesar datos reales desde un archivo CSV
function processRealCsvData(csvFilePath) {
  // Aquí puedes implementar la lectura de tu archivo CSV real
  // Por ahora usamos datos de ejemplo
  console.log('📁 Procesando datos CSV...');
  const activities = convertCsvToActivities(sampleData);
  console.log(`✅ Procesadas ${activities.length} actividades`);
  return activities;
}

// Exportar funciones para uso externo
module.exports = {
  convertCsvToActivities,
  processRealCsvData,
  processActivityRow,
  generateSlug,
  generateSimpleId
};

// Ejecutar si se llama directamente
if (require.main === module) {
  processRealCsvData();
} 