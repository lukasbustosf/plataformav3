#!/usr/bin/env python3
"""
Script final para cargar 79 OA de 1° Básico a Supabase
Dataset completo: MAT, LEN, CN, MUS, TEC, ORI
"""

import pandas as pd
import uuid
from datetime import datetime

def main():
    print("🚀 === CARGA FINAL 1° BÁSICO COMPLETO A SUPABASE ===")
    
    # Cargar dataset completo
    input_file = 'oa_1basico_final_enriquecido.csv'
    df = pd.read_csv(input_file)
    
    print(f"📊 Cargando {len(df)} OA de {len(df['subject_code'].unique())} materias")
    print()
    
    # Mostrar distribución
    print("📚 DISTRIBUCIÓN POR MATERIA:")
    for subject, count in df['subject_code'].value_counts().items():
        print(f"  {subject}: {count} OA")
    print()
    
    print("🧠 DISTRIBUCIÓN BLOOM:")
    for bloom, count in df['bloom_level'].value_counts().items():
        print(f"  {bloom}: {count} OA")
    print()
    
    # Generar archivos de salida
    sql_file = 'oa_1basico_completo_final.sql'
    csv_file = 'oa_1basico_completo_final.csv'
    
    # Generar SQL
    print("📝 Generando SQL para Supabase...")
    sql_content = generate_sql(df)
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    # Preparar CSV limpio
    df_clean = prepare_csv(df)
    df_clean.to_csv(csv_file, index=False)
    
    print(f"✅ SQL guardado: {sql_file}")
    print(f"✅ CSV guardado: {csv_file}")
    print()
    
    # Generar recomendaciones de engines
    generate_engine_recommendations(df)
    
    # Resumen final
    print("📊 === RESUMEN FINAL ===")
    print(f"✅ 1° Básico COMPLETO: {len(df)} OA de {len(df['subject_code'].unique())} materias")
    print("✅ Pipeline: Scraping → Enriquecimiento → Supabase")
    print("✅ 30 engines base definidos")
    print("✅ Archivos listos para carga")
    print("🚀 ¡LISTO PARA PRODUCCIÓN!")

def generate_sql(df):
    """Genera SQL completo para insertar en Supabase"""
    
    sql = """-- === CARGA COMPLETA 1° BÁSICO - 79 OA ===
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
"""
    
    for _, row in df.iterrows():
        oa_id = str(uuid.uuid4())
        sql += f"""
INSERT INTO learning_objective (
    oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
    bloom_level, cog_skill, oa_version, semester, complexity_level,
    estimated_hours, ministerial_priority, is_transversal, enriched_at
) VALUES (
    '{oa_id}',
    '{row['oa_code']}',
    '{str(row['oa_desc']).replace("'", "''")}',
    '{str(row['oa_short_desc']).replace("'", "''")}',
    '{row['grade_code']}',
    '{row['subject_code']}',
    '{row['bloom_level']}',
    '{row['cog_skill']}',
    '{row['oa_version']}',
    {row['semester']},
    {row['complexity_level']},
    {row['estimated_hours']},
    '{row['ministerial_priority']}',
    {str(row['is_transversal']).lower()},
    '{row['enriched_at']}'
);"""
    
    sql += """

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
"""
    
    return sql

def prepare_csv(df):
    """Prepara CSV limpio para importación directa"""
    
    df_clean = df.copy()
    
    # Agregar UUID para cada registro
    df_clean['oa_id'] = [str(uuid.uuid4()) for _ in range(len(df_clean))]
    
    # Reordenar columnas para match con tabla Supabase
    columns_order = [
        'oa_id', 'oa_code', 'oa_desc', 'oa_short_desc', 
        'grade_code', 'subject_code', 'bloom_level', 'cog_skill',
        'oa_version', 'semester', 'complexity_level', 'estimated_hours',
        'ministerial_priority', 'is_transversal', 'enriched_at'
    ]
    
    df_clean = df_clean[columns_order]
    return df_clean

def generate_engine_recommendations(df):
    """Genera recomendaciones específicas de engines por materia"""
    
    print("🎮 === ENGINES RECOMENDADOS POR MATERIA ===")
    print()
    
    subject_names = {
        'MAT': '📐 MATEMÁTICA',
        'LEN': '📖 LENGUAJE', 
        'CN': '🔬 CIENCIAS NATURALES',
        'MUS': '🎵 MÚSICA',
        'TEC': '⚙️ TECNOLOGÍA',
        'ORI': '👥 ORIENTACIÓN'
    }
    
    # Engines base por materia
    engine_map = {
        'MAT': ['ENG01-Counter', 'ENG02-DragDrop', 'ENG03-Operations', 'ENG04-Geometry'],
        'LEN': ['ENG05-TextRecog', 'ENG06-LetterSound', 'ENG07-Reading', 'ENG08-Writing'],
        'CN': ['ENG09-LifeCycle', 'ENG10-AnimalClass', 'ENG11-Environment'],
        'MUS': ['ENG12-SoundRecog', 'ENG13-Rhythm', 'ENG14-Expression'],
        'TEC': ['ENG15-Design', 'ENG16-Building', 'ENG17-Software'],
        'ORI': ['ENG18-SelfDisc', 'ENG19-Emotion', 'ENG20-Social']
    }
    
    for subject in df['subject_code'].unique():
        subject_df = df[df['subject_code'] == subject]
        subject_name = subject_names.get(subject, f"📚 {subject}")
        engines = engine_map.get(subject, ['ENG-Generic'])
        
        print(f"{subject_name} ({len(subject_df)} OA):")
        print(f"  Engines sugeridos: {', '.join(engines)}")
        
        # Mostrar distribución Bloom para la materia
        bloom_dist = subject_df['bloom_level'].value_counts()
        print(f"  Distribución Bloom: {dict(bloom_dist)}")
        print()
    
    print("🔄 === PRÓXIMOS PASOS ===")
    print("1. 📤 Ejecutar SQL en Supabase Dashboard")
    print("2. 🎮 Desarrollar 20+ engines específicos")
    print(f"3. 🎨 Crear ~{len(df)*5} skins variados")
    print("4. 🧪 Testing con docentes y estudiantes")
    print("5. 📈 Escalar a 2° básico (duplicar dataset)")
    print("6. 🤖 IA para recomendación automática")
    print()

if __name__ == "__main__":
    main() 