/**
 * Demo Questions Data for All 24 Game Formats
 * Each format has questions optimized for its specific gameplay mechanics
 */

function getQuestionsForFormat(format) {
  const questionData = {
    
    // ============= BASIC GAMES (G-01 to G-09) =============
    
    trivia_lightning: [
      {
        stem: '¿Cuál es la capital de Chile?',
        type: 'multiple_choice',
        options: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena'],
        correct: 'Santiago',
        explanation: 'Santiago es la capital y ciudad más poblada de Chile.',
        bloom: 'Recordar'
      },
      {
        stem: '¿Cuánto es 7 × 8?',
        type: 'multiple_choice',
        options: ['54', '56', '58', '64'],
        correct: '56',
        explanation: '7 × 8 = 56',
        bloom: 'Aplicar'
      },
      {
        stem: '¿Qué planeta está más cerca del Sol?',
        type: 'multiple_choice',
        options: ['Venus', 'Mercurio', 'Tierra', 'Marte'],
        correct: 'Mercurio',
        explanation: 'Mercurio es el planeta más cercano al Sol.',
        bloom: 'Recordar'
      },
      {
        stem: '¿Cuál es el resultado de 25 + 17?',
        type: 'multiple_choice',
        options: ['40', '42', '43', '45'],
        correct: '42',
        explanation: '25 + 17 = 42',
        bloom: 'Aplicar'
      },
      {
        stem: '¿En qué continente está Chile?',
        type: 'multiple_choice',
        options: ['América del Norte', 'América del Sur', 'Europa', 'Asia'],
        correct: 'América del Sur',
        explanation: 'Chile está ubicado en América del Sur.',
        bloom: 'Recordar'
      }
    ],

    color_match: [
      {
        stem: '¿Qué color se forma mezclando azul y amarillo?',
        type: 'multiple_choice',
        options: ['🟢 Verde', '🟣 Morado', '🟠 Naranja', '🔴 Rojo'],
        correct: '🟢 Verde',
        explanation: 'Azul + Amarillo = Verde',
        bloom: 'Comprender'
      },
      {
        stem: '¿Cuál es un color primario?',
        type: 'multiple_choice',
        options: ['🟢 Verde', '🟣 Morado', '🔴 Rojo', '🟠 Naranja'],
        correct: '🔴 Rojo',
        explanation: 'Los colores primarios son rojo, azul y amarillo.',
        bloom: 'Recordar'
      },
      {
        stem: '¿Qué forma tiene un círculo?',
        type: 'multiple_choice',
        options: ['⭕ Redonda', '⬜ Cuadrada', '🔺 Triangular', '⬭ Rectangular'],
        correct: '⭕ Redonda',
        explanation: 'Un círculo es una forma redonda.',
        bloom: 'Recordar'
      },
      {
        stem: '¿Cuántos lados tiene un triángulo?',
        type: 'multiple_choice',
        options: ['🔢 2', '🔢 3', '🔢 4', '🔢 5'],
        correct: '🔢 3',
        explanation: 'Un triángulo tiene exactamente 3 lados.',
        bloom: 'Recordar'
      }
    ],

    memory_flip: [
      {
        stem: 'Pareja 1: ¿Cuál es la capital de Francia?',
        type: 'multiple_choice',
        options: ['París', 'Londres', 'Madrid', 'Roma'],
        correct: 'París',
        explanation: 'París es la capital de Francia.',
        bloom: 'Recordar'
      },
      {
        stem: 'Pareja 1: ¿Qué país tiene como capital París?',
        type: 'multiple_choice',
        options: ['España', 'Italia', 'Francia', 'Inglaterra'],
        correct: 'Francia',
        explanation: 'Francia tiene como capital París.',
        bloom: 'Recordar'
      },
      {
        stem: 'Pareja 2: ¿Cuánto es 5 × 6?',
        type: 'multiple_choice',
        options: ['25', '30', '35', '40'],
        correct: '30',
        explanation: '5 × 6 = 30',
        bloom: 'Aplicar'
      },
      {
        stem: 'Pareja 2: ¿Cuál es el resultado de seis veces cinco?',
        type: 'multiple_choice',
        options: ['25', '30', '35', '40'],
        correct: '30',
        explanation: '6 × 5 = 30',
        bloom: 'Aplicar'
      }
    ],

    picture_bingo: [
      {
        stem: '🐱 ¿Qué animal ves en la imagen?',
        type: 'multiple_choice',
        options: ['Perro', 'Gato', 'Conejo', 'Hamster'],
        correct: 'Gato',
        explanation: 'La imagen muestra un gato.',
        bloom: 'Recordar'
      },
      {
        stem: '🌳 ¿Qué elemento de la naturaleza representa esta imagen?',
        type: 'multiple_choice',
        options: ['Flor', 'Árbol', 'Montaña', 'Río'],
        correct: 'Árbol',
        explanation: 'La imagen representa un árbol.',
        bloom: 'Recordar'
      },
      {
        stem: '🚗 ¿Qué medio de transporte se muestra?',
        type: 'multiple_choice',
        options: ['Bicicleta', 'Auto', 'Avión', 'Barco'],
        correct: 'Auto',
        explanation: 'La imagen muestra un automóvil.',
        bloom: 'Recordar'
      },
      {
        stem: '🍎 ¿Qué fruta aparece en la imagen?',
        type: 'multiple_choice',
        options: ['Manzana', 'Naranja', 'Plátano', 'Uva'],
        correct: 'Manzana',
        explanation: 'La imagen muestra una manzana.',
        bloom: 'Recordar'
      }
    ],

    drag_drop_sorting: [
      {
        stem: 'Clasifica: ¿A qué categoría pertenece la MANZANA?',
        type: 'multiple_choice',
        options: ['🍎 Frutas', '🥕 Verduras', '🥩 Carnes', '🍞 Cereales'],
        correct: '🍎 Frutas',
        explanation: 'La manzana es una fruta.',
        bloom: 'Comprender'
      },
      {
        stem: 'Clasifica: ¿A qué categoría pertenece el LEÓN?',
        type: 'multiple_choice',
        options: ['🐠 Peces', '🦅 Aves', '🦁 Mamíferos', '🐸 Anfibios'],
        correct: '🦁 Mamíferos',
        explanation: 'El león es un mamífero.',
        bloom: 'Comprender'
      },
      {
        stem: 'Clasifica: ¿A qué categoría pertenece el número 15?',
        type: 'multiple_choice',
        options: ['🔢 Pares', '🔢 Impares', '🔢 Negativos', '🔢 Decimales'],
        correct: '🔢 Impares',
        explanation: '15 es un número impar.',
        bloom: 'Comprender'
      },
      {
        stem: 'Clasifica: ¿A qué categoría pertenece el TRIÁNGULO?',
        type: 'multiple_choice',
        options: ['📐 Polígonos', '⭕ Círculos', '📏 Líneas', '📍 Puntos'],
        correct: '📐 Polígonos',
        explanation: 'El triángulo es un polígono de tres lados.',
        bloom: 'Comprender'
      }
    ],

    number_line_race: [
      {
        stem: '¿Cuál es el siguiente número en la secuencia: 2, 4, 6, 8, ___?',
        type: 'multiple_choice',
        options: ['9', '10', '11', '12'],
        correct: '10',
        explanation: 'La secuencia aumenta de 2 en 2: 2, 4, 6, 8, 10.',
        bloom: 'Aplicar'
      },
      {
        stem: 'En la recta numérica, ¿qué número está entre 7 y 9?',
        type: 'multiple_choice',
        options: ['6', '7', '8', '10'],
        correct: '8',
        explanation: 'Entre 7 y 9 está el número 8.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Si estoy en el número 12 y retrocedo 5 posiciones, ¿dónde llego?',
        type: 'multiple_choice',
        options: ['6', '7', '8', '17'],
        correct: '7',
        explanation: '12 - 5 = 7',
        bloom: 'Aplicar'
      },
      {
        stem: '¿Cuál es el resultado de 3 + 4 en la recta numérica?',
        type: 'multiple_choice',
        options: ['6', '7', '8', '9'],
        correct: '7',
        explanation: 'Partiendo del 3 y avanzando 4 posiciones: 3 + 4 = 7.',
        bloom: 'Aplicar'
      }
    ],

    word_builder: [
      {
        stem: 'Construye la palabra: ¿Cómo se escribe el animal que hace "miau"?',
        type: 'multiple_choice',
        options: ['G-A-T-O', 'P-E-R-R-O', 'P-A-T-O', 'G-A-L-L-O'],
        correct: 'G-A-T-O',
        explanation: 'El gato es el animal que hace "miau".',
        bloom: 'Aplicar'
      },
      {
        stem: 'Construye la palabra: ¿Cómo se escribe el color del cielo?',
        type: 'multiple_choice',
        options: ['A-Z-U-L', 'R-O-J-O', 'V-E-R-D-E', 'A-M-A-R-I-L-L-O'],
        correct: 'A-Z-U-L',
        explanation: 'El cielo es de color azul.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Construye la palabra: ¿Cómo se escribe el número después del 4?',
        type: 'multiple_choice',
        options: ['C-I-N-C-O', 'C-U-A-T-R-O', 'S-E-I-S', 'T-R-E-S'],
        correct: 'C-I-N-C-O',
        explanation: 'Después del 4 viene el 5 (cinco).',
        bloom: 'Aplicar'
      },
      {
        stem: 'Construye la palabra: ¿Cómo se escribe el lugar donde vivimos?',
        type: 'multiple_choice',
        options: ['C-A-S-A', 'E-S-C-U-E-L-A', 'P-A-R-Q-U-E', 'T-I-E-N-D-A'],
        correct: 'C-A-S-A',
        explanation: 'Vivimos en una casa.',
        bloom: 'Aplicar'
      }
    ],

    word_search: [
      {
        stem: 'Busca la palabra: En la sopa de letras, encuentra "AGUA"',
        type: 'multiple_choice',
        options: ['A-G-U-A (horizontal)', 'A-G-U-A (vertical)', 'A-G-U-A (diagonal)', 'No está'],
        correct: 'A-G-U-A (horizontal)',
        explanation: 'La palabra AGUA se encuentra en posición horizontal.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Busca la palabra: En la sopa de letras, encuentra "SOL"',
        type: 'multiple_choice',
        options: ['S-O-L (arriba-abajo)', 'S-O-L (izq-der)', 'S-O-L (diagonal)', 'No está'],
        correct: 'S-O-L (izq-der)',
        explanation: 'La palabra SOL se encuentra de izquierda a derecha.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Busca la palabra: En la sopa de letras, encuentra "CASA"',
        type: 'multiple_choice',
        options: ['C-A-S-A (horizontal)', 'C-A-S-A (vertical)', 'C-A-S-A (diagonal)', 'No está'],
        correct: 'C-A-S-A (vertical)',
        explanation: 'La palabra CASA se encuentra en posición vertical.',
        bloom: 'Aplicar'
      }
    ],

    hangman_visual: [
      {
        stem: 'Adivina: _ _ T _  (Animal doméstico que hace "miau")',
        type: 'multiple_choice',
        options: ['G', 'P', 'R', 'S'],
        correct: 'G',
        explanation: 'La palabra es GATO. La letra que falta al inicio es G.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Adivina: A _ U L  (Color del cielo despejado)',
        type: 'multiple_choice',
        options: ['Z', 'R', 'M', 'N'],
        correct: 'Z',
        explanation: 'La palabra es AZUL. La letra que falta es Z.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Adivina: _ A S A  (Lugar donde vivimos)',
        type: 'multiple_choice',
        options: ['C', 'M', 'P', 'B'],
        correct: 'C',
        explanation: 'La palabra es CASA. La letra que falta al inicio es C.',
        bloom: 'Aplicar'
      }
    ],

    // ============= ADVANCED GAMES (G-10 to G-16) =============

    escape_room_mini: [
      {
        stem: 'Puzzle 1: Para abrir la puerta necesitas el código. Si A=1, B=2, C=3... ¿Cuál es el valor de "CAB"?',
        type: 'multiple_choice',
        options: ['312', '321', '123', '132'],
        correct: '312',
        explanation: 'C=3, A=1, B=2, entonces CAB = 312.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Puzzle 2: Encontraste una llave con números: 2, 4, 6, 8, ¿cuál sigue?',
        type: 'multiple_choice',
        options: ['9', '10', '11', '12'],
        correct: '10',
        explanation: 'La secuencia aumenta de 2 en 2: 2, 4, 6, 8, 10.',
        bloom: 'Analizar'
      },
      {
        stem: 'Puzzle 3: En el espejo ves "SALIDA" al revés. ¿Cómo se ve?',
        type: 'multiple_choice',
        options: ['ADILAS', 'ADELAS', 'ADIALS', 'SALIDA'],
        correct: 'ADILAS',
        explanation: 'SALIDA al revés se lee ADILAS.',
        bloom: 'Analizar'
      }
    ],

    story_path: [
      {
        stem: 'Historia: Caminas por el bosque y ves dos senderos. ¿Qué eliges?',
        type: 'multiple_choice',
        options: ['🌸 Sendero con flores', '🌲 Sendero con árboles altos', '⬅️ Regresar', '🧭 Usar brújula'],
        correct: '🌸 Sendero con flores',
        explanation: 'El sendero con flores te lleva a un hermoso jardín secreto.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Historia: Encuentras una casa abandonada. ¿Qué haces?',
        type: 'multiple_choice',
        options: ['🚪 Entrar por la puerta', '🪟 Mirar por la ventana', '🔍 Investigar alrededor', '🏃 Alejarse'],
        correct: '🔍 Investigar alrededor',
        explanation: 'Investigar alrededor es la opción más segura y revela pistas importantes.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Historia: Aparece un animal herido. ¿Cómo actúas?',
        type: 'multiple_choice',
        options: ['💊 Intentar curarlo', '🏃 Huir rápidamente', '📞 Buscar ayuda', '🥤 Darle agua'],
        correct: '📞 Buscar ayuda',
        explanation: 'Buscar ayuda profesional es lo más responsable para el animal.',
        bloom: 'Evaluar'
      }
    ],

    board_race: [
      {
        stem: 'Pregunta de avance: ¿Cuál es la capital de Argentina?',
        type: 'multiple_choice',
        options: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
        correct: 'Buenos Aires',
        explanation: 'Buenos Aires es la capital de Argentina.',
        bloom: 'Recordar'
      },
      {
        stem: 'Pregunta de avance: ¿Cuánto es 12 ÷ 3?',
        type: 'multiple_choice',
        options: ['3', '4', '5', '6'],
        correct: '4',
        explanation: '12 ÷ 3 = 4',
        bloom: 'Aplicar'
      },
      {
        stem: 'Pregunta de avance: ¿Qué gas respiramos principalmente?',
        type: 'multiple_choice',
        options: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Hidrógeno'],
        correct: 'Oxígeno',
        explanation: 'Los seres humanos respiramos principalmente oxígeno.',
        bloom: 'Recordar'
      },
      {
        stem: 'Pregunta de avance: ¿En qué año llegó Cristóbal Colón a América?',
        type: 'multiple_choice',
        options: ['1491', '1492', '1493', '1494'],
        correct: '1492',
        explanation: 'Cristóbal Colón llegó a América en 1492.',
        bloom: 'Recordar'
      }
    ],

    crossword: [
      {
        stem: 'Animal que hace "miau"',
        type: 'crossword_clue',
        options: ['GATO', 'PERRO', 'PATO', 'LORO'],
        correct: 'GATO',
        explanation: 'El gato es el animal que hace "miau".',
        bloom: 'Recordar'
      },
      {
        stem: 'Color del cielo despejado',
        type: 'crossword_clue',
        options: ['AZUL', 'ROJO', 'VERDE', 'NEGRO'],
        correct: 'AZUL',
        explanation: 'El cielo despejado es de color azul.',
        bloom: 'Recordar'
      },
      {
        stem: 'Cinco más tres',
        type: 'crossword_clue',
        options: ['OCHO', 'SIETE', 'NUEVE', 'SEIS'],
        correct: 'OCHO',
        explanation: '5 + 3 = 8 (ocho)',
        bloom: 'Aplicar'
      },
      {
        stem: 'Día después del viernes',
        type: 'crossword_clue',
        options: ['SABADO', 'DOMINGO', 'LUNES', 'JUEVES'],
        correct: 'SABADO',
        explanation: 'Después del viernes viene el sábado.',
        bloom: 'Recordar'
      },
      {
        stem: 'Estación más calurosa',
        type: 'crossword_clue',
        options: ['VERANO', 'INVIERNO', 'PRIMAVERA', 'OTONO'],
        correct: 'VERANO',
        explanation: 'El verano es la estación más calurosa del año.',
        bloom: 'Recordar'
      },
      {
        stem: 'Capital de Chile',
        type: 'crossword_clue',
        options: ['SANTIAGO', 'VALPARAISO', 'CONCEPCION', 'SERENA'],
        correct: 'SANTIAGO',
        explanation: 'Santiago es la capital de Chile.',
        bloom: 'Recordar'
      }
    ],

    word_search_duel: [
      {
        stem: '¡Duelo! Encuentra rápido: "ESCUELA" en la sopa de letras',
        type: 'multiple_choice',
        options: ['Fila 2, posición 3-9', 'Fila 4, posición 1-7', 'Columna 3, posición 2-8', 'Diagonal desde A1'],
        correct: 'Fila 2, posición 3-9',
        explanation: 'ESCUELA se encuentra en la fila 2, desde la posición 3 hasta la 9.',
        bloom: 'Aplicar'
      },
      {
        stem: '¡Duelo! Encuentra rápido: "LIBRO" en la sopa de letras',
        type: 'multiple_choice',
        options: ['Vertical columna 5', 'Horizontal fila 3', 'Diagonal descendente', 'No está presente'],
        correct: 'Vertical columna 5',
        explanation: 'LIBRO se encuentra en vertical en la columna 5.',
        bloom: 'Aplicar'
      },
      {
        stem: '¡Duelo! Encuentra rápido: "AMIGO" en la sopa de letras',
        type: 'multiple_choice',
        options: ['Diagonal ascendente', 'Horizontal al revés', 'Vertical descendente', 'Esquina superior'],
        correct: 'Diagonal ascendente',
        explanation: 'AMIGO se encuentra en diagonal ascendente.',
        bloom: 'Aplicar'
      }
    ],

    timed_equation_duel: [
      {
        stem: '⚡ Resuelve rápido: 15 + 23 = ?',
        type: 'multiple_choice',
        options: ['37', '38', '39', '40'],
        correct: '38',
        explanation: '15 + 23 = 38',
        bloom: 'Aplicar',
        difficulty: 'easy'
      },
      {
        stem: '⚡ Resuelve rápido: 9 × 7 = ?',
        type: 'multiple_choice',
        options: ['61', '62', '63', '64'],
        correct: '63',
        explanation: '9 × 7 = 63',
        bloom: 'Aplicar',
        difficulty: 'easy'
      },
      {
        stem: '⚡ Resuelve rápido: 84 ÷ 4 = ?',
        type: 'multiple_choice',
        options: ['20', '21', '22', '23'],
        correct: '21',
        explanation: '84 ÷ 4 = 21',
        bloom: 'Aplicar',
        difficulty: 'medium'
      },
      {
        stem: '⚡ Resuelve rápido: 6² = ?',
        type: 'multiple_choice',
        options: ['32', '34', '36', '38'],
        correct: '36',
        explanation: '6² = 6 × 6 = 36',
        bloom: 'Aplicar',
        difficulty: 'medium'
      },
      {
        stem: '⚡ Resuelve rápido: 12 × 8 - 20 = ?',
        type: 'multiple_choice',
        options: ['74', '76', '78', '80'],
        correct: '76',
        explanation: '12 × 8 = 96, luego 96 - 20 = 76',
        bloom: 'Aplicar',
        difficulty: 'hard'
      },
      {
        stem: '⚡ Resuelve rápido: √144 = ?',
        type: 'multiple_choice',
        options: ['10', '11', '12', '13'],
        correct: '12',
        explanation: '√144 = 12 porque 12 × 12 = 144',
        bloom: 'Aplicar',
        difficulty: 'hard'
      }
    ],

    mystery_box_reveal: [
      {
        stem: '🔍 Pista 1: Es redondo y anaranjado. ¿Qué podría ser?',
        type: 'multiple_choice',
        options: ['Una pelota', 'Una naranja', 'El sol', 'Todas las anteriores'],
        correct: 'Todas las anteriores',
        explanation: 'Con solo esta pista, podría ser cualquiera de estas opciones.',
        bloom: 'Analizar'
      },
      {
        stem: '🔍 Pista 2: Además es una fruta cítrica. ¿Qué es?',
        type: 'multiple_choice',
        options: ['Una pelota', 'Una naranja', 'El sol', 'Un globo'],
        correct: 'Una naranja',
        explanation: 'Al ser una fruta cítrica, redonda y anaranjada, es una naranja.',
        bloom: 'Analizar'
      },
      {
        stem: '🔍 Pista 3: Se puede exprimir para hacer jugo. Confirma tu respuesta:',
        type: 'multiple_choice',
        options: ['Definitivamente una naranja', 'Podría ser un limón', 'Es una mandarina', 'No estoy seguro'],
        correct: 'Definitivamente una naranja',
        explanation: 'Todas las pistas confirman que es una naranja.',
        bloom: 'Evaluar'
      }
    ],

    // ============= CRITICAL THINKING (G-17 to G-24) =============

    debate_cards: [
      {
        stem: 'Debate: "Los videojuegos son beneficiosos para el aprendizaje". ¿Cuál es tu postura?',
        type: 'multiple_choice',
        options: ['💚 A favor - Desarrollan habilidades', '❤️ A favor - Son motivadores', '💛 En contra - Causan adicción', '💙 En contra - Distraen del estudio'],
        correct: '💚 A favor - Desarrollan habilidades',
        explanation: 'Los videojuegos pueden desarrollar habilidades cognitivas, coordinación y resolución de problemas.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Debate: "Las tareas escolares deberían eliminarse". Elige tu argumento:',
        type: 'multiple_choice',
        options: ['📚 En contra - Refuerzan aprendizaje', '🎮 A favor - Más tiempo libre', '⚖️ En contra - Desarrollan disciplina', '😴 A favor - Reducen estrés'],
        correct: '📚 En contra - Refuerzan aprendizaje',
        explanation: 'Las tareas ayudan a consolidar lo aprendido en clase y desarrollar hábitos de estudio.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Debate: "Los celulares deberían permitirse en clase". Tu posición:',
        type: 'multiple_choice',
        options: ['📱 A favor - Herramienta educativa', '🚫 En contra - Causan distracción', '🔍 A favor - Acceso a información', '👥 En contra - Afectan socialización'],
        correct: '🚫 En contra - Causan distracción',
        explanation: 'Los celulares tienden a distraer la atención de los estudiantes durante las clases.',
        bloom: 'Evaluar'
      }
    ],

    case_study_sprint: [
      {
        stem: 'Caso: Una escuela tiene problemas de basura en el patio. Los estudiantes no usan los basureros. ¿Cuál es la mejor solución?',
        type: 'multiple_choice',
        options: ['🗑️ Poner más basureros', '📚 Educar sobre reciclaje', '👮 Poner supervisores', '🎯 Campaña de concienciación'],
        correct: '🎯 Campaña de concienciación',
        explanation: 'Una campaña de concienciación aborda la causa raíz del problema: la actitud hacia el cuidado del ambiente.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Caso: En una clase, algunos estudiantes no participan en actividades grupales. ¿Qué estrategia es más efectiva?',
        type: 'multiple_choice',
        options: ['🎭 Asignar roles específicos', '🏆 Dar puntos extra', '👥 Cambiar los grupos', '❓ Preguntar directamente'],
        correct: '🎭 Asignar roles específicos',
        explanation: 'Asignar roles específicos asegura que cada estudiante tenga una responsabilidad clara y contribuya al grupo.',
        bloom: 'Analizar'
      },
      {
        stem: 'Caso: Un proyecto debe entregarse en 1 semana pero el equipo está atrasado. ¿Cuál es la prioridad?',
        type: 'multiple_choice',
        options: ['📋 Reorganizar tareas', '⏰ Trabajar más horas', '✂️ Reducir el alcance', '🤝 Pedir ayuda externa'],
        correct: '📋 Reorganizar tareas',
        explanation: 'Reorganizar tareas permite optimizar el tiempo restante y asegurar que lo más importante se complete.',
        bloom: 'Analizar'
      }
    ],

    simulation_tycoon: [
      {
        stem: 'Gestión: Tu empresa de limonada tiene $100. ¿En qué inviertes primero?',
        type: 'multiple_choice',
        options: ['🍋 Más limones ($40)', '📢 Publicidad ($30)', '🏪 Mejor ubicación ($60)', '👥 Contratar ayuda ($50)'],
        correct: '🍋 Más limones ($40)',
        explanation: 'Invertir en más limones asegura poder satisfacer la demanda y generar más ventas.',
        bloom: 'Analizar'
      },
      {
        stem: 'Gestión: Las ventas bajaron 30%. ¿Cuál es tu estrategia?',
        type: 'multiple_choice',
        options: ['💰 Bajar precios', '✨ Mejorar calidad', '📊 Investigar competencia', '🎁 Ofrecer promociones'],
        correct: '📊 Investigar competencia',
        explanation: 'Investigar la competencia ayuda a entender por qué bajaron las ventas y cómo responder.',
        bloom: 'Analizar'
      },
      {
        stem: 'Gestión: Tienes exceso de inventario. ¿Qué haces?',
        type: 'multiple_choice',
        options: ['🏷️ Liquidación con descuento', '📦 Guardar para después', '🎪 Evento especial', '🤝 Vender a otra empresa'],
        correct: '🏷️ Liquidación con descuento',
        explanation: 'Una liquidación con descuento convierte rápidamente el inventario en efectivo.',
        bloom: 'Evaluar'
      }
    ],

    coding_puzzle: [
      {
        stem: 'Código: Para hacer que un robot avance 3 pasos, ¿cuál es la secuencia correcta?',
        type: 'multiple_choice',
        options: ['avanzar(), avanzar(), avanzar()', 'repetir(3, avanzar())', 'for i in range(3): avanzar()', 'Todas son correctas'],
        correct: 'Todas son correctas',
        explanation: 'Todas estas formas logran que el robot avance 3 pasos.',
        bloom: 'Aplicar'
      },
      {
        stem: 'Código: ¿Cuál es el error en este código? if (edad = 18): print("adulto")',
        type: 'multiple_choice',
        options: ['Falta paréntesis', 'Debería ser edad == 18', 'Falta punto y coma', 'No hay error'],
        correct: 'Debería ser edad == 18',
        explanation: 'En programación, == se usa para comparar, = se usa para asignar valores.',
        bloom: 'Analizar'
      },
      {
        stem: 'Código: Para crear un bucle que repita 5 veces, ¿cuál usas?',
        type: 'multiple_choice',
        options: ['while (i < 5)', 'for i in range(5)', 'repeat 5 times', 'loop(5)'],
        correct: 'for i in range(5)',
        explanation: 'for i in range(5) es la forma correcta en Python para repetir 5 veces.',
        bloom: 'Aplicar'
      }
    ],

    data_lab: [
      {
        stem: 'Datos: En un gráfico de barras de frutas vendidas: Manzanas=20, Naranjas=15, Plátanos=25. ¿Cuál se vendió más?',
        type: 'multiple_choice',
        options: ['🍎 Manzanas', '🍊 Naranjas', '🍌 Plátanos', '📊 Todas iguales'],
        correct: '🍌 Plátanos',
        explanation: 'Los plátanos tuvieron 25 ventas, el número más alto.',
        bloom: 'Analizar'
      },
      {
        stem: 'Datos: En una encuesta de 100 estudiantes sobre deportes favoritos: Fútbol=40, Básquet=30, Tenis=20, Otros=10. ¿Qué porcentaje prefiere fútbol?',
        type: 'multiple_choice',
        options: ['30%', '35%', '40%', '45%'],
        correct: '40%',
        explanation: '40 de 100 estudiantes = 40%',
        bloom: 'Aplicar'
      },
      {
        stem: 'Datos: Un gráfico de líneas muestra temperaturas: Lun=20°, Mar=22°, Mié=18°, Jue=25°, Vie=23°. ¿Qué día fue más caluroso?',
        type: 'multiple_choice',
        options: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
        correct: 'Jueves',
        explanation: 'El jueves tuvo 25°, la temperatura más alta de la semana.',
        bloom: 'Analizar'
      }
    ],

    timeline_builder: [
      {
        stem: 'Historia: Ordena cronológicamente: A) Independencia de Chile, B) Llegada de Colón, C) Primera Guerra Mundial',
        type: 'multiple_choice',
        options: ['A, B, C', 'B, A, C', 'B, C, A', 'C, B, A'],
        correct: 'B, A, C',
        explanation: 'Colón (1492) → Independencia Chile (1810-1818) → Primera Guerra Mundial (1914-1918)',
        bloom: 'Comprender'
      },
      {
        stem: 'Historia: ¿Qué evento ocurrió primero?',
        type: 'multiple_choice',
        options: ['🏛️ Fundación de Roma', '🏺 Antiguo Egipto', '🏰 Edad Media', '🚂 Revolución Industrial'],
        correct: '🏺 Antiguo Egipto',
        explanation: 'El Antiguo Egipto comenzó alrededor del 3100 a.C., antes que los otros eventos.',
        bloom: 'Recordar'
      },
      {
        stem: 'Historia: En la línea de tiempo de la vida humana, ¿cuál va después de "Aprender a caminar"?',
        type: 'multiple_choice',
        options: ['👶 Nacer', '🗣️ Aprender a hablar', '🎓 Ir a la escuela', '👴 Envejecer'],
        correct: '🗣️ Aprender a hablar',
        explanation: 'Generalmente se aprende a hablar después de caminar, antes de ir a la escuela.',
        bloom: 'Comprender'
      }
    ],

    argument_map: [
      {
        stem: 'Argumentación: "Los videojuegos mejoran la coordinación" es un argumento que APOYA la idea de que:',
        type: 'multiple_choice',
        options: ['🎮 Los videojuegos son beneficiosos', '❌ Los videojuegos son dañinos', '⚖️ Los videojuegos son neutrales', '🤔 No hay suficiente información'],
        correct: '🎮 Los videojuegos son beneficiosos',
        explanation: 'Mejorar la coordinación es un beneficio, por lo tanto apoya que los videojuegos son beneficiosos.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Argumentación: Si "Estudiar música mejora las matemáticas" y "Ana estudia piano", ¿qué podemos concluir?',
        type: 'multiple_choice',
        options: ['🎵 Ana es buena en matemáticas', '📚 Ana podría mejorar en matemáticas', '🎹 Ana es pianista profesional', '❓ No se puede concluir nada'],
        correct: '📚 Ana podría mejorar en matemáticas',
        explanation: 'El piano es música, por lo tanto Ana podría mejorar en matemáticas según la premisa.',
        bloom: 'Evaluar'
      },
      {
        stem: 'Argumentación: ¿Cuál es la conexión más fuerte entre "Hacer ejercicio" y "Mejor salud"?',
        type: 'multiple_choice',
        options: ['🔗 Causa directa', '📈 Correlación positiva', '❓ Relación dudosa', '🚫 Sin relación'],
        correct: '🔗 Causa directa',
        explanation: 'Hacer ejercicio tiene una relación causal directa y comprobada con la mejor salud.',
        bloom: 'Evaluar'
      }
    ],

    advanced_escape_room: [
      {
        stem: 'Sala 1 - Lógica: En una secuencia 2, 6, 18, 54, ¿cuál es el siguiente número?',
        type: 'multiple_choice',
        options: ['108', '162', '216', '270'],
        correct: '162',
        explanation: 'Cada número se multiplica por 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162',
        bloom: 'Analizar'
      },
      {
        stem: 'Sala 2 - Matemática: Un cofre requiere la suma de los números primos menores a 10. ¿Cuál es el código?',
        type: 'multiple_choice',
        options: ['15', '17', '19', '21'],
        correct: '17',
        explanation: 'Números primos menores a 10: 2, 3, 5, 7. Suma: 2+3+5+7=17',
        bloom: 'Aplicar'
      },
      {
        stem: 'Sala 3 - Patrón: ¿Qué figura continúa la secuencia: ○, △, □, ○, △, ___?',
        type: 'multiple_choice',
        options: ['○', '△', '□', '◇'],
        correct: '□',
        explanation: 'El patrón se repite cada 3 figuras: círculo, triángulo, cuadrado.',
        bloom: 'Analizar'
      },
      {
        stem: 'Sala 4 - Palabras: Anagrama de "AMOR" que significa "lugar para vivir"',
        type: 'multiple_choice',
        options: ['ROMA', 'RAMO', 'MORA', 'ARMO'],
        correct: 'ROMA',
        explanation: 'ROMA es un anagrama de AMOR y es un lugar (ciudad) donde vive gente.',
        bloom: 'Crear'
      },
      {
        stem: 'Sala 5 - Visual: ¿Cuántos triángulos hay en una estrella de 5 puntas?',
        type: 'multiple_choice',
        options: ['5', '10', '15', '20'],
        correct: '10',
        explanation: 'Una estrella de 5 puntas contiene 10 triángulos: 5 grandes y 5 pequeños.',
        bloom: 'Analizar'
      }
    ]
  };

  return questionData[format.id] || [];
}

module.exports = { getQuestionsForFormat }; 
