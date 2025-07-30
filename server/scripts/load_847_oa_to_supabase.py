#!/usr/bin/env python3
"""
CARGA MASIVA: 847 OA COMPLETOS A SUPABASE
Script final para cargar todos los OA de 1°-6° básico a producción
Incluye enriquecimiento automático con Bloom y habilidades cognitivas
"""

import pandas as pd
import uuid
import re
from datetime import datetime
import json
import os

def load_enrichment_datasets():
    """Carga los datasets de referencia para enriquecimiento"""
    
    # Dataset de verbos → Bloom
    verb_bloom_data = {
        'recordar': ('Recordar', 0.95), 'identificar': ('Recordar', 0.90), 'nombrar': ('Recordar', 0.85),
        'reconocer': ('Recordar', 0.90), 'listar': ('Recordar', 0.85), 'describir': ('Comprender', 0.90),
        'explicar': ('Comprender', 0.85), 'comparar': ('Comprender', 0.80), 'comprender': ('Comprender', 0.95),
        'interpretar': ('Comprender', 0.85), 'aplicar': ('Aplicar', 0.95), 'usar': ('Aplicar', 0.80),
        'resolver': ('Aplicar', 0.85), 'demostrar': ('Aplicar', 0.80), 'analizar': ('Analizar', 0.95),
        'examinar': ('Analizar', 0.85), 'distinguir': ('Analizar', 0.80), 'clasificar': ('Analizar', 0.80),
        'evaluar': ('Evaluar', 0.95), 'criticar': ('Evaluar', 0.85), 'juzgar': ('Evaluar', 0.80),
        'crear': ('Crear', 0.95), 'diseñar': ('Crear', 0.90), 'construir': ('Crear', 0.85),
        'desarrollar': ('Crear', 0.80), 'generar': ('Crear', 0.85)
    }
    
    # Dataset de habilidades cognitivas
    cognitive_skills = {
        'memoria_trabajo': ['recordar', 'mantener', 'retener', 'memorizar'],
        'razonamiento_logico': ['analizar', 'inferir', 'deducir', 'razonar'],
        'atencion_selectiva': ['enfocar', 'concentrar', 'seleccionar', 'priorizar'],
        'flexibilidad_mental': ['adaptar', 'cambiar', 'ajustar', 'modificar'],
        'procesamiento_visual': ['observar', 'visualizar', 'percibir', 'distinguir'],
        'comprension_verbal': ['entender', 'comprender', 'interpretar', 'comunicar'],
        'coordinacion_motora': ['ejecutar', 'realizar', 'practicar', 'coordinar'],
        'creatividad': ['crear', 'innovar', 'imaginar', 'inventar']
    }
    
    return verb_bloom_data, cognitive_skills

def extract_primary_verb(description):
    """Extrae el verbo principal de la descripción del OA"""
    
    # Limpiar y normalizar el texto
    text = description.lower().strip()
    
    # Patrones comunes de inicio de OA
    patterns = [
        r'^(\w+)\s+',  # Primera palabra
        r'^\w+\s+(\w+)\s+',  # Segunda palabra si la primera es artículo
    ]
    
    for pattern in patterns:
        match = re.match(pattern, text)
        if match:
            verb = match.group(1)
            # Filtrar artículos y preposiciones comunes
            if verb not in ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para']:
                return verb
    
    return None

def enrich_oa_with_bloom_and_cognitive(df, verb_bloom_data, cognitive_skills):
    """Enriquece los OA con niveles de Bloom y habilidades cognitivas"""
    
    enriched_data = []
    
    for _, row in df.iterrows():
        # Extraer verbo principal
        primary_verb = extract_primary_verb(row['oa_desc'])
        
        # Determinar nivel de Bloom
        bloom_level = 'Comprender'  # Default
        confidence = 0.5
        
        if primary_verb and primary_verb in verb_bloom_data:
            bloom_level, confidence = verb_bloom_data[primary_verb]
        
        # Determinar habilidad cognitiva
        cog_skill = 'comprension_verbal'  # Default
        
        for skill, keywords in cognitive_skills.items():
            if primary_verb and primary_verb in keywords:
                cog_skill = skill
                break
        
        # Calcular complejidad basada en nivel de Bloom
        complexity_mapping = {
            'Recordar': 1, 'Comprender': 2, 'Aplicar': 3, 
            'Analizar': 4, 'Evaluar': 5, 'Crear': 6
        }
        complexity_level = complexity_mapping.get(bloom_level, 2)
        
        # Estimar horas basado en complejidad y materia
        base_hours = 4
        if row['subject'] in ['MAT', 'LEN']:
            estimated_hours = base_hours + complexity_level - 1
        else:
            estimated_hours = base_hours
        
        # Determinar semestre basado en el código OA
        semester = 1
        if 'OA' in row['oa_code']:
            oa_number = int(re.findall(r'OA(\d+)', row['oa_code'])[0])
            semester = 1 if oa_number <= 15 else 2
        
        # Crear registro enriquecido
        enriched_record = {
            'oa_id': str(uuid.uuid4()),
            'oa_code': row['oa_code'],
            'oa_desc': row['oa_desc'],
            'oa_short_desc': row['oa_desc'][:100] + '...' if len(row['oa_desc']) > 100 else row['oa_desc'],
            'grade_code': row['grade'],
            'subject_code': row['subject'],
            'bloom_level': bloom_level,
            'cog_skill': cog_skill,
            'oa_version': '2023',
            'semester': semester,
            'complexity_level': complexity_level,
            'estimated_hours': estimated_hours,
            'ministerial_priority': 'normal',
            'is_transversal': False,
            'enriched_at': datetime.now().isoformat(),
            'source_url': row['source_url'],
            'scraped_at': row['scraped_at']
        }
        
        enriched_data.append(enriched_record)
    
    return enriched_data

def generate_sql_insert(enriched_data):
    """Genera el SQL de inserción para Supabase"""
    
    sql_header = """-- ===============================================
-- CARGA MASIVA: 847 OA COMPLETOS EDU21
-- Generado automáticamente - Pipeline completo
-- Fecha: {timestamp}
-- ===============================================

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
    deprecated_at timestamp,
    source_url text,
    scraped_at timestamp
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_learning_objective_grade ON learning_objective(grade_code);
CREATE INDEX IF NOT EXISTS idx_learning_objective_subject ON learning_objective(subject_code);
CREATE INDEX IF NOT EXISTS idx_learning_objective_bloom ON learning_objective(bloom_level);
CREATE INDEX IF NOT EXISTS idx_learning_objective_active ON learning_objective(deprecated_at) WHERE deprecated_at IS NULL;

-- Insertar 847 OA completos

""".format(timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    sql_inserts = ""
    
    for record in enriched_data:
        sql_inserts += f"""INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at, source_url, scraped_at
) VALUES (
    '{record['oa_id']}',
    '{record['oa_code']}',
    {repr(record['oa_desc'])},
    {repr(record['oa_short_desc'])},
    '{record['grade_code']}',
    '{record['subject_code']}',
    '{record['bloom_level']}',
    '{record['cog_skill']}',
    '{record['oa_version']}',
    {record['semester']},
    {record['complexity_level']},
    {record['estimated_hours']},
    '{record['ministerial_priority']}',
    {str(record['is_transversal']).lower()},
    '{record['enriched_at']}',
    {repr(record['source_url'])},
    '{record['scraped_at']}'
)
ON CONFLICT (oa_code) DO UPDATE SET
    oa_desc = EXCLUDED.oa_desc,
    oa_short_desc = EXCLUDED.oa_short_desc,
    bloom_level = EXCLUDED.bloom_level,
    cog_skill = EXCLUDED.cog_skill,
    complexity_level = EXCLUDED.complexity_level,
    estimated_hours = EXCLUDED.estimated_hours,
    enriched_at = EXCLUDED.enriched_at;

"""
    
    sql_footer = """
-- Verificaciones y estadísticas
SELECT 
    'Total OA cargados' as metric,
    COUNT(*) as value
FROM learning_objective;

SELECT 
    'Distribución por grado' as metric,
    grade_code,
    COUNT(*) as count
FROM learning_objective 
GROUP BY grade_code 
ORDER BY grade_code;

SELECT 
    'Distribución por asignatura' as metric,
    subject_code,
    COUNT(*) as count
FROM learning_objective 
GROUP BY subject_code 
ORDER BY count DESC;

SELECT 
    'Distribución por Bloom' as metric,
    bloom_level,
    COUNT(*) as count
FROM learning_objective 
GROUP BY bloom_level 
ORDER BY 
    CASE bloom_level 
        WHEN 'Recordar' THEN 1
        WHEN 'Comprender' THEN 2
        WHEN 'Aplicar' THEN 3
        WHEN 'Analizar' THEN 4
        WHEN 'Evaluar' THEN 5
        WHEN 'Crear' THEN 6
    END;

-- Insertar engines básicos recomendados
INSERT INTO game_engine (engine_id, code, name, description, subject_affinity) VALUES
('eng01', 'COUNTER', 'Counter/Number Line', 'Juegos de conteo y línea numérica', 'MAT'),
('eng02', 'DRAG_DROP_NUM', 'Drag-Drop Numbers', 'Arrastrar y soltar números', 'MAT'),
('eng03', 'MATH_OPS', 'Math Operations', 'Operaciones matemáticas básicas', 'MAT'),
('eng04', 'GEOMETRY', 'Geometry Explorer', 'Exploración de figuras geométricas', 'MAT'),
('eng05', 'TEXT_RECOG', 'Text Recognition', 'Reconocimiento de textos y palabras', 'LEN'),
('eng06', 'LETTER_SOUND', 'Letter-Sound Matching', 'Asociación letra-sonido', 'LEN'),
('eng07', 'READING_FLUENCY', 'Reading Fluency', 'Desarrollo de fluidez lectora', 'LEN'),
('eng08', 'STORY_COMP', 'Story Comprehension', 'Comprensión de narrativas', 'LEN'),
('eng09', 'LIFE_CYCLE', 'Life Cycle Simulator', 'Simulador de ciclos de vida', 'CN'),
('eng10', 'CLASSIFICATION', 'Classification Game', 'Juegos de clasificación científica', 'CN')
ON CONFLICT (engine_id) DO NOTHING;

-- Resumen final
SELECT 
    '🎯 CARGA COMPLETADA' as status,
    COUNT(*) as total_oa,
    COUNT(DISTINCT subject_code) as total_subjects,
    COUNT(DISTINCT grade_code) as total_grades
FROM learning_objective;
"""
    
    return sql_header + sql_inserts + sql_footer

def main():
    """Función principal de carga masiva"""
    
    print("🚀 === CARGA MASIVA: 847 OA COMPLETOS A SUPABASE ===")
    print("=" * 80)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. CARGAR DATASET COMPLETO
    input_file = 'oa_1b_6b_COMPLETO_FINAL_CORREGIDO.csv'
    
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encuentra el archivo {input_file}")
        return False
    
    df = pd.read_csv(input_file)
    total_oa = len(df)
    
    print(f"📊 Dataset cargado: {total_oa} OA")
    print(f"📚 Grados: {sorted(df['grade'].unique())}")
    print(f"📖 Asignaturas: {sorted(df['subject'].unique())}")
    print()
    
    # 2. CARGAR DATASETS DE ENRIQUECIMIENTO
    print("🧠 Cargando datasets de enriquecimiento...")
    verb_bloom_data, cognitive_skills = load_enrichment_datasets()
    print(f"✅ {len(verb_bloom_data)} verbos → Bloom cargados")
    print(f"✅ {len(cognitive_skills)} habilidades cognitivas cargadas")
    print()
    
    # 3. ENRIQUECER DATOS
    print("⚡ Enriqueciendo OA con Bloom y habilidades cognitivas...")
    enriched_data = enrich_oa_with_bloom_and_cognitive(df, verb_bloom_data, cognitive_skills)
    print(f"✅ {len(enriched_data)} OA enriquecidos")
    print()
    
    # 4. GENERAR ARCHIVOS DE SALIDA
    print("📝 Generando archivos de salida...")
    
    # SQL para Supabase
    sql_content = generate_sql_insert(enriched_data)
    sql_file = 'oa_847_completos_supabase.sql'
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    # CSV enriquecido
    df_enriched = pd.DataFrame(enriched_data)
    csv_file = 'oa_847_completos_enriquecidos.csv'
    df_enriched.to_csv(csv_file, index=False, encoding='utf-8')
    
    print(f"✅ SQL guardado: {sql_file}")
    print(f"✅ CSV enriquecido: {csv_file}")
    print()
    
    # 5. ESTADÍSTICAS FINALES
    print("📊 === ESTADÍSTICAS FINALES ===")
    print()
    
    # Por grado
    print("📚 DISTRIBUCIÓN POR GRADO:")
    grade_counts = df['grade'].value_counts().sort_index()
    for grade, count in grade_counts.items():
        percentage = (count / total_oa) * 100
        print(f"   {grade}: {count:3d} OA ({percentage:5.1f}%)")
    print()
    
    # Por asignatura
    print("📖 DISTRIBUCIÓN POR ASIGNATURA:")
    subject_counts = df['subject'].value_counts().sort_values(ascending=False)
    for subject, count in subject_counts.items():
        percentage = (count / total_oa) * 100
        print(f"   {subject}: {count:3d} OA ({percentage:5.1f}%)")
    print()
    
    # Por Bloom
    print("🧠 DISTRIBUCIÓN POR BLOOM:")
    bloom_counts = df_enriched['bloom_level'].value_counts()
    for bloom, count in bloom_counts.items():
        percentage = (count / total_oa) * 100
        print(f"   {bloom}: {count:3d} OA ({percentage:5.1f}%)")
    print()
    
    # 6. PRÓXIMOS PASOS
    print("🚀 === PRÓXIMOS PASOS ===")
    print()
    print(f"1. 📤 Ejecutar {sql_file} en Supabase SQL Editor")
    print("2. 🎮 Desarrollar 6 engines básicos prioritarios:")
    print("   • ENG01-Counter (MAT)")
    print("   • ENG02-DragDrop (MAT)")
    print("   • ENG05-TextRecog (LEN)")
    print("   • ENG06-LetterSound (LEN)")
    print("   • ENG07-ReadingFluency (LEN)")
    print("   • ENG09-LifeCycle (CN)")
    print("3. 🎨 Crear 90 skins para MAT/LEN (45 por materia)")
    print("4. 🧪 Testing piloto con 3 colegios")
    print("5. 📈 Refinamiento basado en feedback")
    print()
    
    print("=" * 80)
    print("🎉 ¡CARGA MASIVA COMPLETADA EXITOSAMENTE!")
    print(f"📊 {total_oa} OA listos para producción")
    print(f"⏰ Tiempo total: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Proceso completado. Archivos listos para carga a Supabase.")
    else:
        print("\n❌ Error en el proceso. Revisar logs.") 