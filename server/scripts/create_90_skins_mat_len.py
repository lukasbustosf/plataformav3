#!/usr/bin/env python3
"""
DESARROLLO: 90 SKINS COMPLETOS PARA MAT Y LEN
Script para crear catálogo completo de skins con especificaciones técnicas
45 skins MAT + 45 skins LEN con variaciones temáticas y de dificultad
"""

import json
import uuid
from datetime import datetime

def create_math_skins():
    """Crea las 45 skins para matemáticas"""
    
    # Temáticas base para matemáticas
    themes = {
        "animales": {
            "name": "Reino Animal",
            "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
            "elements": ["perros", "gatos", "pájaros", "peces", "insectos"],
            "appeal": "high"
        },
        "espacio": {
            "name": "Aventura Espacial", 
            "colors": ["#1A1A2E", "#16213E", "#E94560"],
            "elements": ["planetas", "cohetes", "estrellas", "aliens", "meteoritos"],
            "appeal": "high"
        },
        "deportes": {
            "name": "Mundo Deportivo",
            "colors": ["#FF9500", "#00B894", "#0984E3"],
            "elements": ["pelotas", "uniformes", "medallas", "campos", "equipos"],
            "appeal": "medium"
        },
        "naturaleza": {
            "name": "Naturaleza Viva",
            "colors": ["#00B894", "#FDCB6E", "#6C5CE7"],
            "elements": ["árboles", "flores", "montañas", "ríos", "jardines"],
            "appeal": "medium"
        },
        "fantasia": {
            "name": "Mundo Fantástico",
            "colors": ["#A29BFE", "#FD79A8", "#FDCB6E"],
            "elements": ["dragones", "castillos", "magos", "princesas", "tesoros"],
            "appeal": "high"
        },
        "vehiculos": {
            "name": "Medios de Transporte",
            "colors": ["#74B9FF", "#00CEC9", "#FD79A8"],
            "elements": ["autos", "aviones", "barcos", "trenes", "bicicletas"],
            "appeal": "high"
        },
        "cocina": {
            "name": "Chef en Acción",
            "colors": ["#E17055", "#FDCB6E", "#00B894"],
            "elements": ["frutas", "verduras", "pasteles", "utensilios", "recetas"],
            "appeal": "medium"
        },
        "piratas": {
            "name": "Aventura Pirata",
            "colors": ["#8B4513", "#FFD700", "#000080"],
            "elements": ["barcos", "tesoros", "mapas", "loros", "islas"],
            "appeal": "high"
        },
        "circo": {
            "name": "Gran Circo",
            "colors": ["#FF0000", "#FFD700", "#FF1493"],
            "elements": ["payasos", "leones", "trapecistas", "malabares", "carpa"],
            "appeal": "high"
        }
    }
    
    math_skins = []
    
    # ENG01-COUNTER: 15 skins (5 por cada theme principal)
    counter_themes = ["animales", "espacio", "naturaleza"]
    for i, theme_key in enumerate(counter_themes):
        theme = themes[theme_key]
        for difficulty in ["easy", "medium", "hard"]:
            for variant in range(5):
                skin_id = f"SKIN_MAT_{str(len(math_skins) + 1).zfill(3)}"
                
                skin = {
                    "skin_id": skin_id,
                    "engine_id": "ENG01",
                    "engine_code": "COUNTER",
                    "name": f"{theme['name']} - Contador {difficulty.title()} {variant + 1}",
                    "description": f"Conteo con {theme['elements'][variant % len(theme['elements'])]} del {theme['name'].lower()}",
                    "theme": theme_key,
                    "subject": "MAT",
                    "recommended_grades": ["1B", "2B", "3B"],
                    "bloom_level": ["Recordar", "Comprender"][difficulty != "easy"],
                    "difficulty": difficulty,
                    "visual_config": {
                        "primary_color": theme["colors"][0],
                        "secondary_color": theme["colors"][1],
                        "accent_color": theme["colors"][2],
                        "background_style": "gradient" if variant % 2 == 0 else "pattern",
                        "animation_style": "bounce" if theme_key == "animales" else "slide",
                        "element_style": theme["elements"][variant % len(theme["elements"])],
                        "ui_complexity": "simple" if difficulty == "easy" else "detailed"
                    },
                    "gameplay_config": {
                        "max_count": 10 if difficulty == "easy" else (50 if difficulty == "medium" else 100),
                        "counting_style": "visual_objects",
                        "feedback_type": "immediate_positive",
                        "sound_effects": True,
                        "voice_narration": True,
                        "hint_system": difficulty != "hard"
                    },
                    "learning_objectives": ["MA01OA01", "MA01OA02", "MA02OA01"],
                    "appeal_rating": theme["appeal"],
                    "estimated_dev_time": "3 days",
                    "assets_needed": {
                        "sprites": 15,
                        "sounds": 8,
                        "animations": 6,
                        "backgrounds": 3
                    }
                }
                
                math_skins.append(skin)
                if len(math_skins) >= 15:
                    break
            if len(math_skins) >= 15:
                break
        if len(math_skins) >= 15:
            break
    
    # ENG02-DRAG_DROP_NUM: 15 skins
    dragdrop_themes = ["deportes", "fantasia", "vehiculos"]
    for i, theme_key in enumerate(dragdrop_themes):
        theme = themes[theme_key]
        for difficulty in ["easy", "medium", "hard"]:
            for variant in range(5):
                if len(math_skins) >= 30:
                    break
                    
                skin_id = f"SKIN_MAT_{str(len(math_skins) + 1).zfill(3)}"
                
                skin = {
                    "skin_id": skin_id,
                    "engine_id": "ENG02",
                    "engine_code": "DRAG_DROP_NUM",
                    "name": f"{theme['name']} - Arrastrar {difficulty.title()} {variant + 1}",
                    "description": f"Arrastrar y soltar {theme['elements'][variant % len(theme['elements'])]} ordenadamente",
                    "theme": theme_key,
                    "subject": "MAT",
                    "recommended_grades": ["1B", "2B", "3B", "4B"],
                    "bloom_level": ["Comprender", "Aplicar"][difficulty == "hard"],
                    "difficulty": difficulty,
                    "visual_config": {
                        "primary_color": theme["colors"][0],
                        "secondary_color": theme["colors"][1],
                        "accent_color": theme["colors"][2],
                        "background_style": "illustrated",
                        "animation_style": "smooth_drag",
                        "element_style": theme["elements"][variant % len(theme["elements"])],
                        "drop_zone_style": "highlighted_areas"
                    },
                    "gameplay_config": {
                        "max_items": 4 if difficulty == "easy" else (8 if difficulty == "medium" else 12),
                        "drag_sensitivity": "child_friendly",
                        "snap_assistance": difficulty != "hard",
                        "operation_types": ["sort", "group", "match"],
                        "feedback_type": "visual_audio_combined",
                        "celebration_animation": True
                    },
                    "learning_objectives": ["MA01OA04", "MA01OA09", "MA02OA04"],
                    "appeal_rating": theme["appeal"],
                    "estimated_dev_time": "4 days",
                    "assets_needed": {
                        "sprites": 20,
                        "sounds": 10,
                        "animations": 8,
                        "backgrounds": 2
                    }
                }
                
                math_skins.append(skin)
            if len(math_skins) >= 30:
                break
        if len(math_skins) >= 30:
            break
    
    # Rellenar hasta 45 con variaciones de engines híbridos
    remaining_themes = ["cocina", "piratas", "circo"]
    hybrid_engines = ["ENG01", "ENG02"] * 8  # Alternar engines
    
    for i in range(15):  # 45 - 30 = 15 skins adicionales
        theme_key = remaining_themes[i % len(remaining_themes)]
        theme = themes[theme_key]
        engine_id = hybrid_engines[i % len(hybrid_engines)]
        engine_code = "COUNTER" if engine_id == "ENG01" else "DRAG_DROP_NUM"
        
        skin_id = f"SKIN_MAT_{str(len(math_skins) + 1).zfill(3)}"
        
        skin = {
            "skin_id": skin_id,
            "engine_id": engine_id,
            "engine_code": engine_code,
            "name": f"{theme['name']} - Especial {i + 1}",
            "description": f"Skin especial de {theme['name'].lower()} con elementos únicos",
            "theme": theme_key,
            "subject": "MAT",
            "recommended_grades": ["1B", "2B", "3B"],
            "bloom_level": "Aplicar",
            "difficulty": "medium",
            "visual_config": {
                "primary_color": theme["colors"][0],
                "secondary_color": theme["colors"][1],
                "accent_color": theme["colors"][2],
                "background_style": "immersive",
                "animation_style": "theme_specific",
                "element_style": theme["elements"][i % len(theme["elements"])],
                "special_effects": True
            },
            "gameplay_config": {
                "hybrid_mechanics": True,
                "difficulty_adaptive": True,
                "reward_system": "advanced",
                "social_features": True,
                "progression_tracking": True
            },
            "learning_objectives": ["MA01OA01", "MA01OA04", "MA02OA01"],
            "appeal_rating": "high",
            "estimated_dev_time": "5 days",
            "assets_needed": {
                "sprites": 25,
                "sounds": 12,
                "animations": 10,
                "backgrounds": 4
            }
        }
        
        math_skins.append(skin)
    
    return math_skins

def create_language_skins():
    """Crea las 45 skins para lenguaje"""
    
    # Temáticas base para lenguaje
    themes = {
        "cuentos": {
            "name": "Mundo de Cuentos",
            "colors": ["#FF6B9D", "#C44569", "#F8B500"],
            "elements": ["princesas", "dragones", "castillos", "bosques", "hadas"],
            "appeal": "high"
        },
        "biblioteca": {
            "name": "Gran Biblioteca",
            "colors": ["#8B4513", "#DAA520", "#2E8B57"],
            "elements": ["libros", "estantes", "lámparas", "sillones", "mapas"],
            "appeal": "medium"
        },
        "aventura": {
            "name": "Aventura Literaria",
            "colors": ["#FF6347", "#32CD32", "#4169E1"],
            "elements": ["exploradores", "brújulas", "mapas", "tesoros", "cavernas"],
            "appeal": "high"
        },
        "musicales": {
            "name": "Letras Musicales",
            "colors": ["#9370DB", "#FF69B4", "#FFD700"],
            "elements": ["notas", "instrumentos", "partituras", "micrófonos", "escenarios"],
            "appeal": "high"
        },
        "detectives": {
            "name": "Detective de Palabras",
            "colors": ["#2F4F4F", "#B8860B", "#DC143C"],
            "elements": ["lupas", "pistas", "huellas", "sombreros", "documentos"],
            "appeal": "high"
        },
        "jardin": {
            "name": "Jardín de Letras",
            "colors": ["#228B22", "#FFB6C1", "#87CEEB"],
            "elements": ["flores", "mariposas", "árboles", "regaderas", "semillas"],
            "appeal": "medium"
        },
        "cocina_letras": {
            "name": "Cocina de Palabras",
            "colors": ["#FF4500", "#FFFF00", "#32CD32"],
            "elements": ["recetas", "ingredientes", "ollas", "cucharas", "hornos"],
            "appeal": "medium"
        },
        "laboratorio": {
            "name": "Laboratorio Lingüístico",
            "colors": ["#4169E1", "#32CD32", "#FF6347"],
            "elements": ["tubos", "fórmulas", "microscopios", "experimentos", "cristales"],
            "appeal": "medium"
        },
        "teatro": {
            "name": "Gran Teatro",
            "colors": ["#8B0000", "#FFD700", "#4B0082"],
            "elements": ["escenarios", "telones", "máscaras", "vestuarios", "luces"],
            "appeal": "high"
        }
    }
    
    language_skins = []
    
    # ENG05-TEXT_RECOG: 15 skins
    textrecog_themes = ["cuentos", "biblioteca", "aventura"]
    for i, theme_key in enumerate(textrecog_themes):
        theme = themes[theme_key]
        for difficulty in ["easy", "medium", "hard"]:
            for variant in range(5):
                skin_id = f"SKIN_LEN_{str(len(language_skins) + 1).zfill(3)}"
                
                skin = {
                    "skin_id": skin_id,
                    "engine_id": "ENG05",
                    "engine_code": "TEXT_RECOG",
                    "name": f"{theme['name']} - Reconocer {difficulty.title()} {variant + 1}",
                    "description": f"Reconocimiento de letras y palabras en el {theme['name'].lower()}",
                    "theme": theme_key,
                    "subject": "LEN",
                    "recommended_grades": ["1B", "2B", "3B"],
                    "bloom_level": ["Recordar", "Comprender"][difficulty != "easy"],
                    "difficulty": difficulty,
                    "visual_config": {
                        "primary_color": theme["colors"][0],
                        "secondary_color": theme["colors"][1],
                        "accent_color": theme["colors"][2],
                        "background_style": "storybook",
                        "animation_style": "gentle_fade",
                        "element_style": theme["elements"][variant % len(theme["elements"])],
                        "typography": "child_friendly",
                        "font_scaling": True
                    },
                    "gameplay_config": {
                        "text_complexity": "letters" if difficulty == "easy" else ("words" if difficulty == "medium" else "sentences"),
                        "recognition_type": "visual_matching",
                        "hint_system": "progressive",
                        "audio_support": True,
                        "dyslexia_friendly": True,
                        "feedback_type": "encouraging"
                    },
                    "learning_objectives": ["LE01OA01", "LE01OA02", "LE02OA03"],
                    "appeal_rating": theme["appeal"],
                    "estimated_dev_time": "4 days",
                    "assets_needed": {
                        "sprites": 18,
                        "sounds": 15,
                        "animations": 8,
                        "fonts": 3,
                        "backgrounds": 3
                    }
                }
                
                language_skins.append(skin)
                if len(language_skins) >= 15:
                    break
            if len(language_skins) >= 15:
                break
        if len(language_skins) >= 15:
            break
    
    # ENG06-LETTER_SOUND: 15 skins
    lettersound_themes = ["musicales", "detectives", "jardin"]
    for i, theme_key in enumerate(lettersound_themes):
        theme = themes[theme_key]
        for difficulty in ["easy", "medium", "hard"]:
            for variant in range(5):
                if len(language_skins) >= 30:
                    break
                    
                skin_id = f"SKIN_LEN_{str(len(language_skins) + 1).zfill(3)}"
                
                skin = {
                    "skin_id": skin_id,
                    "engine_id": "ENG06",
                    "engine_code": "LETTER_SOUND",
                    "name": f"{theme['name']} - Sonidos {difficulty.title()} {variant + 1}",
                    "description": f"Asociación letra-sonido en el contexto de {theme['name'].lower()}",
                    "theme": theme_key,
                    "subject": "LEN",
                    "recommended_grades": ["1B", "2B"],
                    "bloom_level": ["Recordar", "Comprender", "Aplicar"][min(difficulty == "hard", 2)],
                    "difficulty": difficulty,
                    "visual_config": {
                        "primary_color": theme["colors"][0],
                        "secondary_color": theme["colors"][1],
                        "accent_color": theme["colors"][2],
                        "background_style": "interactive",
                        "animation_style": "sound_waves",
                        "element_style": theme["elements"][variant % len(theme["elements"])],
                        "phonetic_visualization": True
                    },
                    "gameplay_config": {
                        "phoneme_complexity": "vowels" if difficulty == "easy" else ("consonants" if difficulty == "medium" else "combinations"),
                        "audio_quality": "crystal_clear",
                        "voice_variety": True,
                        "recording_capability": True,
                        "pronunciation_feedback": "real_time",
                        "hearing_impaired_support": True
                    },
                    "learning_objectives": ["LE01OA03", "LE01OA04", "LE02OA04"],
                    "appeal_rating": theme["appeal"],
                    "estimated_dev_time": "5 days",
                    "assets_needed": {
                        "sprites": 20,
                        "sounds": 25,
                        "animations": 12,
                        "voice_clips": 50,
                        "backgrounds": 2
                    }
                }
                
                language_skins.append(skin)
            if len(language_skins) >= 30:
                break
        if len(language_skins) >= 30:
            break
    
    # ENG07-READING_FLUENCY: 15 skins adicionales
    fluency_themes = ["cocina_letras", "laboratorio", "teatro"]
    for i in range(15):
        theme_key = fluency_themes[i % len(fluency_themes)]
        theme = themes[theme_key]
        
        skin_id = f"SKIN_LEN_{str(len(language_skins) + 1).zfill(3)}"
        
        difficulty_cycle = ["easy", "medium", "hard"][i % 3]
        
        skin = {
            "skin_id": skin_id,
            "engine_id": "ENG07",
            "engine_code": "READING_FLUENCY",
            "name": f"{theme['name']} - Fluidez {difficulty_cycle.title()} {(i // 3) + 1}",
            "description": f"Desarrollo de fluidez lectora en el ambiente de {theme['name'].lower()}",
            "theme": theme_key,
            "subject": "LEN",
            "recommended_grades": ["2B", "3B", "4B"],
            "bloom_level": ["Comprender", "Aplicar"][difficulty_cycle != "easy"],
            "difficulty": difficulty_cycle,
            "visual_config": {
                "primary_color": theme["colors"][0],
                "secondary_color": theme["colors"][1],
                "accent_color": theme["colors"][2],
                "background_style": "immersive_environment",
                "animation_style": "text_highlighting",
                "element_style": theme["elements"][i % len(theme["elements"])],
                "reading_aids": True
            },
            "gameplay_config": {
                "text_length": "sentences" if difficulty_cycle == "easy" else ("paragraphs" if difficulty_cycle == "medium" else "stories"),
                "wpm_target": 30 if difficulty_cycle == "easy" else (60 if difficulty_cycle == "medium" else 90),
                "comprehension_checks": True,
                "adaptive_difficulty": True,
                "progress_visualization": "detailed",
                "social_reading": True
            },
            "learning_objectives": ["LE02OA05", "LE03OA01", "LE04OA01"],
            "appeal_rating": theme["appeal"],
            "estimated_dev_time": "6 days",
            "assets_needed": {
                "sprites": 22,
                "sounds": 18,
                "animations": 15,
                "text_content": 100,
                "backgrounds": 4
            }
        }
        
        language_skins.append(skin)
    
    return language_skins

def generate_skins_database_sql(math_skins, language_skins):
    """Genera SQL para insertar todas las skins en Supabase"""
    
    all_skins = math_skins + language_skins
    
    sql = f"""-- ===============================================
-- CATÁLOGO: 90 SKINS COMPLETOS MAT + LEN
-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- Total: {len(math_skins)} MAT + {len(language_skins)} LEN = {len(all_skins)} skins
-- ===============================================

-- Crear tabla de skins si no existe
CREATE TABLE IF NOT EXISTS game_skin (
    skin_id varchar(20) PRIMARY KEY,
    engine_id varchar(10) REFERENCES game_engine(engine_id),
    engine_code varchar(50) NOT NULL,
    name varchar(150) NOT NULL,
    description text,
    theme varchar(50) NOT NULL,
    subject varchar(10) NOT NULL,
    recommended_grades text[], -- Array de grados
    bloom_level varchar(20) NOT NULL,
    difficulty varchar(20) DEFAULT 'medium',
    visual_config jsonb, -- Configuración visual
    gameplay_config jsonb, -- Configuración de juego
    learning_objectives text[], -- Array de códigos OA
    appeal_rating varchar(20) DEFAULT 'medium',
    estimated_dev_time varchar(20) DEFAULT '3 days',
    assets_needed jsonb, -- Assets requeridos
    status varchar(20) DEFAULT 'design',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    version varchar(10) DEFAULT '1.0'
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_game_skin_engine ON game_skin(engine_id);
CREATE INDEX IF NOT EXISTS idx_game_skin_subject ON game_skin(subject);
CREATE INDEX IF NOT EXISTS idx_game_skin_theme ON game_skin(theme);
CREATE INDEX IF NOT EXISTS idx_game_skin_difficulty ON game_skin(difficulty);
CREATE INDEX IF NOT EXISTS idx_game_skin_grades ON game_skin USING GIN (recommended_grades);
CREATE INDEX IF NOT EXISTS idx_game_skin_appeal ON game_skin(appeal_rating);

-- Insertar 90 skins completos

"""
    
    for skin in all_skins:
        sql += f"""
INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    '{skin['skin_id']}',
    '{skin['engine_id']}',
    '{skin['engine_code']}',
    {repr(skin['name'])},
    {repr(skin['description'])},
    '{skin['theme']}',
    '{skin['subject']}',
    ARRAY{skin['recommended_grades']},
    '{skin['bloom_level']}',
    '{skin['difficulty']}',
    '{json.dumps(skin['visual_config'], ensure_ascii=False)}'::jsonb,
    '{json.dumps(skin['gameplay_config'], ensure_ascii=False)}'::jsonb,
    ARRAY{skin['learning_objectives']},
    '{skin['appeal_rating']}',
    '{skin['estimated_dev_time']}',
    '{json.dumps(skin['assets_needed'], ensure_ascii=False)}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();

"""
    
    sql += f"""
-- Estadísticas y verificaciones
SELECT 
    '🎨 SKINS CREADOS' as status,
    COUNT(*) as total_skins
FROM game_skin 
WHERE status = 'ready_for_design';

SELECT 
    'Distribución por asignatura' as metric,
    subject,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY subject
ORDER BY skin_count DESC;

SELECT 
    'Distribución por engine' as metric,
    engine_code,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY engine_code
ORDER BY skin_count DESC;

SELECT 
    'Distribución por temática' as metric,
    theme,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY theme
ORDER BY skin_count DESC;

SELECT 
    'Distribución por dificultad' as metric,
    difficulty,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'easy' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'hard' THEN 3
    END;

SELECT 
    'Distribución por appeal' as metric,
    appeal_rating,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY appeal_rating
ORDER BY 
    CASE appeal_rating 
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
    END;

-- Estimación de desarrollo
SELECT 
    'Tiempo total estimado' as metric,
    SUM(
        CASE estimated_dev_time
            WHEN '3 days' THEN 3
            WHEN '4 days' THEN 4
            WHEN '5 days' THEN 5
            WHEN '6 days' THEN 6
            ELSE 4
        END
    ) as total_days,
    ROUND(
        SUM(
            CASE estimated_dev_time
                WHEN '3 days' THEN 3
                WHEN '4 days' THEN 4
                WHEN '5 days' THEN 5
                WHEN '6 days' THEN 6
                ELSE 4
            END
        ) / 22.0, 1
    ) as total_months_1_designer,
    ROUND(
        SUM(
            CASE estimated_dev_time
                WHEN '3 days' THEN 3
                WHEN '4 days' THEN 4
                WHEN '5 days' THEN 5
                WHEN '6 days' THEN 6
                ELSE 4
            END
        ) / 66.0, 1
    ) as total_months_3_designers
FROM game_skin 
WHERE status = 'ready_for_design';

-- Assets totales requeridos
SELECT 
    'Assets totales' as metric,
    SUM((assets_needed->>'sprites')::int) as total_sprites,
    SUM((assets_needed->>'sounds')::int) as total_sounds,
    SUM((assets_needed->>'animations')::int) as total_animations,
    COALESCE(SUM((assets_needed->>'backgrounds')::int), 0) as total_backgrounds
FROM game_skin 
WHERE status = 'ready_for_design';

-- Resumen ejecutivo final
SELECT 
    '🎯 CATÁLOGO COMPLETO' as status,
    COUNT(*) as total_skins,
    COUNT(DISTINCT engine_id) as engines_covered,
    COUNT(DISTINCT theme) as themes_available,
    COUNT(DISTINCT subject) as subjects_covered
FROM game_skin 
WHERE status = 'ready_for_design';
"""
    
    return sql

def main():
    """Función principal para crear el catálogo de 90 skins"""
    
    print("🎨 === CREACIÓN: 90 SKINS COMPLETOS MAT + LEN ===")
    print("=" * 80)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. CREAR SKINS MATEMÁTICA
    print("📐 Creando 45 skins para MATEMÁTICA...")
    math_skins = create_math_skins()
    print(f"✅ {len(math_skins)} skins MAT creados")
    
    # Distribución MAT por engine
    math_by_engine = {}
    for skin in math_skins:
        engine = skin['engine_code']
        math_by_engine[engine] = math_by_engine.get(engine, 0) + 1
    
    print("   Distribución por engine:")
    for engine, count in math_by_engine.items():
        print(f"     {engine}: {count} skins")
    print()
    
    # 2. CREAR SKINS LENGUAJE
    print("📖 Creando 45 skins para LENGUAJE...")
    language_skins = create_language_skins()
    print(f"✅ {len(language_skins)} skins LEN creados")
    
    # Distribución LEN por engine
    len_by_engine = {}
    for skin in language_skins:
        engine = skin['engine_code']
        len_by_engine[engine] = len_by_engine.get(engine, 0) + 1
    
    print("   Distribución por engine:")
    for engine, count in len_by_engine.items():
        print(f"     {engine}: {count} skins")
    print()
    
    # 3. GENERAR ARCHIVOS
    print("📝 Generando archivos de salida...")
    
    # SQL para Supabase
    sql_content = generate_skins_database_sql(math_skins, language_skins)
    sql_file = "skins_90_completos_supabase.sql"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"✅ SQL guardado: {sql_file}")
    
    # JSON completo
    all_skins = {
        "metadata": {
            "total_skins": len(math_skins) + len(language_skins),
            "math_skins": len(math_skins),
            "language_skins": len(language_skins),
            "created_at": datetime.now().isoformat(),
            "version": "1.0"
        },
        "math_skins": math_skins,
        "language_skins": language_skins
    }
    
    json_file = "skins_90_completos_catalogo.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(all_skins, f, indent=2, ensure_ascii=False)
    print(f"✅ Catálogo guardado: {json_file}")
    print()
    
    # 4. ESTADÍSTICAS DETALLADAS
    print("📊 === ESTADÍSTICAS COMPLETAS ===")
    print()
    
    total_skins = len(math_skins) + len(language_skins)
    
    # Por dificultad
    print("🎯 DISTRIBUCIÓN POR DIFICULTAD:")
    all_skins_list = math_skins + language_skins
    difficulty_counts = {}
    for skin in all_skins_list:
        diff = skin['difficulty']
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
    
    for diff, count in sorted(difficulty_counts.items()):
        percentage = (count / total_skins) * 100
        print(f"   {diff.title()}: {count:2d} skins ({percentage:5.1f}%)")
    print()
    
    # Por temática
    print("🎨 DISTRIBUCIÓN POR TEMÁTICA:")
    theme_counts = {}
    for skin in all_skins_list:
        theme = skin['theme']
        theme_counts[theme] = theme_counts.get(theme, 0) + 1
    
    for theme, count in sorted(theme_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_skins) * 100
        print(f"   {theme.title()}: {count:2d} skins ({percentage:5.1f}%)")
    print()
    
    # Por appeal
    print("💖 DISTRIBUCIÓN POR APPEAL:")
    appeal_counts = {}
    for skin in all_skins_list:
        appeal = skin['appeal_rating']
        appeal_counts[appeal] = appeal_counts.get(appeal, 0) + 1
    
    for appeal, count in sorted(appeal_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_skins) * 100
        print(f"   {appeal.title()}: {count:2d} skins ({percentage:5.1f}%)")
    print()
    
    # Estimación de desarrollo
    print("⏱️ ESTIMACIÓN DE DESARROLLO:")
    total_days = 0
    for skin in all_skins_list:
        dev_time = skin['estimated_dev_time']
        days = int(dev_time.split()[0])
        total_days += days
    
    total_months_1 = total_days / 22  # días hábiles por mes
    total_months_3 = total_days / 66  # 3 diseñadores
    
    print(f"   Total días estimados: {total_days}")
    print(f"   Con 1 diseñador: {total_months_1:.1f} meses")
    print(f"   Con 3 diseñadores: {total_months_3:.1f} meses")
    print()
    
    # Assets totales
    print("🎭 ASSETS TOTALES REQUERIDOS:")
    total_sprites = sum(skin['assets_needed']['sprites'] for skin in all_skins_list)
    total_sounds = sum(skin['assets_needed']['sounds'] for skin in all_skins_list)
    total_animations = sum(skin['assets_needed']['animations'] for skin in all_skins_list)
    total_backgrounds = sum(skin['assets_needed'].get('backgrounds', 0) for skin in all_skins_list)
    
    print(f"   Sprites: {total_sprites}")
    print(f"   Sonidos: {total_sounds}")
    print(f"   Animaciones: {total_animations}")
    print(f"   Fondos: {total_backgrounds}")
    print()
    
    # 5. PRÓXIMOS PASOS
    print("🚀 === PRÓXIMOS PASOS ===")
    print()
    print(f"1. 📤 Ejecutar {sql_file} en Supabase")
    print("2. 🎨 Asignar skins a equipo de diseño (3 diseñadores)")
    print("3. 🏭 Crear pipeline de producción de assets")
    print("4. ✨ Desarrollar skins high-appeal primero")
    print("5. 🧪 Testing piloto con 3 colegios")
    print("6. 📈 Refinamiento basado en feedback")
    print()
    
    print("📋 PRIORIZACIÓN RECOMENDADA:")
    print("   Fase 1: Skins high-appeal + easy/medium (60 skins)")
    print("   Fase 2: Skins medium-appeal + hard (30 skins)")
    print("   Fase 3: Optimización y variaciones adicionales")
    print()
    
    print("=" * 80)
    print("🎉 ¡CATÁLOGO DE 90 SKINS COMPLETADO!")
    print(f"🎨 {len(math_skins)} skins MAT + {len(language_skins)} skins LEN")
    print(f"⚡ {len(set(skin['engine_id'] for skin in all_skins_list))} engines cubiertos")
    print(f"🎭 {len(set(skin['theme'] for skin in all_skins_list))} temáticas únicas")
    print(f"⏱️ {total_months_3:.1f} meses con equipo de 3 diseñadores")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Catálogo de 90 skins completado. Listo para producción.")
    else:
        print("\n❌ Error en creación de skins. Revisar logs.") 