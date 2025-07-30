-- Inserción de 18 OA 1° Básico MAT + LEN
-- Generado automáticamente desde pipeline EDU21

-- Crear tabla si no existe
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

-- Insertar OA 1° Básico

INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'a9a12856-c208-4d3d-8fd1-895c0c940325',
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
    False,
    '2025-07-07T15:16:22.804247'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '984109c9-b750-4c0d-89cf-0542f726b080',
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
    False,
    '2025-07-07T15:16:22.804247'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '0bb6e2ac-e0aa-4093-8cd0-7ada8e86f9e2',
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
    False,
    '2025-07-07T15:16:22.804247'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '9d650867-5686-46e4-8edc-c2fa794f1143',
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
    False,
    '2025-07-07T15:16:22.805251'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '192639bb-81e8-4a17-bdb7-39ef52e65dee',
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
    False,
    '2025-07-07T15:16:22.805251'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'b5d9fa33-0282-4bd4-9924-949dea3855da',
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
    False,
    '2025-07-07T15:16:22.805251'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '96fe55fe-66d9-41c9-b7b9-0ae53b30245e',
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
    False,
    '2025-07-07T15:16:22.805251'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '4c476d75-3b10-45dd-85ed-32801e629a21',
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
    False,
    '2025-07-07T15:16:22.805251'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'fee4ba85-fa15-4ecf-9344-9342efd4faf9',
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
    False,
    '2025-07-07T15:16:22.805251'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'e0976403-fa8e-48a3-9c1c-adcf7b29f1c6',
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
    False,
    '2025-07-07T15:16:22.806416'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'cedbea7b-fdef-4a1c-b4b4-2685515096de',
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
    False,
    '2025-07-07T15:16:22.806416'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '51d96bb2-9edc-470d-8c66-619aaf6a24b2',
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
    False,
    '2025-07-07T15:16:22.806416'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '8e1945f0-499d-4b2b-97f2-211a70bc7ced',
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
    False,
    '2025-07-07T15:16:22.806416'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'fde1c2ab-189c-46c2-9d78-8f278c79b114',
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
    False,
    '2025-07-07T15:16:22.806416'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '436f5854-b2a7-4860-8660-0914ead1c983',
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
    False,
    '2025-07-07T15:16:22.806416'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'b54e69e6-b498-489d-b361-0824153799a5',
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
    False,
    '2025-07-07T15:16:22.807675'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    'fe0a2123-dca0-46f2-9b21-67cd1c6fbf5b',
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
    False,
    '2025-07-07T15:16:22.807675'
);
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '33050437-0e72-4747-9ed2-c8cfa7a01f95',
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
    False,
    '2025-07-07T15:16:22.807675'
);

-- Verificar inserción
SELECT 
    subject_code,
    bloom_level,
    COUNT(*) as count
FROM learning_objective 
WHERE grade_code = '1B'
GROUP BY subject_code, bloom_level
ORDER BY subject_code, bloom_level;

-- Engines recomendados para estos OA
INSERT INTO game_engine (engine_id, code, name, description) VALUES
('eng01', 'COUNTER', 'Counter/Number Line', 'Juegos de conteo y línea numérica'),
('eng02', 'DRAG_DROP_NUM', 'Drag-Drop Numbers', 'Arrastrar y soltar números'),
('eng04', 'MATH_OPS', 'Math Operations', 'Operaciones matemáticas básicas'),
('eng06', 'SORTING', 'Sorting/Comparison', 'Juegos de ordenamiento y comparación'),
('eng07', 'TEXT_RECOG', 'Text Recognition', 'Reconocimiento de textos'),
('eng08', 'LETTER_SOUND', 'Letter-Sound Matching', 'Asociación letra-sonido'),
('eng09', 'READING_FLUENCY', 'Reading Fluency', 'Fluidez lectora'),
('eng10', 'STORY_COMP', 'Story Comprehension', 'Comprensión de historias')
ON CONFLICT (engine_id) DO NOTHING;
