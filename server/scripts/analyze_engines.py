#!/usr/bin/env python3
"""
Análisis de Engines y Skins requeridos para OA 1° Básico
Basado en los 18 OA enriquecidos de MAT + LEN
"""

import pandas as pd
import json

def analyze_oa_requirements():
    # Cargar datos enriquecidos COMPLETOS de 1° Básico (79 OA)
    df = pd.read_csv('oa_1basico_final_enriquecido.csv')
    
    print("🎮 === ANÁLISIS ENGINES/SKINS REQUERIDOS - 1° BÁSICO COMPLETO ===")
    print(f"📊 Total OA analizados: {len(df)}")
    print()
    
    # Análisis por materia
    print("📚 Por MATERIA:")
    subjects = df['subject_code'].value_counts()
    for subject, count in subjects.items():
        print(f"  {subject}: {count} OA")
    print()
    
    # Análisis por nivel Bloom
    print("🧠 Por BLOOM LEVEL:")
    bloom = df['bloom_level'].value_counts()
    for level, count in bloom.items():
        print(f"  {level}: {count} OA")
    print()
    
    # Análisis por habilidad cognitiva
    print("⚡ Por HABILIDAD COGNITIVA:")
    cog_skills = df['cog_skill'].value_counts()
    for skill, count in cog_skills.items():
        print(f"  {skill}: {count} OA")
    print()
    
    # Análisis por complejidad
    print("📈 Por COMPLEJIDAD:")
    complexity = df['complexity_level'].value_counts().sort_index()
    for level, count in complexity.items():
        print(f"  Nivel {level}: {count} OA")
    print()
    
    # Muestras específicas por materia 
    print("🔍 === SAMPLES ESPECÍFICOS ===")
    print()
    
    # Mostrar samples de cada materia disponible
    for subject in df['subject_code'].unique():
        subject_df = df[df['subject_code'] == subject].head(3)
        
        # Mapeo de nombres completos
        subject_names = {
            'MAT': '📐 MATEMÁTICA',
            'LEN': '📖 LENGUAJE', 
            'CN': '🔬 CIENCIAS NATURALES',
            'MUS': '🎵 MÚSICA',
            'TEC': '⚙️ TECNOLOGÍA',
            'ORI': '👥 ORIENTACIÓN'
        }
        
        subject_name = subject_names.get(subject, f"📚 {subject}")
        print(f"{subject_name} (primeros 3 OA):")
        
        for _, row in subject_df.iterrows():
            print(f"  {row['oa_code']}: {row['oa_desc'][:80]}...")
            print(f"    🧠 Bloom: {row['bloom_level']} | ⚡ Cog: {row['cog_skill']} | 📈 Nivel: {row['complexity_level']}")
            print()
    
    # Análisis de engines por materia
    print("🎮 === ENGINES RECOMENDADOS POR MATERIA ===")
    print()
    
    # MATEMÁTICA
    if 'MAT' in df['subject_code'].values:
        mat_df = df[df['subject_code'] == 'MAT']
        print("📐 MATEMÁTICA - Engines sugeridos:")
        print("  🔢 Número/Conteo (MA01OA01-08):")
        print("    • ENG01: Counter/Number Line")
        print("    • ENG02: Drag-Drop Numbers") 
        print("    • ENG03: Visual Counting")
        print("  🔄 Operaciones (MA01OA09-12):")
        print("    • ENG04: Addition/Subtraction Solver")
        print("    • ENG05: Visual Math Operations")
        print("  📊 Geometría/Medición (MA01OA13-20):")
        print("    • ENG06: Shape Recognition")
        print("    • ENG07: Spatial Relations")
        print()

    # LENGUAJE
    if 'LEN' in df['subject_code'].values:
        len_df = df[df['subject_code'] == 'LEN']
        print("📖 LENGUAJE - Engines sugeridos:")
        print("  📝 Lectura Inicial (LE01OA01-05):")
        print("    • ENG08: Text Recognition")
        print("    • ENG09: Letter-Sound Matching")
        print("    • ENG10: Reading Fluency")
        print("  🎭 Comprensión (LE01OA06-12):")
        print("    • ENG11: Story Comprehension")
        print("    • ENG12: Text Analysis")
        print("  ✍️ Escritura (LE01OA13-16):")
        print("    • ENG13: Writing Practice")
        print("    • ENG14: Vocabulary Builder")
        print()

    # CIENCIAS NATURALES  
    if 'CN' in df['subject_code'].values:
        cn_df = df[df['subject_code'] == 'CN']
        print("🔬 CIENCIAS NATURALES - Engines sugeridos:")
        print("  🌱 Seres Vivos (CN01OA01-06):")
        print("    • ENG15: Life Cycle Simulator")
        print("    • ENG16: Animal/Plant Classifier")
        print("  🌍 Entorno (CN01OA07-12):")
        print("    • ENG17: Environment Explorer")
        print("    • ENG18: Weather/Seasons Game")
        print()

    # MÚSICA
    if 'MUS' in df['subject_code'].values:
        mus_df = df[df['subject_code'] == 'MUS']
        print("🎵 MÚSICA - Engines sugeridos:")
        print("  🎶 Escucha/Ritmo (MU01OA01-04):")
        print("    • ENG19: Sound Recognition")
        print("    • ENG20: Rhythm Pattern Game")
        print("  🎤 Expresión (MU01OA05-07):")
        print("    • ENG21: Voice/Movement Activity")
        print("    • ENG22: Musical Creativity")
        print()

    # TECNOLOGÍA
    if 'TEC' in df['subject_code'].values:
        tec_df = df[df['subject_code'] == 'TEC']
        print("⚙️ TECNOLOGÍA - Engines sugeridos:")
        print("  🛠️ Diseño/Construcción (TE01OA01-04):")
        print("    • ENG23: Design Simulator")
        print("    • ENG24: Building/Construction Game")
        print("  💻 TIC (TE01OA05-06):")
        print("    • ENG25: Software Exploration")
        print("    • ENG26: Digital Drawing Tool")
        print()

    # ORIENTACIÓN
    if 'ORI' in df['subject_code'].values:
        ori_df = df[df['subject_code'] == 'ORI']
        print("👥 ORIENTACIÓN - Engines sugeridos:")
        print("  🧠 Crecimiento Personal (OR01OA01-04):")
        print("    • ENG27: Self-Discovery Game")
        print("    • ENG28: Emotion Recognition")
        print("  🤝 Relaciones/Convivencia (OR01OA05-08):")
        print("    • ENG29: Social Skills Simulator")
        print("    • ENG30: Conflict Resolution Game")
        print()
    
    # Combinaciones Bloom x Materia
    print("\n🎯 === COMBINACIONES CRÍTICAS ===")
    combo = df.groupby(['subject_code', 'bloom_level']).size().reset_index(name='count')
    for _, row in combo.iterrows():
        print(f"  {row['subject_code']} + {row['bloom_level']}: {row['count']} OA")
    
    print("\n🚀 === PRÓXIMOS PASOS ===")
    print(f"1. 📥 Cargar estos {len(df)} OA a Supabase")
    print("2. 🎮 Crear engines específicos para 6 materias")
    print("3. 🎨 Desarrollar ~700 skins por materia/Bloom") 
    print("4. 📈 Escalar a 2° básico y siguientes grados")
    print("5. 🤖 IA para recomendación automática engine+skin")
    print("6. 🎯 Testing con docentes de 1° básico")
    print()
    print("📊 === TOTALES FINALES ===")
    print(f"✅ 1° Básico COMPLETO: {len(df)} OA de 6 materias")
    print("✅ 30 engines base definidos")
    print("✅ Pipeline scraping → enriquecimiento → Supabase")
    print("🚀 ¡LISTO PARA IMPLEMENTACIÓN!")

if __name__ == "__main__":
    analyze_oa_requirements() 