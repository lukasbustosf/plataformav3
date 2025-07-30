#!/usr/bin/env python3
"""
DESARROLLO: 6 ENGINES BÁSICOS PRIORITARIOS EDU21
Script para crear y definir los engines fundamentales para MAT y LEN
Incluye especificaciones técnicas y configuraciones JSON
"""

import json
import uuid
from datetime import datetime

def create_engine_specifications():
    """Define las especificaciones técnicas de los 6 engines básicos"""
    
    engines = [
        {
            "engine_id": "ENG01",
            "code": "COUNTER",
            "name": "Counter/Number Line",
            "version": "1.0",
            "description": "Motor de juegos de conteo y línea numérica con progresión visual",
            "subject_affinity": ["MAT"],
            "recommended_grades": ["1B", "2B", "3B"],
            "bloom_levels": ["Recordar", "Comprender", "Aplicar"],
            "cognitive_skills": ["memoria_trabajo", "procesamiento_visual", "atencion_selectiva"],
            "game_mechanics": {
                "core_actions": ["count", "increment", "decrement", "position_on_line"],
                "visual_elements": ["number_line", "counters", "progress_bar"],
                "interaction_types": ["click", "drag", "keyboard_input"],
                "feedback_system": "immediate_visual_audio"
            },
            "technical_config": {
                "max_range": 100,
                "min_range": 0,
                "step_size": 1,
                "animation_speed": "medium",
                "sound_effects": True,
                "accessibility": {
                    "keyboard_navigation": True,
                    "screen_reader": True,
                    "high_contrast": True,
                    "tts_support": True
                }
            },
            "learning_objectives": [
                "MA01OA01", "MA01OA02", "MA01OA03", "MA02OA01", "MA02OA02", "MA03OA01"
            ],
            "difficulty_scaling": {
                "easy": {"range": [1, 10], "step": 1},
                "medium": {"range": [1, 50], "step": [1, 2, 5]},
                "hard": {"range": [1, 100], "step": [1, 2, 5, 10]}
            }
        },
        {
            "engine_id": "ENG02",
            "code": "DRAG_DROP_NUM",
            "name": "Drag-Drop Numbers",
            "version": "1.0",
            "description": "Motor de arrastrar y soltar para operaciones matemáticas y ordenamiento",
            "subject_affinity": ["MAT"],
            "recommended_grades": ["1B", "2B", "3B", "4B"],
            "bloom_levels": ["Comprender", "Aplicar"],
            "cognitive_skills": ["coordinacion_motora", "razonamiento_logico", "flexibilidad_mental"],
            "game_mechanics": {
                "core_actions": ["drag", "drop", "sort", "group", "match"],
                "visual_elements": ["number_cards", "drop_zones", "sorting_containers"],
                "interaction_types": ["drag_drop", "touch", "keyboard_alternative"],
                "feedback_system": "snap_feedback_with_validation"
            },
            "technical_config": {
                "max_items": 12,
                "drag_sensitivity": "medium",
                "drop_zone_tolerance": "generous",
                "auto_arrange": True,
                "collision_detection": True,
                "accessibility": {
                    "keyboard_navigation": True,
                    "screen_reader": True,
                    "drag_alternatives": True,
                    "focus_management": True
                }
            },
            "learning_objectives": [
                "MA01OA04", "MA01OA09", "MA02OA04", "MA02OA09", "MA03OA09", "MA04OA02"
            ],
            "difficulty_scaling": {
                "easy": {"items": 4, "operations": ["sort_ascending"]},
                "medium": {"items": 8, "operations": ["sort", "group_by_property"]},
                "hard": {"items": 12, "operations": ["complex_sort", "multi_criteria"]}
            }
        },
        {
            "engine_id": "ENG05",
            "code": "TEXT_RECOG",
            "name": "Text Recognition",
            "version": "1.0",
            "description": "Motor de reconocimiento de textos, letras y palabras con análisis fonético",
            "subject_affinity": ["LEN", "ING_PROP"],
            "recommended_grades": ["1B", "2B", "3B"],
            "bloom_levels": ["Recordar", "Comprender"],
            "cognitive_skills": ["procesamiento_visual", "comprension_verbal", "memoria_trabajo"],
            "game_mechanics": {
                "core_actions": ["identify", "select", "match", "trace", "pronounce"],
                "visual_elements": ["letter_cards", "word_bubbles", "text_highlight"],
                "interaction_types": ["click", "touch", "voice_input", "trace"],
                "feedback_system": "multi_modal_confirmation"
            },
            "technical_config": {
                "font_scaling": [12, 16, 20, 24],
                "color_themes": ["high_contrast", "pastel", "dark_mode"],
                "animation_types": ["fade", "bounce", "pulse"],
                "voice_recognition": True,
                "accessibility": {
                    "dyslexia_friendly": True,
                    "font_options": ["OpenDyslexic", "Arial", "Comic Sans"],
                    "letter_spacing": "adjustable",
                    "line_height": "adjustable"
                }
            },
            "learning_objectives": [
                "LE01OA01", "LE01OA02", "LE01OA03", "LE02OA03", "LE03OA03"
            ],
            "difficulty_scaling": {
                "easy": {"type": "single_letters", "count": 5},
                "medium": {"type": "simple_words", "count": 8},
                "hard": {"type": "complex_words", "count": 12}
            }
        },
        {
            "engine_id": "ENG06",
            "code": "LETTER_SOUND",
            "name": "Letter-Sound Matching",
            "version": "1.0",
            "description": "Motor de asociación letra-sonido con síntesis de voz y análisis fonológico",
            "subject_affinity": ["LEN", "ING_PROP"],
            "recommended_grades": ["1B", "2B"],
            "bloom_levels": ["Recordar", "Comprender", "Aplicar"],
            "cognitive_skills": ["procesamiento_auditivo", "memoria_trabajo", "atencion_selectiva"],
            "game_mechanics": {
                "core_actions": ["listen", "match", "repeat", "identify", "synthesize"],
                "visual_elements": ["phoneme_symbols", "mouth_animations", "sound_waves"],
                "interaction_types": ["audio_play", "voice_record", "click_match"],
                "feedback_system": "audio_visual_phonetic"
            },
            "technical_config": {
                "tts_engine": "advanced_phonetic",
                "voice_profiles": ["child_friendly", "clear_pronunciation"],
                "audio_quality": "high_fidelity",
                "recording_capability": True,
                "accessibility": {
                    "hearing_impaired": True,
                    "visual_phonics": True,
                    "vibration_feedback": True,
                    "captions": True
                }
            },
            "learning_objectives": [
                "LE01OA03", "LE01OA04", "LE02OA04", "EN01OA03", "EN01OA04"
            ],
            "difficulty_scaling": {
                "easy": {"phonemes": "vowels", "count": 5},
                "medium": {"phonemes": "consonants", "count": 10},
                "hard": {"phonemes": "complex_combinations", "count": 15}
            }
        },
        {
            "engine_id": "ENG07",
            "code": "READING_FLUENCY",
            "name": "Reading Fluency",
            "version": "1.0",
            "description": "Motor de desarrollo de fluidez lectora con seguimiento de velocidad y comprensión",
            "subject_affinity": ["LEN"],
            "recommended_grades": ["2B", "3B", "4B"],
            "bloom_levels": ["Comprender", "Aplicar"],
            "cognitive_skills": ["comprension_verbal", "atencion_selectiva", "memoria_trabajo"],
            "game_mechanics": {
                "core_actions": ["read_aloud", "track_speed", "comprehension_check", "repeat"],
                "visual_elements": ["text_highlighting", "progress_meter", "speed_indicator"],
                "interaction_types": ["voice_recording", "pace_control", "comprehension_quiz"],
                "feedback_system": "real_time_analytics"
            },
            "technical_config": {
                "speech_recognition": True,
                "wpm_tracking": True,
                "comprehension_metrics": True,
                "difficulty_adjustment": "adaptive",
                "accessibility": {
                    "reading_disabilities": True,
                    "font_customization": True,
                    "reading_ruler": True,
                    "pace_adjustment": True
                }
            },
            "learning_objectives": [
                "LE02OA05", "LE03OA01", "LE03OA05", "LE04OA01", "LE04OA05"
            ],
            "difficulty_scaling": {
                "easy": {"text_length": "short_sentences", "wpm_target": 30},
                "medium": {"text_length": "paragraphs", "wpm_target": 60},
                "hard": {"text_length": "full_stories", "wpm_target": 90}
            }
        },
        {
            "engine_id": "ENG09",
            "code": "LIFE_CYCLE",
            "name": "Life Cycle Simulator",
            "version": "1.0",
            "description": "Motor de simulación de ciclos de vida con interacciones ecológicas",
            "subject_affinity": ["CN"],
            "recommended_grades": ["1B", "2B", "3B", "4B"],
            "bloom_levels": ["Comprender", "Aplicar", "Analizar"],
            "cognitive_skills": ["razonamiento_logico", "procesamiento_visual", "memoria_trabajo"],
            "game_mechanics": {
                "core_actions": ["observe", "sequence", "predict", "interact", "experiment"],
                "visual_elements": ["3d_models", "time_progression", "environment_simulation"],
                "interaction_types": ["timeline_control", "environment_modification", "observation"],
                "feedback_system": "scientific_discovery"
            },
            "technical_config": {
                "simulation_speed": "variable",
                "visual_fidelity": "educational_realistic",
                "interaction_complexity": "age_appropriate",
                "data_collection": True,
                "accessibility": {
                    "motion_sensitivity": True,
                    "simplified_controls": True,
                    "audio_descriptions": True,
                    "static_alternatives": True
                }
            },
            "learning_objectives": [
                "CN01OA01", "CN01OA02", "CN02OA01", "CN03OA01", "CN04OA01"
            ],
            "difficulty_scaling": {
                "easy": {"organisms": "simple_plants", "stages": 3},
                "medium": {"organisms": "animals", "stages": 4},
                "hard": {"organisms": "complex_ecosystems", "stages": 6}
            }
        }
    ]
    
    return engines

def generate_engine_sql(engines):
    """Genera SQL para insertar los engines en Supabase"""
    
    sql = """-- ===============================================
-- CREACIÓN: 6 ENGINES BÁSICOS PRIORITARIOS EDU21
-- Fecha: {timestamp}
-- Versión: 1.0
-- ===============================================

-- Crear tabla de engines si no existe
CREATE TABLE IF NOT EXISTS game_engine (
    engine_id varchar(10) PRIMARY KEY,
    code varchar(50) UNIQUE NOT NULL,
    name varchar(100) NOT NULL,
    version varchar(10) DEFAULT '1.0',
    description text,
    subject_affinity text[], -- Array de asignaturas
    recommended_grades text[], -- Array de grados
    bloom_levels text[], -- Array de niveles Bloom
    cognitive_skills text[], -- Array de habilidades cognitivas
    game_mechanics jsonb, -- Configuración de mecánicas
    technical_config jsonb, -- Configuración técnica
    learning_objectives text[], -- Array de códigos OA
    difficulty_scaling jsonb, -- Configuración de dificultad
    status varchar(20) DEFAULT 'development',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    created_by varchar(50) DEFAULT 'system'
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_game_engine_subject ON game_engine USING GIN (subject_affinity);
CREATE INDEX IF NOT EXISTS idx_game_engine_grades ON game_engine USING GIN (recommended_grades);
CREATE INDEX IF NOT EXISTS idx_game_engine_bloom ON game_engine USING GIN (bloom_levels);
CREATE INDEX IF NOT EXISTS idx_game_engine_status ON game_engine(status);

-- Insertar 6 engines básicos

""".format(timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    for engine in engines:
        sql += f"""
INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    '{engine['engine_id']}',
    '{engine['code']}',
    '{engine['name']}',
    '{engine['version']}',
    {repr(engine['description'])},
    ARRAY{engine['subject_affinity']},
    ARRAY{engine['recommended_grades']},
    ARRAY{engine['bloom_levels']},
    ARRAY{engine['cognitive_skills']},
    '{json.dumps(engine['game_mechanics'], ensure_ascii=False)}'::jsonb,
    '{json.dumps(engine['technical_config'], ensure_ascii=False)}'::jsonb,
    ARRAY{engine['learning_objectives']},
    '{json.dumps(engine['difficulty_scaling'], ensure_ascii=False)}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();

"""
    
    sql += """
-- Verificaciones y estadísticas
SELECT 
    '🎮 ENGINES CREADOS' as status,
    COUNT(*) as total_engines
FROM game_engine 
WHERE status = 'ready_for_development';

SELECT 
    'Distribución por asignatura' as metric,
    unnest(subject_affinity) as subject,
    COUNT(*) as engine_count
FROM game_engine 
WHERE status = 'ready_for_development'
GROUP BY unnest(subject_affinity)
ORDER BY engine_count DESC;

SELECT 
    'Cobertura por grado' as metric,
    unnest(recommended_grades) as grade,
    COUNT(*) as engine_count
FROM game_engine 
WHERE status = 'ready_for_development'
GROUP BY unnest(recommended_grades)
ORDER BY grade;

-- Crear tabla de relación engine-OA para mapeo
CREATE TABLE IF NOT EXISTS engine_learning_objective (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    engine_id varchar(10) REFERENCES game_engine(engine_id),
    oa_code varchar(20),
    compatibility_score decimal(3,2) DEFAULT 0.90,
    recommended_difficulty varchar(20) DEFAULT 'medium',
    estimated_playtime_minutes integer DEFAULT 15,
    created_at timestamp DEFAULT now()
);

-- Poblar relaciones engine-OA
INSERT INTO engine_learning_objective (engine_id, oa_code, compatibility_score, recommended_difficulty)
SELECT 
    e.engine_id,
    unnest(e.learning_objectives) as oa_code,
    0.95,
    'medium'
FROM game_engine e
WHERE e.status = 'ready_for_development'
ON CONFLICT DO NOTHING;

-- Resumen final
SELECT 
    '🚀 ENGINES IMPLEMENTADOS' as status,
    COUNT(DISTINCT e.engine_id) as engines,
    COUNT(DISTINCT elo.oa_code) as oa_cubiertos,
    COUNT(*) as total_relaciones
FROM game_engine e
LEFT JOIN engine_learning_objective elo ON e.engine_id = elo.engine_id
WHERE e.status = 'ready_for_development';
"""
    
    return sql

def generate_implementation_roadmap():
    """Genera el roadmap de implementación de los engines"""
    
    roadmap = {
        "fase_1_fundacion": {
            "duracion": "4 semanas",
            "engines": ["ENG01-COUNTER", "ENG02-DRAG_DROP_NUM"],
            "objetivos": [
                "Implementar arquitectura base de engines",
                "Crear sistema de configuración JSON",
                "Desarrollar interfaz común de engines",
                "Testing básico con matemáticas 1° básico"
            ],
            "entregables": [
                "Engine Counter funcional",
                "Engine DragDrop funcional", 
                "Documentación técnica",
                "Suite de tests unitarios"
            ]
        },
        "fase_2_expansion": {
            "duracion": "4 semanas",
            "engines": ["ENG05-TEXT_RECOG", "ENG06-LETTER_SOUND"],
            "objetivos": [
                "Implementar engines de lenguaje",
                "Integrar TTS y reconocimiento de voz",
                "Crear sistema de accesibilidad",
                "Testing con lectoescritura 1°-2° básico"
            ],
            "entregables": [
                "Engine TextRecog funcional",
                "Engine LetterSound funcional",
                "Sistema TTS integrado",
                "Herramientas de accesibilidad"
            ]
        },
        "fase_3_avanzados": {
            "duracion": "4 semanas", 
            "engines": ["ENG07-READING_FLUENCY", "ENG09-LIFE_CYCLE"],
            "objetivos": [
                "Implementar engines complejos",
                "Sistema de analytics avanzado",
                "Integración con IA para recomendaciones",
                "Testing integral con docentes"
            ],
            "entregables": [
                "Engine ReadingFluency funcional",
                "Engine LifeCycle funcional",
                "Dashboard de analytics",
                "Sistema de recomendaciones IA"
            ]
        },
        "fase_4_integracion": {
            "duracion": "2 semanas",
            "engines": ["TODOS"],
            "objetivos": [
                "Integración completa en plataforma",
                "Optimización de rendimiento",
                "Testing de carga",
                "Preparación para producción"
            ],
            "entregables": [
                "6 engines completamente integrados",
                "Documentación de usuario",
                "Manual de implementación",
                "Sistema listo para skins"
            ]
        }
    }
    
    return roadmap

def main():
    """Función principal para crear los 6 engines básicos"""
    
    print("🎮 === DESARROLLO: 6 ENGINES BÁSICOS PRIORITARIOS ===")
    print("=" * 80)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. CREAR ESPECIFICACIONES
    print("📝 Creando especificaciones de engines...")
    engines = create_engine_specifications()
    print(f"✅ {len(engines)} engines especificados")
    print()
    
    # 2. GENERAR SQL
    print("📤 Generando SQL para Supabase...")
    sql_content = generate_engine_sql(engines)
    sql_file = "engines_6_basicos_supabase.sql"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"✅ SQL guardado: {sql_file}")
    print()
    
    # 3. GENERAR JSON DE CONFIGURACIÓN
    print("⚙️ Generando archivos de configuración...")
    config_file = "engines_6_basicos_config.json"
    
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(engines, f, indent=2, ensure_ascii=False)
    print(f"✅ Config guardado: {config_file}")
    print()
    
    # 4. GENERAR ROADMAP
    print("🗺️ Generando roadmap de implementación...")
    roadmap = generate_implementation_roadmap()
    roadmap_file = "engines_roadmap_implementacion.json"
    
    with open(roadmap_file, 'w', encoding='utf-8') as f:
        json.dump(roadmap, f, indent=2, ensure_ascii=False)
    print(f"✅ Roadmap guardado: {roadmap_file}")
    print()
    
    # 5. RESUMEN DE ENGINES
    print("📊 === RESUMEN DE ENGINES CREADOS ===")
    print()
    
    for i, engine in enumerate(engines, 1):
        print(f"{i}. {engine['code']} - {engine['name']}")
        print(f"   📚 Asignaturas: {', '.join(engine['subject_affinity'])}")
        print(f"   🎯 Grados: {', '.join(engine['recommended_grades'])}")
        print(f"   🧠 Bloom: {', '.join(engine['bloom_levels'])}")
        print(f"   📝 {engine['description'][:60]}...")
        print()
    
    # 6. MAPEO CON OA
    print("🔗 === MAPEO CON OBJETIVOS DE APRENDIZAJE ===")
    print()
    
    oa_coverage = {}
    for engine in engines:
        for oa in engine['learning_objectives']:
            if oa not in oa_coverage:
                oa_coverage[oa] = []
            oa_coverage[oa].append(engine['code'])
    
    print(f"📊 Total OA cubiertos: {len(oa_coverage)}")
    print(f"🎮 Engines por OA (promedio): {sum(len(v) for v in oa_coverage.values()) / len(oa_coverage):.1f}")
    print()
    
    # Mostrar algunos ejemplos
    print("📝 Ejemplos de cobertura:")
    for i, (oa, engines_list) in enumerate(list(oa_coverage.items())[:8]):
        print(f"   {oa}: {', '.join(engines_list)}")
    print()
    
    # 7. PRÓXIMOS PASOS
    print("🚀 === PRÓXIMOS PASOS IMPLEMENTACIÓN ===")
    print()
    print(f"1. 📤 Ejecutar {sql_file} en Supabase")
    print("2. 🏗️ Implementar arquitectura base de engines (Fase 1)")
    print("3. ⚡ Desarrollar ENG01-Counter y ENG02-DragDrop")
    print("4. 🔊 Integrar TTS para engines de lenguaje")
    print("5. 🎨 Comenzar desarrollo de 90 skins MAT/LEN")
    print("6. 🧪 Testing con docentes de 1°-3° básico")
    print()
    
    print("📅 CRONOGRAMA ESTIMADO:")
    roadmap = generate_implementation_roadmap()
    for fase, info in roadmap.items():
        fase_name = fase.replace('_', ' ').title()
        print(f"   {fase_name}: {info['duracion']} ({', '.join(info['engines'])})")
    print()
    
    print("=" * 80)
    print("🎉 ¡ENGINES BÁSICOS ESPECIFICADOS COMPLETAMENTE!")
    print(f"🎮 6 engines listos para desarrollo")
    print(f"📊 {len(oa_coverage)} OA cubiertos inicialmente")
    print(f"⏱️ Tiempo estimado: 14 semanas desarrollo completo")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Engines básicos especificados. Listos para implementación.")
    else:
        print("\n❌ Error en especificación. Revisar logs.") 