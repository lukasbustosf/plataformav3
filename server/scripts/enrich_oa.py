#!/usr/bin/env python3
"""
Script de enriquecimiento OA con Bloom y Cognitive Skills
Implementa el pipeline especificado en MODULO II - Planificación EDU21

Uso:
    python enrich_oa.py --input oa_raw.csv --output oa_enriched.csv
"""

import pandas as pd
import argparse
import logging
import re
import sys
from datetime import datetime
from pathlib import Path

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class OAEnricher:
    def __init__(self):
        self.verb_bloom_map = {}
        self.cognitive_skills_map = {}
        self.subject_mapping = {
            'MAT': 'Matemática',
            'LEN': 'Lenguaje y Comunicación', 
            'CN': 'Ciencias Naturales',
            'HIS': 'Historia, Geografía y Cs. Sociales',
            'ING': 'Inglés',
            'EDF': 'Educación Física y Salud',
            'ART': 'Artes Visuales',
            'MUS': 'Música',
            'TEC': 'Tecnología',
            'REL': 'Religión'
        }
        
    def load_reference_data(self):
        """
        Carga los archivos de referencia para mapeo Bloom y cognitive skills
        """
        logger.info("Cargando datos de referencia...")
        
        # Buscar archivos CSV en el directorio actual y subdirectorios
        current_dir = Path(__file__).parent
        datasets_dir = current_dir / '../datasets'
        
        try:
            # Cargar verb_bloom.csv
            verb_bloom_file = None
            for path in [datasets_dir / 'verb_bloom.csv', current_dir / 'verb_bloom.csv']:
                if path.exists():
                    verb_bloom_file = path
                    break
            
            if verb_bloom_file:
                verb_df = pd.read_csv(verb_bloom_file)
                self.verb_bloom_map = dict(zip(
                    verb_df['verbo'].str.lower(),
                    verb_df['bloom_level']
                ))
                logger.info(f"Cargados {len(self.verb_bloom_map)} verbos → Bloom")
            else:
                logger.warning("No se encontró verb_bloom.csv, usando mapeo por defecto")
                self._load_default_verb_bloom()
            
            # Cargar cognitive_skills.csv
            skills_file = None
            for path in [datasets_dir / 'cognitive_skills.csv', current_dir / 'cognitive_skills.csv']:
                if path.exists():
                    skills_file = path
                    break
            
            if skills_file:
                skills_df = pd.read_csv(skills_file)
                for _, row in skills_df.iterrows():
                    keywords = row['keywords'].strip('"').split(',')
                    subjects = row['subject_affinity'].split(';') if pd.notna(row['subject_affinity']) else []
                    
                    self.cognitive_skills_map[row['skill_code']] = {
                        'name': row['skill_name'],
                        'keywords': [k.strip() for k in keywords],
                        'subjects': subjects,
                        'description': row['description']
                    }
                logger.info(f"Cargadas {len(self.cognitive_skills_map)} habilidades cognitivas")
            else:
                logger.warning("No se encontró cognitive_skills.csv, usando mapeo por defecto")
                self._load_default_cognitive_skills()
                
        except Exception as e:
            logger.error(f"Error cargando datos de referencia: {e}")
            logger.info("Usando mapeos por defecto...")
            self._load_default_verb_bloom()
            self._load_default_cognitive_skills()
    
    def _load_default_verb_bloom(self):
        """Mapeo por defecto de verbos a Bloom"""
        self.verb_bloom_map = {
            'recordar': 'Recordar', 'identificar': 'Recordar', 'nombrar': 'Recordar',
            'listar': 'Recordar', 'reconocer': 'Recordar', 'mencionar': 'Recordar',
            'describir': 'Comprender', 'explicar': 'Comprender', 'interpretar': 'Comprender',
            'resumir': 'Comprender', 'clasificar': 'Comprender', 'comparar': 'Comprender',
            'aplicar': 'Aplicar', 'usar': 'Aplicar', 'utilizar': 'Aplicar',
            'ejecutar': 'Aplicar', 'calcular': 'Aplicar', 'resolver': 'Aplicar',
            'analizar': 'Analizar', 'examinar': 'Analizar', 'diferenciar': 'Analizar',
            'organizar': 'Analizar', 'estructurar': 'Analizar', 'integrar': 'Analizar',
            'evaluar': 'Evaluar', 'criticar': 'Evaluar', 'juzgar': 'Evaluar',
            'verificar': 'Evaluar', 'validar': 'Evaluar', 'argumentar': 'Evaluar',
            'crear': 'Crear', 'generar': 'Crear', 'planificar': 'Crear',
            'producir': 'Crear', 'diseñar': 'Crear', 'elaborar': 'Crear'
        }
        
    def _load_default_cognitive_skills(self):
        """Habilidades cognitivas por defecto"""
        self.cognitive_skills_map = {
            'memoria_trabajo': {
                'name': 'Memoria de Trabajo',
                'keywords': ['retener', 'mantener', 'recordar'],
                'subjects': ['MAT', 'LEN']
            },
            'razonamiento_logico': {
                'name': 'Razonamiento Lógico', 
                'keywords': ['inferir', 'deducir', 'concluir', 'razonar'],
                'subjects': ['MAT', 'CN']
            },
            'comp_verbal': {
                'name': 'Comprensión Verbal',
                'keywords': ['comprender', 'interpretar', 'entender', 'leer'],
                'subjects': ['LEN', 'HIS']
            }
        }
    
    def extract_bloom_level(self, oa_desc):
        """
        Extrae el nivel Bloom basado en verbos clave en la descripción
        """
        if not oa_desc:
            return 'Comprender'  # Default
            
        # Convertir a minúsculas y extraer verbos
        desc_lower = oa_desc.lower()
        
        # Buscar verbos al inicio de la descripción (más peso)
        words = desc_lower.split()[:10]  # Primeras 10 palabras
        
        bloom_scores = {
            'Recordar': 0, 'Comprender': 0, 'Aplicar': 0,
            'Analizar': 0, 'Evaluar': 0, 'Crear': 0
        }
        
        for word in words:
            # Limpiar signos de puntuación
            clean_word = re.sub(r'[^\w]', '', word)
            
            if clean_word in self.verb_bloom_map:
                bloom_level = self.verb_bloom_map[clean_word]
                weight = 3 if words.index(word) < 3 else 1  # Más peso a primeras palabras
                bloom_scores[bloom_level] += weight
        
        # Retornar el nivel con mayor puntaje
        max_level = max(bloom_scores, key=bloom_scores.get)
        
        # Si no hay match, usar heurística
        if bloom_scores[max_level] == 0:
            if any(w in desc_lower for w in ['crear', 'diseñar', 'elaborar', 'construir']):
                return 'Crear'
            elif any(w in desc_lower for w in ['evaluar', 'juzgar', 'criticar', 'argumentar']):
                return 'Evaluar'
            elif any(w in desc_lower for w in ['analizar', 'examinar', 'comparar']):
                return 'Analizar'
            elif any(w in desc_lower for w in ['aplicar', 'usar', 'resolver', 'calcular']):
                return 'Aplicar'
            elif any(w in desc_lower for w in ['explicar', 'interpretar', 'comprender']):
                return 'Comprender'
            else:
                return 'Recordar'
        
        return max_level
    
    def extract_cognitive_skill(self, oa_desc, subject_code):
        """
        Extrae la habilidad cognitiva principal basada en keywords y contexto
        """
        if not oa_desc:
            return 'memoria_trabajo'  # Default
            
        desc_lower = oa_desc.lower()
        skill_scores = {}
        
        for skill_code, skill_data in self.cognitive_skills_map.items():
            score = 0
            
            # Puntuación por keywords
            for keyword in skill_data['keywords']:
                if keyword.lower() in desc_lower:
                    score += 2
            
            # Bonificación por afinidad de asignatura
            if subject_code in skill_data.get('subjects', []):
                score += 1
            
            skill_scores[skill_code] = score
        
        # Retornar la habilidad con mayor puntaje
        if skill_scores:
            best_skill = max(skill_scores, key=skill_scores.get)
            if skill_scores[best_skill] > 0:
                return best_skill
        
        # Heurística por asignatura si no hay match
        subject_skill_map = {
            'MAT': 'razonamiento_logico',
            'LEN': 'comp_verbal', 
            'CN': 'razonamiento_logico',
            'HIS': 'comp_verbal',
            'ING': 'comp_verbal',
            'EDF': 'coord_motora',
            'ART': 'creatividad'
        }
        
        return subject_skill_map.get(subject_code, 'memoria_trabajo')
    
    def determine_oa_version(self, oa_desc):
        """
        Determina la versión del OA (2023 default, 2026 si es nueva)
        """
        # Por ahora, todo es 2023. En el futuro se puede detectar
        # contenido nuevo comparando con base existente
        return '2023'
        
    def estimate_complexity_level(self, bloom_level, oa_desc):
        """
        Estima el nivel de complejidad (1-5) basado en Bloom y contenido
        """
        bloom_complexity = {
            'Recordar': 1,
            'Comprender': 2, 
            'Aplicar': 3,
            'Analizar': 4,
            'Evaluar': 5,
            'Crear': 5
        }
        
        base_complexity = bloom_complexity.get(bloom_level, 3)
        
        # Ajustar por contenido
        if oa_desc:
            desc_lower = oa_desc.lower()
            
            # Palabras que indican mayor complejidad
            complex_words = ['múltiple', 'diversos', 'variados', 'complejos', 
                           'diferentes', 'simultáneo', 'integrar', 'síntesis']
            
            # Palabras que indican menor complejidad  
            simple_words = ['simple', 'básico', 'elemental', 'inicial', 'fácil']
            
            complexity_adjust = 0
            for word in complex_words:
                if word in desc_lower:
                    complexity_adjust += 0.5
                    
            for word in simple_words:
                if word in desc_lower:
                    complexity_adjust -= 0.5
        
            base_complexity += complexity_adjust
        
        # Mantener en rango 1-5
        return max(1, min(5, round(base_complexity)))
    
    def enrich_oa_data(self, input_file, output_file):
        """
        Procesa el archivo OA raw y genera el archivo enriquecido
        """
        logger.info(f"Procesando {input_file}...")
        
        try:
            # Cargar datos raw
            df = pd.read_csv(input_file)
            logger.info(f"Cargados {len(df)} OA para enriquecer")
            
            # Verificar columnas requeridas
            required_cols = ['oa_code', 'oa_desc', 'grade', 'subject']
            missing_cols = [col for col in required_cols if col not in df.columns]
            if missing_cols:
                raise ValueError(f"Columnas faltantes en CSV: {missing_cols}")
            
            enriched_data = []
            
            for idx, row in df.iterrows():
                try:
                    # Enriquecimiento principal
                    bloom_level = self.extract_bloom_level(row['oa_desc'])
                    cog_skill = self.extract_cognitive_skill(row['oa_desc'], row['subject'])
                    oa_version = self.determine_oa_version(row['oa_desc'])
                    complexity = self.estimate_complexity_level(bloom_level, row['oa_desc'])
                    
                    # Campos adicionales
                    estimated_hours = 4  # Default según spec
                    semester = 1  # Default, se puede mejorar con análisis temporal
                    ministerial_priority = 'normal'  # Default
                    
                    # Detectar prioridad alta por palabras clave
                    if row['oa_desc'] and any(word in row['oa_desc'].lower() 
                                            for word in ['fundamental', 'básico', 'esencial', 'importante']):
                        ministerial_priority = 'high'
                    
                    enriched_oa = {
                        'oa_code': row['oa_code'],
                        'oa_desc': row['oa_desc'],
                        'oa_short_desc': row['oa_desc'][:100] + '...' if len(str(row['oa_desc'])) > 100 else row['oa_desc'],
                        'grade_code': row['grade'],
                        'subject_code': row['subject'], 
                        'bloom_level': bloom_level,
                        'cog_skill': cog_skill,
                        'oa_version': oa_version,
                        'semester': semester,
                        'complexity_level': complexity,
                        'estimated_hours': estimated_hours,
                        'ministerial_priority': ministerial_priority,
                        'is_transversal': False,  # Se puede detectar por keywords
                        'enriched_at': datetime.now().isoformat()
                    }
                    
                    enriched_data.append(enriched_oa)
                    
                    if (idx + 1) % 50 == 0:
                        logger.info(f"Procesados {idx + 1}/{len(df)} OA...")
                        
                except Exception as e:
                    logger.warning(f"Error procesando OA {row.get('oa_code', idx)}: {e}")
                    continue
            
            # Crear DataFrame enriquecido
            enriched_df = pd.DataFrame(enriched_data)
            
            # Estadísticas
            bloom_stats = enriched_df['bloom_level'].value_counts()
            logger.info("Distribución niveles Bloom:")
            for level, count in bloom_stats.items():
                logger.info(f"  {level}: {count}")
                
            # Guardar archivo enriquecido
            enriched_df.to_csv(output_file, index=False, encoding='utf-8')
            logger.info(f"✅ Datos enriquecidos guardados en {output_file}")
            logger.info(f"📊 Total procesados: {len(enriched_data)} OA")
            logger.info("🚀 Listo para carga en Supabase con COPY command")
            
            return True
            
        except Exception as e:
            logger.error(f"Error en enriquecimiento: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Enriquecimiento de OA con Bloom y Cognitive Skills')
    parser.add_argument('--input', default='oa_raw.csv', help='Archivo CSV de entrada')
    parser.add_argument('--output', default='oa_enriched.csv', help='Archivo CSV de salida')
    parser.add_argument('--verbose', '-v', action='store_true', help='Logging detallado')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Verificar archivo de entrada
    if not Path(args.input).exists():
        logger.error(f"❌ Archivo de entrada no encontrado: {args.input}")
        logger.info("💡 Ejecuta primero: python scrape_oa.py --out oa_raw.csv")
        sys.exit(1)
    
    # Inicializar enriquecedor
    enricher = OAEnricher()
    
    try:
        # Cargar datos de referencia
        enricher.load_reference_data()
        
        # Ejecutar enriquecimiento
        success = enricher.enrich_oa_data(args.input, args.output)
        
        if success:
            logger.info("✅ Pipeline de enriquecimiento completado exitosamente")
            logger.info(f"📄 Archivo generado: {args.output}")
            logger.info("🔄 Siguiente paso: COPY a Supabase")
            sys.exit(0)
        else:
            logger.error("❌ Error en el pipeline de enriquecimiento")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("⏹️  Enriquecimiento interrumpido por el usuario")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Error inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 