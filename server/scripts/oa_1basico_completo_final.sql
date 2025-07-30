-- === CARGA COMPLETA 1° BÁSICO - 79 OA ===
-- Generado automáticamente desde pipeline EDU21
-- Materias: MAT, LEN, CN, MUS, TEC, ORI

-- Crear tabla learning_objective si no existe
CREATE TABLE IF NOT EXISTS learning_objective (
    oa_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    oa_code text UNIQUE NOT NULL,
    oa_desc text NOT NULL,
    oa_short_desc text,
    grade_code varchar(5) NOT NULL,
    subject_code varchar(10) NOT NULL,
    bloom_level text NOT NULL,
    cog_skill text,
    oa_version text DEFAULT '2023',
    semester integer DEFAULT 1,
    complexity_level integer DEFAULT 1,
    estimated_hours integer DEFAULT 4,
    ministerial_priority text DEFAULT 'normal',
    is_transversal boolean DEFAULT false,
    created_at timestamp DEFAULT now(),
    enriched_at timestamp,
    deprecated_at timestamp
);

-- Insertar 79 OA de 1° Básico

INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '46b0549a-d007-4b93-be3d-eb457792beb1',
    'MA01OA01',
    'Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10,  hacia adelante y hacia atrás, empezando por cualquier número menor que 100.',
    'Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10,  hacia adelante y hacia a...',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.178083'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '57080cdb-e5b5-4fdd-9302-a629dfe891ef',
    'MA01OA02',
    'Identificar el orden de los elementos de una serie, utilizando números ordinales del primero (1º) al décimo (10º).',
    'Identificar el orden de los elementos de una serie, utilizando números ordinales del primero (1º) al...',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.178083'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '6bfef5e0-f9ae-4a11-99d4-fef767532954',
    'MA01OA03',
    'Leer números del 0 al 20 y representarlos en forma concreta, pictórica y simbólica.',
    'Leer números del 0 al 20 y representarlos en forma concreta, pictórica y simbólica.',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.178083'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '53243323-3424-426b-8b7b-7d7c3fc3bf47',
    'MA01OA04',
    'Comparar y ordenar números del 0 al 20 de menor a mayor y/o viceversa, utilizando material concreto y/o usando software educativo.',
    'Comparar y ordenar números del 0 al 20 de menor a mayor y/o viceversa, utilizando material concreto ...',
    '1B',
    'MAT',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.178083'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '1cef7fb8-ad6b-413c-b628-074c71c2323c',
    'MA01OA05',
    'Estimar cantidades hasta 20 en situaciones concretas, usando un referente.',
    'Estimar cantidades hasta 20 en situaciones concretas, usando un referente.',
    '1B',
    'MAT',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.178083'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '7b4bb9eb-5680-44b5-a015-60ca151e2bb2',
    'MA01OA06',
    'Componer y descomponer números del 0 a 20 de manera aditiva, en forma concreta, pictórica y simbólica.',
    'Componer y descomponer números del 0 a 20 de manera aditiva, en forma concreta, pictórica y simbólic...',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.178083'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '0368efb1-3c0a-4119-a7ad-ba4e8d63b7a3',
    'MA01OA07',
    'Aplicar estrategias de cálculo mental para adiciones y sustracciones hasta 20',
    'Aplicar estrategias de cálculo mental para adiciones y sustracciones hasta 20',
    '1B',
    'MAT',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'f7f41125-e5d7-4fc4-bc3d-c9df4f9591e5',
    'MA01OA08',
    'Determinar las unidades y decenas en números del 0 al 20, agrupando de a 10, de manera concreta, pictórica y simbólica.',
    'Determinar las unidades y decenas en números del 0 al 20, agrupando de a 10, de manera concreta, pic...',
    '1B',
    'MAT',
    'Analizar',
    'mantener',
    '2023',
    1,
    4,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'f8a81156-9639-4c04-89e0-fe7e69bc9b1c',
    'MA01OA09',
    'Demostrar que comprenden la adición y la sustracción de números del 0 al 20 progresivamente',
    'Demostrar que comprenden la adición y la sustracción de números del 0 al 20 progresivamente',
    '1B',
    'MAT',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '55821745-de96-453f-b693-9bf217aa7392',
    'MA01OA10',
    'Demostrar que la adición y la sustracción son operaciones inversas, de manera concreta, pictórica y simbólica.',
    'Demostrar que la adición y la sustracción son operaciones inversas, de manera concreta, pictórica y ...',
    '1B',
    'MAT',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '1b199e0c-39f4-4369-89ee-e4d9f3c50227',
    'MA01OA11',
    'Reconocer, describir, crear y continuar patrones repetitivos (sonidos, figuras, ritmos...) y patrones numéricos hasta el 20, crecientes y decrecientes, usando material concreto, pictórico y simbólico, de manera manual y/o por medio de software educativo.',
    'Reconocer, describir, crear y continuar patrones repetitivos (sonidos, figuras, ritmos...) y patrone...',
    '1B',
    'MAT',
    'Recordar',
    'espacial',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'dcb36fdb-a0f3-4c98-8f0d-c0568168809c',
    'MA01OA12',
    'Describir y registrar la igualdad y la desigualdad como equilibrio y desequilibrio, usando una balanza en forma concreta, pictórica y simbólica del 0 al 20, usando el símbolo igual (=).',
    'Describir y registrar la igualdad y la desigualdad como equilibrio y desequilibrio, usando una balan...',
    '1B',
    'MAT',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '19e8916e-a7de-4660-ae12-809540f44bac',
    'MA01OA13',
    'Describir la posición de objetos y personas en relación a sí mismos y a otros objetos y personas, usando un lenguaje común (como derecha e izquierda).',
    'Describir la posición de objetos y personas en relación a sí mismos y a otros objetos y personas, us...',
    '1B',
    'MAT',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '0589ec88-f3cc-4820-ad94-f440e9cbe0e2',
    'MA01OA14',
    'Identificar en el entorno figuras 3D y figuras 2D y relacionarlas, usando material concreto.',
    'Identificar en el entorno figuras 3D y figuras 2D y relacionarlas, usando material concreto.',
    '1B',
    'MAT',
    'Recordar',
    'espacial',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '977a4cc0-0231-4883-b9d4-e3dfc23439f0',
    'MA01OA15',
    'Identificar y dibujar líneas rectas y curvas.',
    'Identificar y dibujar líneas rectas y curvas.',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '25b4e744-41ad-411f-8c78-7eec018739c3',
    'MA01OA16',
    'Usar unidades no estandarizadas de tiempo para comparar la duración de eventos cotidianos.',
    'Usar unidades no estandarizadas de tiempo para comparar la duración de eventos cotidianos.',
    '1B',
    'MAT',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '9db09056-7df3-4cac-a177-94232e671856',
    'MA01OA17',
    'Usar un lenguaje cotidiano para secuenciar eventos en el tiempo: días de la semana, meses del año y algunas fechas significativas.',
    'Usar un lenguaje cotidiano para secuenciar eventos en el tiempo: días de la semana, meses del año y ...',
    '1B',
    'MAT',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '968dee8d-6c93-4a0a-846e-794735ec521b',
    'MA01OA18',
    'Identificar y comparar la longitud de objetos, usando palabras como largo y corto.',
    'Identificar y comparar la longitud de objetos, usando palabras como largo y corto.',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'e8f3966a-f396-453b-9383-c4c9496409c9',
    'MA01OA19',
    'Recolectar y registrar datos para responder preguntas estadísticas sobre sí mismo y el entorno, usando bloques, tablas de conteo y pictogramas.',
    'Recolectar y registrar datos para responder preguntas estadísticas sobre sí mismo y el entorno, usan...',
    '1B',
    'MAT',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '1da3746c-19dd-4e85-bd76-fd7ea519df56',
    'MA01OA20',
    'Construir, leer e interpretar pictogramas.',
    'Construir, leer e interpretar pictogramas.',
    '1B',
    'MAT',
    'Crear',
    'mantener',
    '2023',
    1,
    5,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '779ea2f5-5e8c-474d-96ac-a03e4e6d763e',
    'LE01OA01',
    'Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un propósito.',
    'Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '24f5ddcd-2c76-46df-9e79-00d3233ca37a',
    'LE01OA02',
    'Reconocer que las palabras son unidades de significado separadas por espacios en el texto escrito.',
    'Reconocer que las palabras son unidades de significado separadas por espacios en el texto escrito.',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '00c7c772-ed86-4d8b-bd67-11548a2509bf',
    'LE01OA03',
    'Identificar los sonidos que componen las palabras (conciencia fonológica), reconociendo, separando y combinando sus fonemas y sílabas.',
    'Identificar los sonidos que componen las palabras (conciencia fonológica), reconociendo, separando y...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.179174'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'baceb087-9de7-4fbe-a38e-b7dda63afb26',
    'LE01OA04',
    'Leer palabras aisladas y en contexto, aplicando su conocimiento de la correspondencia letra-sonido en diferentes combinaciones: sílaba directa, indirecta o compleja y dígrafos rr-ll-ch-qu.',
    'Leer palabras aisladas y en contexto, aplicando su conocimiento de la correspondencia letra-sonido e...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '96fd1b43-46b8-44ec-982e-b3a018e7c8f9',
    'LE01OA05',
    'Leer textos breves en voz alta para adquirir fluidez',
    'Leer textos breves en voz alta para adquirir fluidez',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '789d8aa6-01c2-4a9c-9a00-0ac1e355866f',
    'LE01OA06',
    'Comprender textos aplicando estrategias de comprensión lectora',
    'Comprender textos aplicando estrategias de comprensión lectora',
    '1B',
    'LEN',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '92164f81-169b-4a4c-a4b6-ceb7b81c479e',
    'LE01OA07',
    'Leer independientemente y ampliar repertorio literario',
    'Leer independientemente y ampliar repertorio literario',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '7a908ad1-957e-4677-8250-ae7deb7c1428',
    'LE01OA08',
    'Comprender narraciones que aborden temas que les sean familiares',
    'Comprender narraciones que aborden temas que les sean familiares',
    '1B',
    'LEN',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'be6eaf33-a1e7-4283-aee0-20a671c3d5dd',
    'LE01OA09',
    'Leer habitualmente y disfrutar los mejores poemas de autor y de la tradición oral adecuados a su edad.',
    'Leer habitualmente y disfrutar los mejores poemas de autor y de la tradición oral adecuados a su eda...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'ff0f6cf1-890b-4def-a8eb-357517b06ddd',
    'LE01OA10',
    'Leer independientemente y comprender textos no literarios escritos con oraciones simples (cartas, notas, instrucciones y artículos informativos) para entretenerse y ampliar su conocimiento del mundo:',
    'Leer independientemente y comprender textos no literarios escritos con oraciones simples (cartas, no...',
    '1B',
    'LEN',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'a9ebd5a1-2afd-41a0-bf21-6854ec496e1b',
    'LE01OA11',
    'Desarrollar el gusto por la lectura, explorando libros y sus ilustraciones.',
    'Desarrollar el gusto por la lectura, explorando libros y sus ilustraciones.',
    '1B',
    'LEN',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '126a1235-397b-4c2e-b66e-449fa905add2',
    'LE01OA12',
    'Asistir habitualmente a la biblioteca para elegir, escuchar, leer y explorar textos de su interés.',
    'Asistir habitualmente a la biblioteca para elegir, escuchar, leer y explorar textos de su interés.',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '536232d6-167b-4ba1-bde3-5e3d97c2dd5f',
    'LE01OA13',
    'Experimentar con la escritura para comunicar hechos, ideas y sentimientos, entre otros.',
    'Experimentar con la escritura para comunicar hechos, ideas y sentimientos, entre otros.',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '52079fb3-00fc-46a3-b801-4547f4ce2843',
    'LE01OA14',
    'Escribir oraciones completas para transmitir mensajes.',
    'Escribir oraciones completas para transmitir mensajes.',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '1895057f-7092-4f91-959e-cfc1f85c989e',
    'LE01OA15',
    'Escribir con letra clara, separando las palabras con un espacio para que puedan ser leídas por otros con facilidad.',
    'Escribir con letra clara, separando las palabras con un espacio para que puedan ser leídas por otros...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '1754aad2-ceaf-4d90-b1b2-f33e7eacdda2',
    'LE01OA16',
    'Incorporar de manera pertinente en la escritura el vocabulario nuevo extraído de textos escuchados o leídos.',
    'Incorporar de manera pertinente en la escritura el vocabulario nuevo extraído de textos escuchados o...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'b2d567ad-2e2d-4a85-803b-1e3e7d829d4e',
    'LE01OA17',
    'Comprender y disfrutar versiones completas de obras literarias, narradas por un adulto',
    'Comprender y disfrutar versiones completas de obras literarias, narradas por un adulto',
    '1B',
    'LEN',
    'Comprender',
    'mantener',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'cfc3d602-a843-472d-8ca1-1807667e4eab',
    'LE01OA18',
    'Comprender textos orales para obtener información y desarrollar la curiosidad',
    'Comprender textos orales para obtener información y desarrollar la curiosidad',
    '1B',
    'LEN',
    'Aplicar',
    'memorizar',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '31a638b3-a320-4398-b99a-3b7b2154f54c',
    'LE01OA19',
    'Desarrollar la curiosidad por las palabras o expresiones que desconocen y adquirir el hábito de averiguar su significado.',
    'Desarrollar la curiosidad por las palabras o expresiones que desconocen y adquirir el hábito de aver...',
    '1B',
    'LEN',
    'Aplicar',
    'mantener',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '7fc08495-030e-42ef-88cd-80bbc5c6621d',
    'LE01OA20',
    'Disfrutar de la experiencia de asistir a obras de teatro infantiles o representaciones para ampliar sus posibilidades de expresión, desarrollar su creatividad y familiarizarse con el género.',
    'Disfrutar de la experiencia de asistir a obras de teatro infantiles o representaciones para ampliar ...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '031e9e2a-0faa-4f55-9cb5-de2f054c062a',
    'LE01OA21',
    'Conversaciones grupales sobre textos leídos o escuchados en clases',
    'Conversaciones grupales sobre textos leídos o escuchados en clases',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '4f63f419-80f1-4b7f-b324-c53fb21e84f0',
    'LE01OA22',
    'Interactuar según convenciones sociales usando fórmulas de cortesía',
    'Interactuar según convenciones sociales usando fórmulas de cortesía',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'f094f308-d678-4761-9f19-5f13a95b64c4',
    'LE01OA23',
    'Expresarse coherente y articuladamente',
    'Expresarse coherente y articuladamente',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'f55c9e9e-02bd-4a6b-8f11-9cdca53f4436',
    'LE01OA24',
    'Incorporar de manera pertinente en sus intervenciones orales el vocabulario nuevo extraído de textos escuchados o leídos.',
    'Incorporar de manera pertinente en sus intervenciones orales el vocabulario nuevo extraído de textos...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'd639c87d-6ec8-4c5e-811b-0f5184943f16',
    'LE01OA25',
    'Desempeñar diferentes roles para desarrollar su lenguaje y autoestima, y aprender a trabajar en equipo.',
    'Desempeñar diferentes roles para desarrollar su lenguaje y autoestima, y aprender a trabajar en equi...',
    '1B',
    'LEN',
    'Aplicar',
    'mantener',
    '2023',
    1,
    4,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '2ecfca0e-e67d-49cd-a5ae-fc94c68fb8de',
    'LE01OA26',
    'Recitar con entonación y expresión poemas, rimas, canciones, trabalenguas y adivinanzas para fortalecer la confianza en sí mismos, aumentar el vocabulario y desarrollar su capacidad expresiva.',
    'Recitar con entonación y expresión poemas, rimas, canciones, trabalenguas y adivinanzas para fortale...',
    '1B',
    'LEN',
    'Recordar',
    'mantener',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.180190'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'bfabc204-74e9-4f42-97e0-ba904e49b548',
    'CN01OA01',
    'Reconocer y observar, por medio de la exploración, que los seres vivos crecen, responden a estímulos del medio, se reproducen y necesitan agua, alimento y aire para vivir, comparándolos con las cosas no vivas.',
    'Reconocer y observar, por medio de la exploración, que los seres vivos crecen, responden a estímulos...',
    '1B',
    'CN',
    'Recordar',
    'deducir',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '83a327a3-d3df-4104-9323-1bb3843f7630',
    'CN01OA02',
    'Observar y comparar animales de acuerdo a características como tamaño, cubierta corporal, estructuras de desplazamiento y hábitat, entre otras.',
    'Observar y comparar animales de acuerdo a características como tamaño, cubierta corporal, estructura...',
    '1B',
    'CN',
    'Comprender',
    'deducir',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'c154cefd-9793-463a-acc8-d69ce1968be6',
    'CN01OA03',
    'Observar e identificar, por medio de la exploración, las estructuras principales de las plantas: hojas, flores, tallos y raíces.',
    'Observar e identificar, por medio de la exploración, las estructuras principales de las plantas: hoj...',
    '1B',
    'CN',
    'Recordar',
    'deducir',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '89ad9846-97db-49d7-b96a-3385d92ae5e1',
    'CN01OA04',
    'Observar y clasificar semillas, frutos, flores y tallos a partir de criterios como tamaño, forma, textura y color, entre otros.',
    'Observar y clasificar semillas, frutos, flores y tallos a partir de criterios como tamaño, forma, te...',
    '1B',
    'CN',
    'Comprender',
    'deducir',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '18f1c617-5097-4bbf-a22c-33b0238f4ad9',
    'CN01OA05',
    'Reconocer y comparar diversas plantas y animales de nuestro país, considerando las características observables, y proponiendo medidas para su cuidado.',
    'Reconocer y comparar diversas plantas y animales de nuestro país, considerando las características o...',
    '1B',
    'CN',
    'Recordar',
    'deducir',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '630fb3c6-c1ff-45ff-bb41-0718dbf4f075',
    'CN01OA06',
    'Identificar y describir la ubicación y la función de los sentidos proponiendo medidas para protegerlos y para prevenir situaciones de riesgo.',
    'Identificar y describir la ubicación y la función de los sentidos proponiendo medidas para protegerl...',
    '1B',
    'CN',
    'Recordar',
    'deducir',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '604fbd6f-3e0e-489e-aa20-33053f44b484',
    'CN01OA07',
    'Describir, dar ejemplos y practicar hábitos de vida saludable para mantener el cuerpo sano y prevenir enfermedades (actividad física, aseo del cuerpo, lavado de alimentos y alimentación saludable, entre otros).',
    'Describir, dar ejemplos y practicar hábitos de vida saludable para mantener el cuerpo sano y preveni...',
    '1B',
    'CN',
    'Comprender',
    'deducir',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '72f71fb4-fcee-4df0-b346-8bb259f692e7',
    'CN01OA08',
    'Explorar y describir los diferentes tipos de materiales en diversos objetos, clasificándolos según sus propiedades (goma-flexible, plástico-impermeable) e identificando su uso en la vida cotidiana.',
    'Explorar y describir los diferentes tipos de materiales en diversos objetos, clasificándolos según s...',
    '1B',
    'CN',
    'Comprender',
    'agrupar',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '8d2391ee-1b20-4236-9e3d-5b5f22891e82',
    'CN01OA09',
    'Observar y describir los cambios de los materiales al aplicarles fuerza, luz, calor y agua.',
    'Observar y describir los cambios de los materiales al aplicarles fuerza, luz, calor y agua.',
    '1B',
    'CN',
    'Comprender',
    'deducir',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '4021fb15-1d44-4c0d-a03e-e3b1e294b5ef',
    'CN01OA10',
    'Diseñar instrumentos tecnológicos simples considerando diversos materiales y sus propiedades para resolver problemas cotidianos.',
    'Diseñar instrumentos tecnológicos simples considerando diversos materiales y sus propiedades para re...',
    '1B',
    'CN',
    'Crear',
    'deducir',
    '2023',
    1,
    5,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '77e2be1e-ad83-4eea-88d9-8a7f3e1d861f',
    'CN01OA11',
    'Describir y registrar el ciclo diario y las diferencias entre el día y la noche, a partir de la observación del Sol, la Luna, las estrellas y la luminosidad del cielo, entre otras, y sus efectos en los seres vivos y el ambiente.',
    'Describir y registrar el ciclo diario y las diferencias entre el día y la noche, a partir de la obse...',
    '1B',
    'CN',
    'Comprender',
    'deducir',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '6196a501-80e3-4274-846b-eb26736e533c',
    'CN01OA12',
    'Describir y comunicar los cambios del ciclo de las estaciones y sus efectos en los seres vivos y el ambiente.',
    'Describir y comunicar los cambios del ciclo de las estaciones y sus efectos en los seres vivos y el ...',
    '1B',
    'CN',
    'Comprender',
    'deducir',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.181692'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '2b5311df-f05e-443b-9998-e8942940628a',
    'MU01OA01',
    'Escuchar cualidades del sonido (altura, timbre, intensidad, duración) y elementos del lenguaje musical (pulsos, acentos, patrones, secciones) y representarlos de distintas formas.',
    'Escuchar cualidades del sonido (altura, timbre, intensidad, duración) y elementos del lenguaje music...',
    '1B',
    'MUS',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '24e4011b-76af-4e70-a2b7-d26f4b348c8c',
    'MU01OA02',
    'Expresar sensaciones, emociones e ideas que les sugiere el sonido y la música escuchada, usando diversos medios expresivos (verbal, corporal, musical, visual).',
    'Expresar sensaciones, emociones e ideas que les sugiere el sonido y la música escuchada, usando dive...',
    '1B',
    'MUS',
    'Recordar',
    'auditivo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'a1826e90-189e-454d-9b29-676381f8adbf',
    'MU01OA03',
    'Escuchar música en forma abundante de diversos contextos y culturas poniendo énfasis en: Tradición escrita (docta), piezas instrumentales y vocales de corta duración (por ejemplo, piezas del "Álbum para la juventud" de R. Schumann, piezas de "Juguetería" de P. Bisquert); Tradición oral (folclor, música de pueblos originarios), canciones, rondas, bailes y versos rítmicos; Popular (jazz, rock, fusión, etcétera) poniendo énfasis en música infantil (por ejemplo canciones como "El Negro Cirilo" y Videos como "Los Gorrioncitos" de Tikitiklip). Escuchar apreciativamente al menos 20 músicas variadas de corta duración al año.',
    'Escuchar música en forma abundante de diversos contextos y culturas poniendo énfasis en: Tradición e...',
    '1B',
    'MUS',
    'Recordar',
    'auditivo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '45504703-6dd8-4040-9dd5-fb36cba6c72c',
    'MU01OA04',
    'Cantar al unísono y tocar instrumentos de percusión convencionales y no convencionales.',
    'Cantar al unísono y tocar instrumentos de percusión convencionales y no convencionales.',
    '1B',
    'MUS',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '4abcf154-a35d-49bf-abe9-b33d4fc0a6c1',
    'MU01OA05',
    'Explorar e improvisar ideas musicales con diversos medios sonoros (la voz, instrumentos convencionales y no convencionales, entre otros), utilizando las cualidades del sonido y elementos del lenguaje musical.',
    'Explorar e improvisar ideas musicales con diversos medios sonoros (la voz, instrumentos convencional...',
    '1B',
    'MUS',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '5881b6bf-3794-47a8-8145-e2b9075d0f17',
    'MU01OA06',
    'Presentar su trabajo musical, en forma individual y grupal, compartiendo con el curso y la comunidad.',
    'Presentar su trabajo musical, en forma individual y grupal, compartiendo con el curso y la comunidad...',
    '1B',
    'MUS',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '78ccc1ea-52a0-42f9-a3b9-ba887dd33858',
    'MU01OA07',
    'Identificar y describir experiencias musicales y sonoras en su propia vida.',
    'Identificar y describir experiencias musicales y sonoras en su propia vida.',
    '1B',
    'MUS',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '7b36b630-6f12-408d-b05c-346cd8819d3c',
    'TE01OA01',
    'Crear diseños de objetos tecnológicos, a partir de sus propias experiencias y representando sus ideas, a través de dibujo a mano alzada o modelos concretos, y con orientación del profesor.',
    'Crear diseños de objetos tecnológicos, a partir de sus propias experiencias y representando sus idea...',
    '1B',
    'TEC',
    'Crear',
    'memoria_trabajo',
    '2023',
    1,
    5,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '22ab5567-4e21-49d8-9721-c533e2d753fa',
    'TE01OA02',
    'Distinguir las tareas para elaborar un objeto tecnológico, identificando los materiales y las herramientas necesarios en cada una de ellas para lograr el resultado deseado.',
    'Distinguir las tareas para elaborar un objeto tecnológico, identificando los materiales y las herram...',
    '1B',
    'TEC',
    'Analizar',
    'memoria_trabajo',
    '2023',
    1,
    4,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'bff1a249-bca1-446f-ae9d-f7f50b1d0a23',
    'TE01OA03',
    'Crear un objeto tecnológico.',
    'Crear un objeto tecnológico.',
    '1B',
    'TEC',
    'Crear',
    'memoria_trabajo',
    '2023',
    1,
    5,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '5af96ae9-2b4d-4b0d-991b-6f71e2fbc169',
    'TE01OA04',
    'Probar y explicar los resultados de los trabajos propios y de otros, de forma individual o en equipos, dialogando sobre sus ideas e identificando lo que podría hacerse de otra manera.',
    'Probar y explicar los resultados de los trabajos propios y de otros, de forma individual o en equipo...',
    '1B',
    'TEC',
    'Comprender',
    'memoria_trabajo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'd2012956-5d16-46ec-ba53-2f3a963b3150',
    'TE01OA05',
    'Usar software de dibujo para crear y representar ideas por medio de imágenes, guiados por el docente.',
    'Usar software de dibujo para crear y representar ideas por medio de imágenes, guiados por el docente...',
    '1B',
    'TEC',
    'Aplicar',
    'memoria_trabajo',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'fdf86d55-ac53-4699-a6de-ddd4e6709125',
    'TE01OA06',
    'Explorar y usar una variedad de software educativos (simuladores, libros digitales, interactivos y creativos, entre otros) para lograr aprendizajes significativos y una interacción apropiada con las TIC.',
    'Explorar y usar una variedad de software educativos (simuladores, libros digitales, interactivos y c...',
    '1B',
    'TEC',
    'Aplicar',
    'memoria_trabajo',
    '2023',
    1,
    3,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '8d12bcdf-95cf-48a7-b9cd-bc9600102336',
    'OR01OA01',
    'Observar, describir y valorar sus características personales, sus habilidades e intereses.',
    'Observar, describir y valorar sus características personales, sus habilidades e intereses.',
    '1B',
    'ORI',
    'Comprender',
    'memoria_trabajo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '8d4ca6a6-04ca-41e0-893f-156e9f82efc7',
    'OR01OA02',
    'Identificar emociones experimentadas por ellos y por los demás (por ejemplo, pena, rabia, miedo, alegría) y distinguir diversas formas de expresarlas.',
    'Identificar emociones experimentadas por ellos y por los demás (por ejemplo, pena, rabia, miedo, ale...',
    '1B',
    'ORI',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '14328772-ff57-463e-b329-c89d3075ba5e',
    'OR01OA03',
    'Observar, describir y valorar las expresiones de afecto y cariño, que dan y reciben, en los ámbitos familiar, escolar y social (por ejemplo, compartir tiempo, escuchar a los demás, dar y recibir ayuda).',
    'Observar, describir y valorar las expresiones de afecto y cariño, que dan y reciben, en los ámbitos ...',
    '1B',
    'ORI',
    'Comprender',
    'memoria_trabajo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.182694'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '015b61a3-7a88-4fce-8f73-7449627faa2c',
    'OR01OA04',
    'Identificar y practicar, en forma guiada, conductas protectoras y de autocuidado en relación a:rutinas de higiene; actividades de descanso, recreación y actividad física; hábitos de alimentación; resguardo del cuerpo y la intimidad; la entrega de información personal.',
    'Identificar y practicar, en forma guiada, conductas protectoras y de autocuidado en relación a:rutin...',
    '1B',
    'ORI',
    'Recordar',
    'memorizar',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.183699'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '7916d895-5f70-4723-a2f5-f67c2d737fb1',
    'OR01OA05',
    'Manifestar actitudes de solidaridad y respeto, que favorezcan la convivencia, como: utilizar formas de buen trato (por ejemplo, saludar, despedirse, pedir por favor); actuar en forma respetuosa (por ejemplo, escuchar, respetar turnos, rutinas y pertenencias); compartir con los pares (por ejemplo, jugar juntos, prestarse útiles, ayudar al que lo necesita).',
    'Manifestar actitudes de solidaridad y respeto, que favorezcan la convivencia, como: utilizar formas ...',
    '1B',
    'ORI',
    'Comprender',
    'memoria_trabajo',
    '2023',
    1,
    2,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.183699'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'd82f48d0-5869-4094-9414-6d0702a2ab60',
    'OR01OA06',
    'Identificar conflictos que surgen entre pares y practicar formas de solucionarlos como escuchar al otro, ponerse en su lugar, buscar un acuerdo, reconciliarse.',
    'Identificar conflictos que surgen entre pares y practicar formas de solucionarlos como escuchar al o...',
    '1B',
    'ORI',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.183699'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'b3294788-615e-43a8-b388-7e1ce5fa07e1',
    'OR01OA07',
    'Reconocer, describir y valorar sus grupos de pertenencia (familia, curso, pares), las personas que los componen y sus características, y participar activamente en ellos (por ejemplo, ayudando en el orden de la casa y sala de clases).',
    'Reconocer, describir y valorar sus grupos de pertenencia (familia, curso, pares), las personas que l...',
    '1B',
    'ORI',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.183699'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '32467a77-d67e-40c9-a541-6e9bae4b7128',
    'OR01OA08',
    'Practicar hábitos y actitudes que favorezcan el proceso de aprendizaje, como: traer y cuidar los útiles escolares;mantener el orden de la sala de clases y materiales; identificar los nuevos aprendizajes adquiridos para incentivar la motivación.',
    'Practicar hábitos y actitudes que favorezcan el proceso de aprendizaje, como: traer y cuidar los úti...',
    '1B',
    'ORI',
    'Recordar',
    'memoria_trabajo',
    '2023',
    1,
    1,
    4,
    'normal',
    false,
    '2025-07-07T15:51:54.183699'
);

-- Verificación de inserción
SELECT 
    subject_code,
    bloom_level,
    COUNT(*) as count
FROM learning_objective 
WHERE grade_code = '1B'
GROUP BY subject_code, bloom_level
ORDER BY subject_code, bloom_level;

-- Resumen total
SELECT 
    'TOTAL 1° BÁSICO' as resumen,
    COUNT(*) as total_oa,
    COUNT(DISTINCT subject_code) as total_materias
FROM learning_objective 
WHERE grade_code = '1B';
