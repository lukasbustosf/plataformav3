const fs = require('fs');
const path = require('path');

// Datos reales proporcionados por el usuario
const realCsvData = [
  {
    'PRODUCTO': 'LABORATORIO MOVIL DE PARVULO',
    'EJE TEMATIC': 'VIDA Y RELACIONES',
    'NOMBRE DE MATERIAL DIDACTICO': 'MEMORICE EL ANIMAL',
    'NOMBRE ACTIVIDAD': 'El hábitat de los animales',
    'TEXTO DE LA CLASE': `Instrucción General:

La educadora dispone las 9 mesas para realizar grupos.

Los párvulos se sientan en las mesas, donde tendrán dispuesto los juegos de memorice en el centro con las diferentes tarjetas de animales. 

La educadora motiva a los párvulos con un vídeo anexo y desarrolla la actividad didáctica con el juego de memorice. 

El jefe de grupo usa la gorra y es el encargado de:

    Compartir y repartir el recurso según las indicaciones de la educadora.
    Entregar la guía de trabajo y materiales a sus compañeros.
    Recoger y guardar el recurso en el laboratorio. 

Instrucción Específica:

Objetivo de la actividad: Reconocer a través de la observación y de la comparación los diferentes hábitats de los animales.  

La educadora para motivar a los párvulos los invita a observar el vídeo anexo del hábitat de los animales.

Luego los invita a observar y a manipular las tarjetas de los diferentes animales del memorice y les conversa acerca de cada uno de los animales que aparecen en las tarjetas, nombrando sus características y destacando donde habitan.

Les solicita a las niñas y a los niños poder colocar las tarjetas según el hábitat que les corresponde en las imágenes que están adjuntas en el PPT, proyectadas en la pizarra o en alguna pared donde los párvulos puedan pegar las tarjetas con los animales, con ayuda de una cinta masking, haciendo corresponder los animales con el hábitat proyectado. 

Después de agrupados los animales por hábitats, la educadora, con ayuda de los jefes de grupos, les proporciona los recursos, (papelógrafo, lápices de colores y plumones de colores). Les solicita a los párvulos escoger unos de los hábitats y representarlo en el papelógrafo junto con los animales del mismo.

Al final cada grupo tendrá un hábitat diferente con su respectiva tarjeta de animalito.

La educadora haciendo referencia a los hábitats pregunta a las niñas y niños:

    ¿Qué es un hábitat?
    ¿En qué lugar vive el conejo?
    ¿Dónde viven las tarántulas?
    ¿Alguno de esos animales pueden vivir con nosotros en casa?
    ¿Cuál de ellos?
    ¿Cuál no podría vivir en nuestras casas?
    ¿Conocen ustedes alguno de estos habitas?

Al terminar, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.

El jefe de grupo se encarga de recoger y guardar el recurso en el laboratorio.

Objetivo:

OA 7

Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.
OA 1

Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos.
OA 10

Reconocer progresivamente requerimientos esenciales de las prácticas de convivencia democrática, tales como: escucha de opiniones divergentes, el respeto por los demás, de los turnos, de los acuerdos de las mayorías.
Indicadores:

    Se integra espontáneamente en juegos grupales.

    Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.

    Practica algunas normas de convivencia democrática (escucha de opiniones divergentes, el respeto por los demás, los turnos, los acuerdos de la mayoría) ante la sugerencia de un adulto o par.`,
    'URL RECURSO': 'https://docs.google.com/presentation/d/1oxTbRqWMA0t2uws5YWen2kVdMQB-Eiy0/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true, https://docs.google.com/presentation/d/1LHrVhtwl77D6IQFTBHXv5ZswxSBc0QtH/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true, https://drive.google.com/file/d/1qzmZOsGvIkdR9aXBD1C0i5oKxD1EYkqQ/view?usp=drive_link, https://docs.google.com/document/d/1gJUuQ-OdGn_M2P3ju_TKRM0rBn0-yBHD/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
  },
  {
    'PRODUCTO': 'LABORATORIO MOVIL DE PARVULO',
    'EJE TEMATIC': 'VIDA Y RELACIONES',
    'NOMBRE DE MATERIAL DIDACTICO': 'MEMORICE EL ANIMAL',
    'NOMBRE ACTIVIDAD': 'Los sonidos mágicos de los animales',
    'TEXTO DE LA CLASE': `Instrucción General:

La educadora dispone las mesas para realizar 9 grupos.

Los párvulos se sientan en las mesas, donde hay juego Memorice de mascotas y cajas para contener el juego.

Los párvulos observan las fichas.

Los párvulos guiados por la educadora exploran el material, dando características de los animales que aparecen, juegan libremente durante un periodo de 5 minutos.

En cada grupo hay un jefe de grupo que usa la gorra y es el encargado de:

    Guardar la maleta en el laboratorio móvil.
    Entregar la guía de trabajo y materiales a sus compañeros.

Instrucción Específica:

Objetivo de la actividad: Asociar sonidos de los animales con sus respectivas imágenes.

La educadora ubica a los párvulos en 9 grupos de trabajo.

Les invita a observar y a interactuar con el video anexo y a imitar el sonido de los animales.

Les cuenta que en esta oportunidad van a jugar con los sonidos mágicos de los animales, les hace entrega de una caja, en su interior se encuentra el recurso pedagógico "memorice", les da algún tiempo para que lo exploren y luego realiza preguntas para activar conocimientos previos:

    ¿Qué ven en las tarjetas? 
    ¿Qué animales aparecen? 
    ¿Cuáles podrían ser sus mascotas?
    ¿Se acuerdan de todos los sonidos que hacen y vimos en el vídeo?

La educadora y los párvulos establecen una conversación en la que otorgan características a los animales que aparecen en las tarjetas, describiendo y relatando experiencias personales.

En un principio, la educadora les comenta a los párvulos que por turnos en cada grupo escogerán una tarjeta de la caja, luego cuando la educadora lo indique deberán realizar una representación con sonido de ese animal escogido en la tarjeta.

Poco a poco se puede ampliar el grado de complejidad del juego pidiendo que los párvulos representen a los animales.

Después que todos los grupos realicen los sonidos de los animales, la educadora, por puntos anotados en la pizarra, determina cuál grupo lo realizo mejor.

La educadora entrega guía de trabajo "Animales que hacen sonidos" al jefe de grupo, quien se las entrega a sus compañeros, junto con los materiales (lápiz, grafito, lápices de colores)

La educadora entrega las instrucciones necesarias para la realización de la guía de reforzamiento.

Finalmente, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.

El jefe de grupo junto con el resto del grupo guardan el material en el laboratorio para ser usado en otra oportunidad. 

Objetivo:

OA 6

Establecer relaciones de semejanzas y diferencias de animales y plantas, a partir de algunas características (tamaño, color, textura y morfología), sus necesidades básicas (formas de alimentación y abrigo), y los lugares que habitan, al observarlos en forma directa, en libros ilustrados o en TICs.
OA 10

Comunicar a otras personas desafíos alcanzados, identificando acciones que aportaron a su logro y definiendo nuevas metas.
Indicadores:

    Describe las acciones que le ayudaron a lograr sus objetivos en un juego o situación cotidiana.

    Describe características (reproducción, cubierta, desplazamiento, tamaño, morfología), necesidades básicas (alimentación y abrigo) y los lugares que habitan algunos animales.

    Describe semejanzas y diferencias entre plantas y animales según sus características, necesidades de alimentación y hábitat.`,
    'URL RECURSO': 'https://drive.google.com/file/d/1DFYMs3MgUD9iIYn2E768xVv_6FDyrHtx/view?usp=drive_link, https://docs.google.com/document/d/1yqJCijhibOqnxpHBBbZz1uiZySmDciFc/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true, https://docs.google.com/presentation/d/1bmPx2RKK5b3ZLhFulf76l0ljvYTTPVbe/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
  },
  {
    'PRODUCTO': 'LABORATORIO MOVIL DE PARVULO',
    'EJE TEMATIC': 'VIDA Y RELACIONES',
    'NOMBRE DE MATERIAL DIDACTICO': 'MEMORICE EL ANIMAL',
    'NOMBRE ACTIVIDAD': 'Mi mascota es mi amiga',
    'TEXTO DE LA CLASE': `Instrucción General:

La educadora dispone las mesas para realizar 8 grupos.

Los párvulos observan la canción "Mi mascota, mi amiga", del vídeo adjunto.

Los párvulos se sientan en las mesas, donde hay juego Memorice de mascotas y observan las fichas. Guiados por la educadora, exploran el material, dando características de los animales que aparecen, juegan libremente durante un periodo de 5 minutos.

En cada grupo hay un jefe de grupo que usa la gorra.

El jefe de grupo es el encargado de:

1.- Guardar la maleta en el laboratorio móvil.

2.- Entregar la guía de trabajo y materiales a sus compañeros.

Instrucción Específica:

Objetivo de la actividad: Memorizar donde se encuentran 2 fichas iguales entre varias fichas.

La educadora invita a los niños a ubicarse en círculo y ver el vídeo de la canción "Mi mascota, mi amigo"

Luego, la educadora realiza preguntas para activar conocimientos previos

    ¿Les gustó la canción? 
    ¿Qué mascotas aparecen? 
    ¿Quién de ustedes tiene una mascota?
    ¿Aparece en el vídeo tu mascota?

La educadora y los párvulos establecen una conversación en la que describen a los animales del vídeo, dando sus características y relatando experiencias personales.

La educadora entrega a cada una de las mesas una maleta con el juego "Memorice de mascotas", les da unos minutos para que exploren el material.


Para comenzar el juego, la educadora les pide voltear las tarjetas y ubicarlas en el centro de la mesa boca abajo, de manera que las imágenes no se vean mezclar. Por turno, cada niño o niña debe dar vuelta 2 fichas, el primer jugador dará la vuelta a dos cartas, si son iguales se las lleva, si estas son diferentes, se vuelven a dejar boca abajo en el mismo lugar en que se encontraban. Luego, le toca hacer lo mismo al siguiente jugador. El juego termina cuando no queda ninguna ficha sobre la mesa, ¡El ganador es aquel que al final del juego tiene la mayor cantidad de pares de tarjetas!


Una vez finalizado el juego, la educadora invita a los párvulos a guardar y ordenar las tarjetas en la maleta que corresponde y se las entregan al jefe de grupo, quien es el encargado de recolectar el material y guardar en el laboratorio móvil para usarlo en otra oportunidad.

La educadora entrega guía de trabajo (mi mascota, mi amiga) al jefe de grupo, quien se las entrega a sus compañeros, junto con los materiales (lápiz grafito, lápices de colores), los párvulos dibujan cuál de los animalitos les gustaría tener de mascota.

Finalmente, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.

Objetivo:

OA 7

Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.
OA 1

Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos.
Indicadores:

    Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.

    Se integra espontáneamente en juegos grupales.`,
    'URL RECURSO': 'https://docs.google.com/presentation/d/1REzfB4U2aRNFT_H-mLcLw4fPIWhqb32p/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true, https://drive.google.com/file/d/1ussN3pH8thmOVecYAgsCq3fC4_tCo4Wx/view?usp=drive_link, https://docs.google.com/document/d/1I42JC0mGfs2m7Ez3b4Ld4Y5rhtu2ShUJ/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
  }
];

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

// Función para generar un UUID simple
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

// Función para extraer objetivos de aprendizaje completos
function extractLearningObjectives(text) {
  const objectives = [];
  const oaMatches = text.match(/OA\s+\d+[^O]*?(?=OA\s+\d+|Indicadores:|$)/gs);
  
  if (oaMatches) {
    oaMatches.forEach(match => {
      const cleanMatch = match.trim();
      if (cleanMatch) {
        objectives.push(cleanMatch);
      }
    });
  }
  
  return objectives;
}

// Función para extraer indicadores
function extractIndicators(text) {
  const indicatorsMatch = text.match(/Indicadores:(.*?)(?=$)/s);
  if (indicatorsMatch) {
    return indicatorsMatch[1].trim();
  }
  return '';
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
  const learningObjectives = extractLearningObjectives(row['TEXTO DE LA CLASE']);
  const indicators = extractIndicators(row['TEXTO DE LA CLASE']);
  const bloomLevel = determineBloomLevel(row['NOMBRE ACTIVIDAD'], row['TEXTO DE LA CLASE']);
  const difficultyLevel = determineDifficultyLevel(row['TEXTO DE LA CLASE']);
  const durationMinutes = estimateDuration(row['TEXTO DE LA CLASE']);
  
  // Separar instrucción general y específica
  const text = row['TEXTO DE LA CLASE'];
  const generalMatch = text.match(/Instrucción General:(.*?)(?=Instrucción Específica:|Objetivo:|$)/s);
  const specificMatch = text.match(/Instrucción Específica:(.*?)(?=Objetivo:|$)/s);
  
  const generalInstruction = generalMatch ? generalMatch[1].trim() : '';
  const specificInstruction = specificMatch ? specificMatch[1].trim() : '';
  
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
      learning_objectives: learningObjectives,
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

// Función principal
function main() {
  console.log('📁 Procesando datos CSV reales...');
  const activities = convertCsvToActivities(realCsvData);
  console.log(`✅ Procesadas ${activities.length} actividades`);
  
  console.log('\n📊 Resumen de actividades creadas:');
  activities.forEach((activity, index) => {
    console.log(`${index + 1}. ${activity.metadata.title}`);
    console.log(`   - Slug: ${activity.metadata.slug}`);
    console.log(`   - OAs: ${activity.activity.oa_ids.join(', ')}`);
    console.log(`   - Material: ${activity.material.name}`);
    console.log('');
  });
  
  console.log('🎯 Para ejecutar el seed modular:');
  console.log('cd server/prisma && node seed-modular.js');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  convertCsvToActivities,
  processActivityRow,
  generateSlug,
  generateSimpleId,
  realCsvData
}; 