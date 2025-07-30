#!/usr/bin/env python3
"""
Script de scraping OA MINEDUC → CSV
Implementa el pipeline especificado en MODULO II - Planificación EDU21
Actualizado para usar la estructura real del portal curriculumnacional.cl

Uso:
    pip install requests beautifulsoup4 pandas psycopg[binary]
    python scrape_oa.py --year 2023 --out oa_raw.csv --max-oa 100
"""

import requests
import pandas as pd
import argparse
import time
import logging
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime
import re
import sys
import os

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MinEducOAScraper:
    def __init__(self, year="2023", max_oa_limit=100):
        self.year = year
        self.max_oa_limit = max_oa_limit  # Límite para testing
        self.base_url = "https://www.curriculumnacional.cl"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Mapeo de asignaturas basado en URLs reales del sitio
        self.subjects = {
            'MAT': 'matematica',
            'LEN': 'lenguaje-comunicacion',  # Corregido según URL real
            'CN': 'ciencias-naturales', 
            'HIS': 'historia-geografia-ciencias-sociales',
            'ING': 'ingles',  # Inglés para 5°-6° básico
            'ING_PROP': 'ingles-propuesta',  # Inglés (Propuesta) para 1°-4° básico
            'EDF': 'educacion-fisica-salud',
            'ART': 'artes-visuales',
            'MUS': 'musica',
            'TEC': 'tecnologia',
            'ORI': 'orientacion',
            'LPO': 'lengua-cultura-pueblos-originarios-ancestrales'  # Nueva materia
        }
        
        # Parámetros adicionales por asignatura
        self.subject_params = {
            'LEN': '?priorizacion=0',  # Lenguaje requiere parámetro de priorización
            'TEC': '?priorizacion=0',  # Tecnología requiere parámetro
            'ORI': '?priorizacion=0',  # Orientación requiere parámetro
            'MUS': '?priorizacion=0',  # Música requiere parámetro
            'LPO': '?priorizacion=0',  # Lengua Pueblos Originarios requiere parámetro
            'ING': '?priorizacion=0',  # Inglés (5°-6° básico) requiere parámetro
            'ING_PROP': '?priorizacion=0',  # Inglés Propuesta (1°-4° básico) requiere parámetro
            'HIS': '?priorizacion=0',  # Historia requiere parámetro
            'EDF': '?priorizacion=0',  # Educación Física requiere parámetro
            'CN': '?priorizacion=0',   # Ciencias Naturales requiere parámetro
            'ART': '?priorizacion=0',  # Artes Visuales requiere parámetro
            'MAT': '',  # Matemática no requiere parámetros adicionales
        }
        
        # Mapeo de grados a ciclos y nombres de URL
        self.grade_cycles = {
            '1B': ('1o-6o-basico', '1-basico'),
            '2B': ('1o-6o-basico', '2-basico'),
            '3B': ('1o-6o-basico', '3-basico'),
            '4B': ('1o-6o-basico', '4-basico'),
            '5B': ('1o-6o-basico', '5-basico'),
            '6B': ('1o-6o-basico', '6-basico'),
            '7B': ('7o-basico-2o-medio', '7-basico'),
            '8B': ('7o-basico-2o-medio', '8-basico'),
            '1M': ('7o-basico-2o-medio', '1-medio'),
            '2M': ('7o-basico-2o-medio', '2-medio'),
            '3M': ('3o-4o-medio', '3-medio'),
            '4M': ('3o-4o-medio', '4-medio'),
        }
        
        # Patrones de códigos OA por asignatura (actualizados para 1°-6° básico)
        self.oa_patterns = {
            'MAT': [
                r'MA01OA\d+',  # MA01OA01, MA01OA02, etc.
                r'MA02OA\d+',  # MA02OA01, MA02OA02, etc.
                r'MA03OA\d+',  # MA03OA01, MA03OA02, etc.
                r'MA04OA\d+',  # MA04OA01, MA04OA02, etc.
                r'MA05OA\d+',  # MA05OA01, MA05OA02, etc.
                r'MA06OA\d+'   # MA06OA01, MA06OA02, etc.
            ],
            'LEN': [
                r'LE01OA\d+',  # LE01OA01, LE01OA02, etc.
                r'LE02OA\d+',  # LE02OA01, LE02OA02, etc.
                r'LE03OA\d+',  # LE03OA01, LE03OA02, etc.
                r'LE04OA\d+',  # LE04OA01, LE04OA02, etc.
                r'LE05OA\d+',  # LE05OA01, LE05OA02, etc.
                r'LE06OA\d+'   # LE06OA01, LE06OA02, etc.
            ],
            'CN': [
                r'CN01OA\d+',  # CN01OA01, CN01OA02, etc.
                r'CN02OA\d+',  # CN02OA01, CN02OA02, etc.
                r'CN03OA\d+',  # CN03OA01, CN03OA02, etc.
                r'CN04OA\d+',  # CN04OA01, CN04OA02, etc.
                r'CN05OA\d+',  # CN05OA01, CN05OA02, etc.
                r'CN06OA\d+'   # CN06OA01, CN06OA02, etc.
            ],
            'HIS': [
                r'HI01OA\d+',  # HI01OA01, HI01OA02, etc.
                r'HI02OA\d+',  # HI02OA01, HI02OA02, etc.
                r'HI03OA\d+',  # HI03OA01, HI03OA02, etc.
                r'HI04OA\d+',  # HI04OA01, HI04OA02, etc.
                r'HI05OA\d+',  # HI05OA01, HI05OA02, etc.
                r'HI06OA\d+'   # HI06OA01, HI06OA02, etc.
            ],
            'ING': [
                r'IN01OA\d+',  # IN01OA01, IN01OA02, etc.
                r'IN02OA\d+',  # IN02OA01, IN02OA02, etc.
                r'IN03OA\d+',  # IN03OA01, IN03OA02, etc.
                r'IN04OA\d+',  # IN04OA01, IN04OA02, etc.
                r'IN05OA\d+',  # IN05OA01, IN05OA02, etc.
                r'IN06OA\d+'   # IN06OA01, IN06OA02, etc.
            ],
            'ING_PROP': [
                r'EN01OA\d+',  # EN01OA01, EN01OA02, etc. (Inglés Propuesta 1°-4°)
                r'EN02OA\d+',  # EN02OA01, EN02OA02, etc.
                r'EN03OA\d+',  # EN03OA01, EN03OA02, etc.
                r'EN04OA\d+'   # EN04OA01, EN04OA02, etc.
            ],
            'EDF': [
                r'EF01OA\d+',  # EF01OA01, EF01OA02, etc.
                r'EF02OA\d+',  # EF02OA01, EF02OA02, etc.
                r'EF03OA\d+',  # EF03OA01, EF03OA02, etc.
                r'EF04OA\d+',  # EF04OA01, EF04OA02, etc.
                r'EF05OA\d+',  # EF05OA01, EF05OA02, etc.
                r'EF06OA\d+'   # EF06OA01, EF06OA02, etc.
            ],
            'ART': [
                r'AR01OA\d+',  # AR01OA01, AR01OA02, etc.
                r'AR02OA\d+',  # AR02OA01, AR02OA02, etc.
                r'AR03OA\d+',  # AR03OA01, AR03OA02, etc.
                r'AR04OA\d+',  # AR04OA01, AR04OA02, etc.
                r'AR05OA\d+',  # AR05OA01, AR05OA02, etc.
                r'AR06OA\d+'   # AR06OA01, AR06OA02, etc.
            ],
            'MUS': [
                r'MU01OA\d+',  # MU01OA01, MU01OA02, etc.
                r'MU02OA\d+',  # MU02OA01, MU02OA02, etc.
                r'MU03OA\d+',  # MU03OA01, MU03OA02, etc.
                r'MU04OA\d+',  # MU04OA01, MU04OA02, etc.
                r'MU05OA\d+',  # MU05OA01, MU05OA02, etc.
                r'MU06OA\d+'   # MU06OA01, MU06OA02, etc.
            ],
            'TEC': [
                r'TE01OA\d+',  # TE01OA01, TE01OA02, etc.
                r'TE02OA\d+',  # TE02OA01, TE02OA02, etc.
                r'TE03OA\d+',  # TE03OA01, TE03OA02, etc.
                r'TE04OA\d+',  # TE04OA01, TE04OA02, etc.
                r'TE05OA\d+',  # TE05OA01, TE05OA02, etc.
                r'TE06OA\d+'   # TE06OA01, TE06OA02, etc.
            ],
            'ORI': [
                r'OR01OA\d+',  # OR01OA01, OR01OA02, etc.
                r'OR02OA\d+',  # OR02OA01, OR02OA02, etc.
                r'OR03OA\d+',  # OR03OA01, OR03OA02, etc.
                r'OR04OA\d+',  # OR04OA01, OR04OA02, etc.
                r'OR05OA\d+',  # OR05OA01, OR05OA02, etc.
                r'OR06OA\d+'   # OR06OA01, OR06OA02, etc.
            ],
            'LPO': [
                r'LP01OA\d+',  # LP01OA01, LP01OA02, etc.
                r'LP02OA\d+',  # LP02OA01, LP02OA02, etc.
                r'LP03OA\d+',  # LP03OA01, LP03OA02, etc.
                r'LP04OA\d+',  # LP04OA01, LP04OA02, etc.
                r'LP05OA\d+',  # LP05OA01, LP05OA02, etc.
                r'LP06OA\d+'   # LP06OA01, LP06OA02, etc.
            ]
        }
        
        self.oa_data = []
        
    def build_url(self, grade, subject):
        """
        Construye la URL específica para scraping según grado y asignatura
        Basado en la estructura real del sitio curriculumnacional.cl
        """
        cycle_info = self.grade_cycles.get(grade)
        subject_name = self.subjects.get(subject)
        
        if not cycle_info or not subject_name:
            logger.warning(f"Grado {grade} o asignatura {subject} no válidos")
            return None
            
        cycle, grade_name = cycle_info
        
        # URL basada en estructura real: /curriculum/{ciclo}/{asignatura}/{grado}
        url = f"{self.base_url}/curriculum/{cycle}/{subject_name}/{grade_name}"
        
        # Añadir parámetros adicionales si los requiere la asignatura
        extra_params = self.subject_params.get(subject, '')
        if extra_params:
            url += extra_params
            
        logger.info(f"🔗 URL construida para {grade}-{subject}: {url}")
        return url
    
    def find_oa_description(self, item, soup):
        """
        Busca la descripción del OA asociada al elemento encontrado
        """
        description = ""
        
        try:
            # Si el item es un elemento HTML
            if hasattr(item, 'find_next'):
                # Buscar siguiente párrafo
                next_p = item.find_next('p')
                if next_p:
                    description = next_p.get_text(strip=True)
                
                # Si no hay párrafo, buscar siguiente div
                if not description:
                    next_div = item.find_next('div')
                    if next_div:
                        description = next_div.get_text(strip=True)
            
            # Si el item es texto, buscar en el contexto
            else:
                # Buscar el elemento padre que contiene este texto
                parent = soup.find(string=item)
                if parent and hasattr(parent, 'parent'):
                    # Buscar siguiente elemento con texto
                    siblings = parent.parent.find_next_siblings()
                    for sibling in siblings[:3]:  # Revisar hasta 3 elementos siguientes
                        text = sibling.get_text(strip=True)
                        if len(text) > 20:  # Descripción mínima
                            description = text
                            break
            
        except Exception as e:
            logger.debug(f"Error buscando descripción: {e}")
        
        return description
    
    def alternative_extraction_method(self, soup, grade, subject, url):
        """
        Método alternativo de extracción para casos donde el método principal no funciona
        """
        oa_data = []
        
        try:
            # Buscar todos los elementos h4 que podrían contener OA
            h4_elements = soup.find_all('h4')
            
            logger.info(f"🔄 Método alternativo: encontrados {len(h4_elements)} elementos h4")
            
            for i, h4 in enumerate(h4_elements[:self.max_oa_limit]):
                text = h4.get_text(strip=True)
                
                # Buscar patrones de OA en el texto usando patrones dinámicos
                oa_pattern = None
                
                # Usar todos los patrones disponibles
                for subj_code, patterns in self.oa_patterns.items():
                    for pattern in patterns:
                        # Convertir patrón regex a búsqueda con espacios opcionales
                        search_pattern = pattern.replace('OA\\d+', r'\s*OA\s*\d{2}')
                        match = re.search(search_pattern, text, re.IGNORECASE)
                        if match:
                            oa_pattern = match
                            break
                    if oa_pattern:
                        break
                
                if oa_pattern:
                    oa_code = oa_pattern.group(0).replace(' ', '')
                    
                    # Buscar descripción en el siguiente elemento
                    description = self.find_oa_description(h4, soup)
                    
                    if description and len(description) > 20:
                        oa_data.append({
                            'oa_code': oa_code,
                            'oa_desc': description,
                            'grade': grade,
                            'subject': subject,
                            'source_url': url,
                            'scraped_at': datetime.now().isoformat()
                        })
                        
                        logger.info(f"🎯 OA alternativo encontrado: {oa_code}")
                        logger.debug(f"   📝 Descripción: {description[:80]}...")
                
                # Si no encuentra patrón específico, buscar contenido que parezca OA
                elif (len(text) > 50 and 
                      any(verb in text.lower() for verb in ['demostrar', 'comprender', 'aplicar', 'analizar', 'identificar', 'resolver', 'explicar', 'describir'])):
                    
                    # Generar código OA basado en posición
                    oa_code = f"{subject}{grade[-1]}{grade[0]}OA{str(i+1).zfill(2)}"
                    
                    oa_data.append({
                        'oa_code': oa_code,
                        'oa_desc': text,
                        'grade': grade,
                        'subject': subject,
                        'source_url': url,
                        'scraped_at': datetime.now().isoformat()
                    })
                    
                    logger.info(f"🔄 OA inferido: {oa_code}")
                    logger.debug(f"   📝 Texto: {text[:80]}...")
                    
                    if len(oa_data) >= 5:  # Limitar extracción alternativa
                        break
        
        except Exception as e:
            logger.warning(f"Error en método alternativo: {e}")
        
        return oa_data
    
    def extract_oa_mineduc_structure(self, soup, grade, subject, url):
        """
        Extracción específica para la estructura real del portal curriculumnacional.cl
        Basado en el patrón: h4 > "Objetivo de aprendizaje LE01 OA 01" seguido por descripción
        """
        oa_data = []
        
        try:
            # Buscar todos los h4 que contengan "Objetivo de aprendizaje"
            objective_headers = soup.find_all('h4', string=re.compile(r'Objetivo de aprendizaje.*', re.IGNORECASE))
            
            logger.info(f"🎯 Método estructura MINEDUC: encontrados {len(objective_headers)} objetivos")
            
            for header in objective_headers[:self.max_oa_limit]:
                try:
                    header_text = header.get_text(strip=True)
                    logger.debug(f"📋 Procesando header: {header_text}")
                    
                    # Extraer código OA del header
                    # Patrones dinámicos basados en self.oa_patterns para todas las asignaturas
                    oa_match = None
                    
                    # Buscar patrón de OA usando todos los patrones disponibles
                    for subj_code, patterns in self.oa_patterns.items():
                        for pattern in patterns:
                            # Convertir patrón regex a búsqueda en texto con espacios
                            # TE01OA\d+ -> TE01 OA \d+
                            search_pattern = pattern.replace('OA\\d+', r'OA\s+\d{2}')
                            match = re.search(search_pattern, header_text, re.IGNORECASE)
                            if match:
                                oa_match = match
                                break
                        if oa_match:
                            break
                    
                    if oa_match:
                        oa_code = oa_match.group(0).replace(' ', '')
                        logger.debug(f"✅ Código OA encontrado: {oa_code}")
                        
                        # Buscar la descripción - puede estar en el siguiente elemento
                        description = ""
                        
                        # Método 1: Buscar en el texto restante del header después del código
                        remaining_text = header_text[oa_match.end():].strip()
                        if len(remaining_text) > 20:
                            description = remaining_text
                            
                        # Método 2: Buscar en el siguiente elemento sibling
                        if not description:
                            next_sibling = header.find_next_sibling()
                            if next_sibling:
                                desc_text = next_sibling.get_text(strip=True)
                                if len(desc_text) > 20:
                                    description = desc_text
                        
                        # Método 3: Buscar en el siguiente p o div
                        if not description:
                            next_p = header.find_next('p')
                            if next_p:
                                desc_text = next_p.get_text(strip=True)
                                if len(desc_text) > 20:
                                    description = desc_text
                        
                        if description:
                            oa_data.append({
                                'oa_code': oa_code,
                                'oa_desc': description,
                                'grade': grade,
                                'subject': subject,
                                'source_url': url,
                                'scraped_at': datetime.now().isoformat()
                            })
                            
                            logger.info(f"✅ OA extraído: {oa_code}")
                            logger.debug(f"   📝 Descripción: {description[:80]}...")
                        else:
                            logger.warning(f"⚠️  No se encontró descripción para {oa_code}")
                            
                except Exception as e:
                    logger.warning(f"⚠️  Error procesando header OA: {e}")
                    continue
                    
        except Exception as e:
            logger.warning(f"Error en método estructura MINEDUC: {e}")
        
        return oa_data
    
    def extract_oa_from_page(self, url, grade, subject):
        """
        Extrae OA desde una página específica del portal MINEDUC
        Parseando la estructura HTML real del sitio
        """
        try:
            logger.info(f"🔍 Extrayendo OA de {grade}-{subject}: {url}")
            
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            oa_data = []
            
            # MÉTODO 0: Estructura específica MINEDUC (nuevo - más preciso)
            logger.info("🎯 Intentando método estructura específica MINEDUC...")
            oa_data = self.extract_oa_mineduc_structure(soup, grade, subject, url)
            
            # Si no encontramos nada, continuar con métodos alternativos
            if not oa_data:
                # MÉTODO 1: Buscar por ID específico (basado en el HTML real)
                # Buscar elementos que contengan códigos de OA como MA01 OA 01
                oa_elements = soup.find_all('h4', id=re.compile(r'objetivo.*oa.*', re.IGNORECASE))
                
                if not oa_elements:
                    # MÉTODO 2: Buscar por texto que contiene códigos de OA
                    oa_elements = soup.find_all(string=re.compile(r'(MA|LE|CN|HIS|ING|EDF|ART|MUS|TEC|ORI|TE|OR|MU|LPO)\d{2}\s+OA\s+\d{2}', re.IGNORECASE))
                
                if not oa_elements:
                    # MÉTODO 3: Buscar elementos h4 que contengan "Objetivo de aprendizaje"
                    oa_elements = soup.find_all('h4', string=re.compile(r'Objetivo de aprendizaje', re.IGNORECASE))
                
                logger.info(f"📋 Encontrados {len(oa_elements)} elementos potenciales de OA")
                
                # Procesar elementos encontrados con métodos alternativos
                for item in oa_elements[:self.max_oa_limit]:  # Limitar para testing
                    try:
                        if hasattr(item, 'get_text'):
                            text = item.get_text(strip=True)
                        else:
                            text = str(item).strip()
                        
                        # Extraer código OA
                        oa_code_match = re.search(r'([A-Z]{2,3}\d{2}\s+OA\s+\d{2})', text, re.IGNORECASE)
                        if oa_code_match:
                            oa_code = oa_code_match.group(1).replace(' ', '')
                            
                            # Buscar descripción
                            description = self.find_oa_description(item, soup)
                            
                            if description and len(description) > 10:  # Validar que hay descripción
                                oa_data.append({
                                    'oa_code': oa_code,
                                    'oa_desc': description,
                                    'grade': grade,
                                    'subject': subject,
                                    'source_url': url,
                                    'scraped_at': datetime.now().isoformat()
                                })
                                
                                logger.info(f"✅ OA extraído: {oa_code}")
                                logger.debug(f"   📝 Descripción: {description[:100]}...")
                    
                    except Exception as e:
                        logger.warning(f"⚠️  Error procesando item OA: {e}")
                        continue
                
                # Si aún no encontramos nada, intentar método alternativo final
                if not oa_data:
                    logger.info("🔄 Intentando método alternativo de extracción...")
                    oa_data = self.alternative_extraction_method(soup, grade, subject, url)
            
            else:
                logger.info(f"✅ Método estructura MINEDUC exitoso: {len(oa_data)} OA encontrados")
            
            logger.info(f"📊 Total extraídos: {len(oa_data)} OA de {grade}-{subject}")
            return oa_data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Error al acceder {url}: {e}")
            return []
        except Exception as e:
            logger.error(f"💥 Error inesperado procesando {url}: {e}")
            return []
    
    def scrape_all_oa(self, grades=None, subjects=None):
        """
        Scraping principal de todos los OA según filtros especificados
        CON LÍMITE PARA TESTING
        """
        all_oa_data = []
        
        # Usar todos los grados y asignaturas si no se especifican
        target_grades = grades or ['1B']  # Solo 1° Básico para testing
        target_subjects = subjects or ['MAT', 'LEN', 'CN', 'HIS', 'ING', 'EDF', 'ART', 'MUS', 'TEC', 'ORI']  # Todas las materias 1B (excluyendo LPO por ser opcional)
        
        logger.info(f"🚀 Iniciando scraping LIMITADO para testing:")
        logger.info(f"   📚 Grados: {target_grades}")
        logger.info(f"   📖 Asignaturas: {target_subjects}")
        logger.info(f"   🔢 Máximo OA por página: {self.max_oa_limit}")
        
        total_combinations = len(target_grades) * len(target_subjects)
        processed = 0
        
        for grade in target_grades:
            for subject in target_subjects:
                processed += 1
                
                logger.info(f"📈 Progreso: {processed}/{total_combinations} - Procesando {grade}-{subject}")
                
                url = self.build_url(grade, subject)
                if url:
                    oa_data = self.extract_oa_from_page(url, grade, subject)
                    all_oa_data.extend(oa_data)
                    
                    # Mostrar muestra de lo extraído
                    if oa_data:
                        logger.info(f"✅ Muestra extraída de {grade}-{subject}:")
                        for oa in oa_data[:2]:  # Mostrar solo primeros 2
                            logger.info(f"   🎯 {oa['oa_code']}: {oa['oa_desc'][:80]}...")
                    
                    # Delay entre requests para ser respetuoso
                    time.sleep(1)
                    
                    # Límite total para testing
                    if len(all_oa_data) >= self.max_oa_limit:
                        logger.info(f"🛑 Límite de testing alcanzado: {self.max_oa_limit} OA")
                        break
                else:
                    logger.warning(f"⚠️  No se pudo construir URL para {grade}-{subject}")
            
            if len(all_oa_data) >= self.max_oa_limit:
                break
        
        # Eliminar duplicados manteniendo el primer registro
        unique_oa_data = []
        seen_codes = set()
        
        for oa in all_oa_data:
            if oa['oa_code'] not in seen_codes:
                unique_oa_data.append(oa)
                seen_codes.add(oa['oa_code'])
        
        logger.info(f"🎉 Scraping completado: {len(all_oa_data)} OA extraídos ({len(unique_oa_data)} únicos)")
        
        # Mostrar resumen detallado
        if unique_oa_data:
            subjects_found = set(oa['subject'] for oa in unique_oa_data)
            grades_found = set(oa['grade'] for oa in unique_oa_data)
            logger.info(f"📊 Resumen extraído:")
            logger.info(f"   📚 Asignaturas encontradas: {list(subjects_found)}")
            logger.info(f"   🎓 Grados encontrados: {list(grades_found)}")
        
        return unique_oa_data
    
    def save_to_csv(self, oa_data, output_file):
        """
        Guarda los OA extraídos a CSV con las columnas especificadas
        """
        if not oa_data:
            logger.error("No hay datos de OA para guardar")
            return False
        
        try:
            # Crear DataFrame con las columnas especificadas
            df = pd.DataFrame(oa_data)
            
            # Reordenar columnas según especificación
            df = df[['oa_code', 'oa_desc', 'grade', 'subject', 'source_url', 'scraped_at']]
            
            # Guardar CSV con encoding UTF-8
            df.to_csv(output_file, index=False, encoding='utf-8')
            
            logger.info(f"📄 Archivo CSV guardado: {output_file}")
            logger.info(f"📊 Registros guardados: {len(df)}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error al guardar CSV: {e}")
            return False

    def extract_oa_from_text(self, text, subject, grade):
        """
        Extrae códigos de OA del texto HTML usando patrones específicos por asignatura
        """
        oa_codes = set()
        
        # Usar patrones específicos para la asignatura actual
        if subject in self.oa_patterns:
            for pattern in self.oa_patterns[subject]:
                matches = re.findall(pattern, text, re.IGNORECASE)
                oa_codes.update(matches)
        
        return list(oa_codes)

def main():
    parser = argparse.ArgumentParser(description='Scraper de OA desde portal MINEDUC - Versión Testing')
    parser.add_argument('--year', default='2023', help='Año de la malla curricular')
    parser.add_argument('--out', default='oa_raw.csv', help='Archivo CSV de salida')
    parser.add_argument('--grades', nargs='+', help='Grados específicos (ej: 1B 2B 7B)')
    parser.add_argument('--subjects', nargs='+', help='Asignaturas específicas (ej: MAT LEN)')
    parser.add_argument('--max-oa', type=int, default=100, help='Máximo OA para testing (default: 100)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Logging detallado')
    parser.add_argument('--full-scrape', action='store_true', help='Scraping completo (desactivar límites)')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Determinar límite de OA
    max_limit = None if args.full_scrape else args.max_oa
    
    # Inicializar scraper
    scraper = MinEducOAScraper(year=args.year, max_oa_limit=max_limit)
    
    logger.info("🎯 SCRAPER OA MINEDUC - VERSIÓN TESTING")
    logger.info(f"🔢 Límite OA: {max_limit if max_limit else 'SIN LÍMITE'}")
    logger.info(f"📅 Año: {args.year}")
    
    try:
        # Ejecutar scraping
        oa_data = scraper.scrape_all_oa(grades=args.grades, subjects=args.subjects)
        
        if oa_data:
            # Guardar en CSV
            success = scraper.save_to_csv(oa_data, args.out)
            
            if success:
                logger.info("🎉 ¡SCRAPING COMPLETADO EXITOSAMENTE!")
                logger.info(f"📄 Archivo generado: {args.out}")
                logger.info(f"📊 Total OA extraídos: {len(oa_data)}")
                logger.info(f"🔄 Siguiente paso: python enrich_oa.py --input {args.out}")
                
                # Mostrar muestra del contenido
                logger.info("📋 MUESTRA DEL CONTENIDO EXTRAÍDO:")
                for i, oa in enumerate(oa_data[:3]):
                    logger.info(f"   {i+1}. {oa['oa_code']}")
                    logger.info(f"      📝 {oa['oa_desc'][:100]}...")
                    logger.info(f"      🎓 Grado: {oa['grade']} | 📚 Asignatura: {oa['subject']}")
                
                sys.exit(0)
            else:
                logger.error("❌ Error al guardar CSV")
                sys.exit(1)
        else:
            logger.error("❌ No se pudieron extraer OA")
            logger.info("💡 POSIBLES CAUSAS:")
            logger.info("   • Cambios en la estructura del sitio MINEDUC")
            logger.info("   • Problemas de conectividad")
            logger.info("   • URLs incorrectas")
            logger.info("🔧 SOLUCIONES:")
            logger.info("   • Verificar URLs manualmente en el navegador")
            logger.info("   • Ejecutar con --verbose para más detalles") 
            logger.info("   • Probar con grados/asignaturas específicos")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("⏹️  Scraping interrumpido por el usuario")
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Error inesperado: {e}")
        logger.error("🔧 Ejecuta con --verbose para más información")
        sys.exit(1)

if __name__ == "__main__":
    main() 