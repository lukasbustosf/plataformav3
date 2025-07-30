#!/usr/bin/env python3
"""
Generador de Archivos Finales 2°-6° Básico para Supabase
Versión: 1.1.0
"""

import pandas as pd
import uuid
from datetime import datetime

def generate_final_files():
    """Genera archivos finales CSV y SQL para Supabase con datos de 2°-6° básico"""
    
    print("🚀 GENERANDO ARCHIVOS FINALES 2°-6° BÁSICO PARA SUPABASE")
    print("=" * 60)
    
    # Cargar datos enriquecidos
    input_file = "oa_2b_6b_enriquecido_progresivo.csv"
    
    try:
        df = pd.read_csv(input_file)
        print(f"📊 Cargados {len(df)} OA del archivo: {input_file}")
        
        # Agregar UUIDs únicos
        df['oa_id'] = [str(uuid.uuid4()) for _ in range(len(df))]
        
        # Reorganizar columnas para Supabase
        columns_order = [
            'oa_id', 'oa_code', 'oa_desc', 'oa_short_desc', 'grade_code', 
            'subject_code', 'bloom_level', 'cog_skill', 'oa_version', 
            'semester', 'complexity_level', 'estimated_hours', 
            'ministerial_priority', 'is_transversal', 'enriched_at'
        ]
        
        df_final = df[columns_order]
        
        # Estadísticas
        print(f"\n📚 DISTRIBUCIÓN POR GRADO:")
        grade_counts = df['grade_code'].value_counts().sort_index()
        for grade, count in grade_counts.items():
            print(f"  {grade}: {count} OA")
        
        print(f"\n📖 DISTRIBUCIÓN POR ASIGNATURA:")
        subject_counts = df['subject_code'].value_counts().sort_values(ascending=False)
        for subject, count in subject_counts.items():
            print(f"  {subject}: {count} OA")
        
        print(f"\n🧠 DISTRIBUCIÓN BLOOM:")
        bloom_counts = df['bloom_level'].value_counts().sort_values(ascending=False)
        for bloom, count in bloom_counts.items():
            print(f"  {bloom}: {count} OA")
        
        # Generar archivo CSV final
        csv_output = "oa_2b_6b_final_completo.csv"
        df_final.to_csv(csv_output, index=False, encoding='utf-8')
        print(f"\n✅ CSV final guardado: {csv_output}")
        
        # Generar archivo SQL
        sql_output = "oa_2b_6b_final_completo.sql"
        
        with open(sql_output, 'w', encoding='utf-8') as f:
            f.write("-- EDU21 Platform: Learning Objectives 2°-6° Básico\n")
            f.write(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"-- Total OA: {len(df_final)}\n")
            f.write("-- Grades: 2B, 3B, 4B, 5B, 6B\n")
            f.write("-- Subjects: MAT, LEN, CN, HIS, ING, EDF, ART, MUS, TEC, ORI\n\n")
            
            f.write("-- Create table if not exists\n")
            f.write("""CREATE TABLE IF NOT EXISTS learning_objective (
    oa_id UUID PRIMARY KEY,
    oa_code VARCHAR(20) UNIQUE NOT NULL,
    oa_desc TEXT NOT NULL,
    oa_short_desc TEXT,
    grade_code VARCHAR(5) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    bloom_level VARCHAR(20),
    cog_skill VARCHAR(50),
    oa_version VARCHAR(10) DEFAULT '2023',
    semester INTEGER DEFAULT 1,
    complexity_level INTEGER DEFAULT 1,
    estimated_hours INTEGER DEFAULT 4,
    ministerial_priority VARCHAR(20) DEFAULT 'normal',
    is_transversal BOOLEAN DEFAULT FALSE,
    enriched_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

""")
            
            f.write("-- Insert Learning Objectives\n")
            
            for _, row in df_final.iterrows():
                oa_desc_clean = str(row['oa_desc']).replace("'", "''").replace('\n', ' ')
                oa_short_desc_clean = str(row['oa_short_desc']).replace("'", "''").replace('\n', ' ')
                
                f.write(f"INSERT INTO learning_objective (oa_id, oa_code, oa_desc, oa_short_desc, grade_code, subject_code, bloom_level, cog_skill, oa_version, semester, complexity_level, estimated_hours, ministerial_priority, is_transversal, enriched_at) VALUES ('{row['oa_id']}', '{row['oa_code']}', '{oa_desc_clean}', '{oa_short_desc_clean}', '{row['grade_code']}', '{row['subject_code']}', '{row['bloom_level']}', '{row['cog_skill']}', '{row['oa_version']}', {row['semester']}, {row['complexity_level']}, {row['estimated_hours']}, '{row['ministerial_priority']}', {str(row['is_transversal']).lower()}, '{row['enriched_at']}');\n")
            
            f.write(f"\n-- Verification queries\n")
            f.write(f"SELECT COUNT(*) as total_oa FROM learning_objective WHERE grade_code IN ('2B', '3B', '4B', '5B', '6B');\n")
            f.write(f"SELECT grade_code, COUNT(*) as count FROM learning_objective WHERE grade_code IN ('2B', '3B', '4B', '5B', '6B') GROUP BY grade_code ORDER BY grade_code;\n")
            f.write(f"SELECT subject_code, COUNT(*) as count FROM learning_objective WHERE grade_code IN ('2B', '3B', '4B', '5B', '6B') GROUP BY subject_code ORDER BY count DESC;\n")
        
        print(f"✅ SQL final guardado: {sql_output}")
        
        print(f"\n🔄 ARCHIVOS LISTOS PARA SUPABASE:")
        print(f"  📄 {csv_output}")
        print(f"  📄 {sql_output}")
        
        print(f"\n🎯 PRÓXIMOS PASOS:")
        print(f"  1. Cargar SQL en Supabase Dashboard")
        print(f"  2. Verificar con queries de validación")
        print(f"  3. Desarrollar engines específicos por materia")
        print(f"  4. Escalar a cursos superiores")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    generate_final_files() 