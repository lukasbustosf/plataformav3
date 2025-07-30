const fs = require('fs');
const path = require('path');

// Función para generar un slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Función para generar UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Actividad 1: El hábitat de los animales
const actividad1 = {
  metadata: {
    id: generateUUID(),
    slug: 'el-habitat-de-los-animales',
    title: 'El hábitat de los animales',
    product: 'LABORATORIO MOVIL DE PARVULO',
    thematic_axis: 'VIDA Y RELACIONES',
    material_name: 'MEMORICE EL ANIMAL',
    status: 'active'
  },
  activity: {
    description: `Instrucción General:

La educadora dispone las 9 mesas para realizar grupos.

Los párvulos se sientan en las mesas, donde tendrán dispuesto los juegos de memorice en el centro con las diferentes tarjetas de animales. 

La educadora motiva a los párvulos con un vídeo anexo y desarrolla la actividad didáctica con el juego de memorice. 

El jefe de grupo usa la gorra y es el encargado de:

    Compartir y repartir el recurso según las indicaciones de la educadora.
    Entregar la guía de trabajo y materiales a sus compañeros.
    Recoger y guardar el recurso en el laboratorio.`,
    steps_markdown: `Instrucción Específica:

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

El jefe de grupo se encarga de recoger y guardar el recurso en el laboratorio.`,
    learning_objectives: [
      "OA 7: Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.",
      "OA 1: Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos.",
      "OA 10: Reconocer progresivamente requerimientos esenciales de las prácticas de convivencia democrática, tales como: escucha de opiniones divergentes, el respeto por los demás, de los turnos, de los acuerdos de las mayorías."
    ],
    indicators_markdown: `- Se integra espontáneamente en juegos grupales.

- Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.

- Practica algunas normas de convivencia democrática (escucha de opiniones divergentes, el respeto por los demás, los turnos, los acuerdos de la mayoría) ante la sugerencia de un adulto o par.`,
    assessment_markdown: `- ¿Reconoce hábitats de animales?
- ¿Participa en la actividad grupal?
- ¿Nombra características de los animales?
- ¿Respeta turnos y opiniones?`,
    resource_urls: [
      'https://docs.google.com/presentation/d/1oxTbRqWMA0t2uws5YWen2kVdMQB-Eiy0/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
      'https://docs.google.com/presentation/d/1LHrVhtwl77D6IQFTBHXv5ZswxSBc0QtH/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
      'https://drive.google.com/file/d/1qzmZOsGvIkdR9aXBD1C0i5oKxD1EYkqQ/view?usp=drive_link',
      'https://docs.google.com/document/d/1gJUuQ-OdGn_M2P3ju_TKRM0rBn0-yBHD/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
    ],
    cover_image_url: 'https://i.imgur.com/3MTaG0S.png',
    video_url: 'https://www.youtube.com/watch?v=O22z32cnG9s',
    oa_ids: ['OA 7', 'OA 1', 'OA 10'],
    duration_minutes: 45,
    group_size: 4,
    bloom_level: 'comprender',
    target_cycle: 'PK',
    difficulty_level: 2,
    subject: 'Ciencias Naturales',
    grade_level: 'Pre-Kínder'
  },
  material: {
    name: 'MEMORICE EL ANIMAL',
    internal_code: 'PARVULAB-M05',
    quantity_per_kit: 9
  }
};

// Actividad 2: Los sonidos mágicos de los animales
const actividad2 = {
  metadata: {
    id: generateUUID(),
    slug: 'los-sonidos-magicos-de-los-animales',
    title: 'Los sonidos mágicos de los animales',
    product: 'LABORATORIO MOVIL DE PARVULO',
    thematic_axis: 'VIDA Y RELACIONES',
    material_name: 'MEMORICE EL ANIMAL',
    status: 'active'
  },
  activity: {
    description: `Instrucción General:

La educadora dispone las mesas para realizar 9 grupos.

Los párvulos se sientan en las mesas, donde hay juego Memorice de mascotas y cajas para contener el juego.

Los párvulos observan las fichas.

Los párvulos guiados por la educadora exploran el material, dando características de los animales que aparecen, juegan libremente durante un periodo de 5 minutos.

En cada grupo hay un jefe de grupo que usa la gorra y es el encargado de:

    Guardar la maleta en el laboratorio móvil.
    Entregar la guía de trabajo y materiales a sus compañeros.`,
    steps_markdown: `Instrucción Específica:

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

El jefe de grupo junto con el resto del grupo guardan el material en el laboratorio para ser usado en otra oportunidad.`,
    learning_objectives: [
      "OA 6: Establecer relaciones de semejanzas y diferencias de animales y plantas, a partir de algunas características (tamaño, color, textura y morfología), sus necesidades básicas (formas de alimentación y abrigo), y los lugares que habitan, al observarlos en forma directa, en libros ilustrados o en TICs.",
      "OA 10: Comunicar a otras personas desafíos alcanzados, identificando acciones que aportaron a su logro y definiendo nuevas metas."
    ],
    indicators_markdown: `- Describe las acciones que le ayudaron a lograr sus objetivos en un juego o situación cotidiana.

- Describe características (reproducción, cubierta, desplazamiento, tamaño, morfología), necesidades básicas (alimentación y abrigo) y los lugares que habitan algunos animales.

- Describe semejanzas y diferencias entre plantas y animales según sus características, necesidades de alimentación y hábitat.`,
    assessment_markdown: `- ¿Asocia sonidos con animales?
- ¿Participa en la actividad grupal?
- ¿Describe características de los animales?
- ¿Comunica sus logros?`,
    resource_urls: [
      'https://drive.google.com/file/d/1DFYMs3MgUD9iIYn2E768xVv_6FDyrHtx/view?usp=drive_link',
      'https://docs.google.com/document/d/1yqJCijhibOqnxpHBBbZz1uiZySmDciFc/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
      'https://docs.google.com/presentation/d/1bmPx2RKK5b3ZLhFulf76l0ljvYTTPVbe/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
    ],
    cover_image_url: 'https://i.imgur.com/example2.png',
    video_url: 'https://www.youtube.com/watch?v=example2',
    oa_ids: ['OA 6', 'OA 10'],
    duration_minutes: 40,
    group_size: 4,
    bloom_level: 'recordar',
    target_cycle: 'PK',
    difficulty_level: 1,
    subject: 'Ciencias Naturales',
    grade_level: 'Pre-Kínder'
  },
  material: {
    name: 'MEMORICE EL ANIMAL',
    internal_code: 'PARVULAB-M05',
    quantity_per_kit: 9
  }
};

// Actividad 3: Mi mascota es mi amiga
const actividad3 = {
  metadata: {
    id: generateUUID(),
    slug: 'mi-mascota-es-mi-amiga',
    title: 'Mi mascota es mi amiga',
    product: 'LABORATORIO MOVIL DE PARVULO',
    thematic_axis: 'VIDA Y RELACIONES',
    material_name: 'MEMORICE EL ANIMAL',
    status: 'active'
  },
  activity: {
    description: `Instrucción General:

La educadora dispone las mesas para realizar 8 grupos.

Los párvulos observan la canción "Mi mascota, mi amiga", del vídeo adjunto.

Los párvulos se sientan en las mesas, donde hay juego Memorice de mascotas y observan las fichas. Guiados por la educadora, exploran el material, dando características de los animales que aparecen, juegan libremente durante un periodo de 5 minutos.

En cada grupo hay un jefe de grupo que usa la gorra.

El jefe de grupo es el encargado de:

1.- Guardar la maleta en el laboratorio móvil.

2.- Entregar la guía de trabajo y materiales a sus compañeros.`,
    steps_markdown: `Instrucción Específica:

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

Finalmente, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.`,
    learning_objectives: [
      "OA 7: Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.",
      "OA 1: Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos."
    ],
    indicators_markdown: `- Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.

- Se integra espontáneamente en juegos grupales.`,
    assessment_markdown: `- ¿Memoriza posiciones de fichas?
- ¿Participa en la actividad grupal?
- ¿Respeta turnos del juego?
- ¿Dibuja su mascota preferida?`,
    resource_urls: [
      'https://docs.google.com/presentation/d/1REzfB4U2aRNFT_H-mLcLw4fPIWhqb32p/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
      'https://drive.google.com/file/d/1ussN3pH8thmOVecYAgsCq3fC4_tCo4Wx/view?usp=drive_link',
      'https://docs.google.com/document/d/1I42JC0mGfs2m7Ez3b4Ld4Y5rhtu2ShUJ/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
    ],
    cover_image_url: 'https://i.imgur.com/example3.png',
    video_url: 'https://www.youtube.com/watch?v=example3',
    oa_ids: ['OA 7', 'OA 1'],
    duration_minutes: 35,
    group_size: 4,
    bloom_level: 'recordar',
    target_cycle: 'PK',
    difficulty_level: 1,
    subject: 'Ciencias Naturales',
    grade_level: 'Pre-Kínder'
  },
  material: {
    name: 'MEMORICE EL ANIMAL',
    internal_code: 'PARVULAB-M05',
    quantity_per_kit: 9
  }
};

// Función para crear archivos
function createActivityFiles() {
  const activitiesDir = path.join(__dirname, '..', 'seed-data', 'activities');
  
  // Crear directorio si no existe
  if (!fs.existsSync(activitiesDir)) {
    fs.mkdirSync(activitiesDir, { recursive: true });
  }
  
  const activities = [actividad1, actividad2, actividad3];
  
  activities.forEach((activity, index) => {
    const fileName = `${String(index + 1).padStart(3, '0')}-${activity.metadata.slug}.js`;
    const filePath = path.join(activitiesDir, fileName);
    
    const fileContent = `module.exports = ${JSON.stringify(activity, null, 2)};`;
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`✅ Creado: ${fileName}`);
  });
  
  return activities;
}

// Función principal
function main() {
  console.log('📁 Creando archivos de actividades...');
  const activities = createActivityFiles();
  console.log(`✅ Creadas ${activities.length} actividades`);
  
  console.log('\n📊 Resumen:');
  activities.forEach((activity, index) => {
    console.log(`${index + 1}. ${activity.metadata.title}`);
    console.log(`   - Slug: ${activity.metadata.slug}`);
    console.log(`   - OAs: ${activity.activity.oa_ids.join(', ')}`);
    console.log('');
  });
  
  console.log('🎯 Para ejecutar el seed modular:');
  console.log('node seed-modular.js');
}

// Ejecutar
main(); 