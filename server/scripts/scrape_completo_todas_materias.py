#!/usr/bin/env python3
"""
Script de Scraping Completo MINEDUC: Todas las Asignaturas Disponibles por Grado
Estrategia: Mapa de Disponibilidad Real + Procesamiento Exhaustivo
Versión: 1.2.0 - Completo y Correcto
"""

import sys
import os
import subprocess
import time
import pandas as pd
from datetime import datetime

def log_info(message):
    """Logger simple para el proceso"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] ℹ️  {message}")

def log_success(message):
    """Logger para éxitos"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] ✅ {message}")

def log_error(message):
    """Logger para errores"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] ❌ {message}")

def get_subjects_by_grade():
    """
    Define qué asignaturas están disponibles en cada grado según MINEDUC
    Basado en la estructura real del curriculumnacional.cl
    """
    return {
        '1B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '2B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '3B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '4B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '5B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO', 'ING'],  # Inglés desde 5°
        '6B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO', 'ING']   # Inglés desde 5°
    }

def run_single_grade_scraper(grade, subjects, max_oa=50):
    """Ejecuta el scraper para un grado específico con asignaturas seleccionadas"""
    
    output_file = f"oa_{grade.lower()}_todas_materias.csv"
    
    # Construir comando
    command = ["python", "scrape_oa.py"]
    command.extend(["--grades", grade])
    command.extend(["--subjects"] + subjects)
    command.extend(["--max-oa", str(max_oa)])
    command.extend(["--out", output_file])
    command.append("--verbose")
    
    log_info(f"Procesando grado {grade} con {len(subjects)} asignaturas...")
    log_info(f"Asignaturas: {', '.join(subjects)}")
    log_info(f"Comando: {' '.join(command)}")
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=900)  # 15 min timeout
        
        if result.returncode == 0:
            # Verificar que el archivo se creó y tiene contenido
            if os.path.exists(output_file):
                df = pd.read_csv(output_file)
                count = len(df)
                if count > 0:
                    log_success(f"Grado {grade}: {count} OA extraídos - {output_file}")
                    
                    # Mostrar distribución por asignatura
                    subject_dist = df['subject'].value_counts()
                    for subj, cnt in subject_dist.items():
                        log_info(f"   {subj}: {cnt} OA")
                    
                    return True, output_file, count
                else:
                    log_error(f"Grado {grade}: Archivo vacío")
                    return False, None, 0
            else:
                log_error(f"Grado {grade}: Archivo no creado")
                return False, None, 0
        else:
            log_error(f"Grado {grade}: Error en scraping")
            log_error(f"STDERR: {result.stderr[:300]}...")
            return False, None, 0
            
    except subprocess.TimeoutExpired:
        log_error(f"Grado {grade}: Timeout (15 minutos)")
        return False, None, 0
    except Exception as e:
        log_error(f"Grado {grade}: Excepción - {e}")
        return False, None, 0

def combine_all_files(file_list, output_name="oa_1b_6b_completo_todas_materias.csv"):
    """Combina múltiples archivos CSV en uno solo con estadísticas detalladas"""
    
    if not file_list:
        log_error("No hay archivos para combinar")
        return False
        
    log_info(f"Combinando {len(file_list)} archivos...")
    
    try:
        combined_df = pd.DataFrame()
        
        for file in file_list:
            if os.path.exists(file):
                df = pd.read_csv(file)
                combined_df = pd.concat([combined_df, df], ignore_index=True)
                log_info(f"   📄 {file}: {len(df)} registros")
            else:
                log_error(f"   ❌ {file}: No encontrado")
        
        # Eliminar duplicados basado en oa_code
        before_count = len(combined_df)
        combined_df = combined_df.drop_duplicates(subset=['oa_code'], keep='first')
        after_count = len(combined_df)
        
        # Guardar archivo combinado
        combined_df.to_csv(output_name, index=False, encoding='utf-8')
        
        log_success(f"Archivo combinado: {output_name}")
        log_success(f"Total registros: {after_count} (eliminados {before_count - after_count} duplicados)")
        
        return True, output_name
        
    except Exception as e:
        log_error(f"Error combinando archivos: {e}")
        return False, None

def generate_comprehensive_summary(combined_file):
    """Genera resumen estadístico completo del scraping"""
    
    try:
        df = pd.read_csv(combined_file)
        
        print("\n" + "="*70)
        print("📊 RESUMEN ESTADÍSTICO COMPLETO - TODAS LAS ASIGNATURAS")
        print("="*70)
        
        # Totales
        total_oa = len(df)
        print(f"📋 Total OA extraídos: {total_oa}")
        
        # Por grado
        print(f"\n📚 DISTRIBUCIÓN POR GRADO:")
        grade_counts = df['grade'].value_counts().sort_index()
        for grade, count in grade_counts.items():
            percentage = (count / total_oa) * 100
            print(f"   {grade}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Por asignatura
        print(f"\n📖 DISTRIBUCIÓN POR ASIGNATURA:")
        subject_counts = df['subject'].value_counts().sort_values(ascending=False)
        for subject, count in subject_counts.items():
            percentage = (count / total_oa) * 100
            print(f"   {subject}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Matriz grado x asignatura
        print(f"\n📋 MATRIZ GRADO x ASIGNATURA:")
        pivot_table = df.pivot_table(values='oa_code', index='grade', columns='subject', aggfunc='count', fill_value=0)
        print(pivot_table.to_string())
        
        # Códigos de muestra por grado
        print(f"\n🔍 MUESTRA DE CÓDIGOS POR GRADO:")
        for grade in sorted(df['grade'].unique()):
            grade_oa = df[df['grade'] == grade]['oa_code'].tolist()[:8]
            codes_str = ", ".join(grade_oa)
            print(f"   {grade}: {codes_str}...")
        
        # Verificación de Inglés
        ing_data = df[df['subject'] == 'ING']
        if len(ing_data) > 0:
            print(f"\n🇬🇧 INGLÉS (ING) - DISPONIBILIDAD:")
            ing_by_grade = ing_data['grade'].value_counts().sort_index()
            for grade, count in ing_by_grade.items():
                print(f"   {grade}: {count} OA de Inglés")
        else:
            print(f"\n🇬🇧 INGLÉS (ING): No se encontraron OA")
        
        print("="*70)
        
        return True
        
    except Exception as e:
        log_error(f"Error generando resumen: {e}")
        return False

def run_enrichment(combined_file):
    """Ejecuta el proceso de enriquecimiento con Bloom y cognitive skills"""
    
    enriched_file = combined_file.replace('.csv', '_enriquecido.csv')
    
    log_info("Iniciando proceso de enriquecimiento...")
    
    try:
        command = ["python", "enrich_oa.py", combined_file, enriched_file]
        
        result = subprocess.run(command, capture_output=True, text=True, timeout=1800)  # 30 min
        
        if result.returncode == 0:
            if os.path.exists(enriched_file):
                df_enriched = pd.read_csv(enriched_file)
                log_success(f"Enriquecimiento completado: {len(df_enriched)} registros")
                return True, enriched_file
            else:
                log_error("Archivo enriquecido no creado")
                return False, None
        else:
            log_error(f"Error en enriquecimiento: {result.stderr[:200]}...")
            return False, None
            
    except subprocess.TimeoutExpired:
        log_error("Timeout en enriquecimiento (30 minutos)")
        return False, None
    except Exception as e:
        log_error(f"Excepción en enriquecimiento: {e}")
        return False, None

def main():
    """Función principal para scraping completo de todas las asignaturas"""
    
    print("🚀 SCRAPING COMPLETO EDU21: TODAS LAS ASIGNATURAS 1° A 6° BÁSICO")
    print("=" * 70)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Obtener configuración de asignaturas por grado
    subjects_by_grade = get_subjects_by_grade()
    all_grades = list(subjects_by_grade.keys())
    
    log_info("CONFIGURACIÓN DE ASIGNATURAS POR GRADO:")
    for grade, subjects in subjects_by_grade.items():
        log_info(f"   {grade}: {len(subjects)} asignaturas - {', '.join(subjects)}")
        if 'ING' in subjects:
            log_info(f"   {grade}: ⭐ Incluye INGLÉS")
    print()
    
    max_oa_per_page = 100  # Aumentamos para capturar más OA
    
    successful_files = []
    total_oa_count = 0
    failed_grades = []
    
    # Procesar grado por grado con sus asignaturas específicas
    for i, grade in enumerate(all_grades, 1):
        print(f"\n📚 GRADO {grade} ({i}/{len(all_grades)})")
        print("-" * 50)
        
        grade_subjects = subjects_by_grade[grade]
        
        success, output_file, oa_count = run_single_grade_scraper(
            grade=grade,
            subjects=grade_subjects,
            max_oa=max_oa_per_page
        )
        
        if success:
            successful_files.append(output_file)
            total_oa_count += oa_count
            log_success(f"Grado {grade} completado: {oa_count} OA")
        else:
            failed_grades.append(grade)
            log_error(f"Grado {grade} falló")
        
        # Pausa entre grados para evitar sobrecarga del servidor
        if i < len(all_grades):
            log_info("Pausa de 5 segundos...")
            time.sleep(5)
    
    # Resumen del proceso individual
    print(f"\n📊 RESUMEN DEL PROCESO INDIVIDUAL")
    print("-" * 50)
    log_success(f"Grados exitosos: {len(successful_files)}/{len(all_grades)}")
    log_success(f"Total OA individuales: {total_oa_count}")
    
    if failed_grades:
        log_error(f"Grados fallidos: {', '.join(failed_grades)}")
    
    if not successful_files:
        log_error("No se procesó ningún grado exitosamente")
        return
    
    # Combinar archivos
    print(f"\n📁 COMBINANDO ARCHIVOS")
    print("-" * 50)
    
    success, combined_file = combine_all_files(successful_files)
    
    if not success:
        log_error("Error combinando archivos")
        return
    
    # Generar resumen estadístico
    print(f"\n📈 ANÁLISIS ESTADÍSTICO")
    print("-" * 50)
    generate_comprehensive_summary(combined_file)
    
    # Enriquecimiento
    print(f"\n🧠 ENRIQUECIMIENTO CON IA")
    print("-" * 50)
    
    enrich_success, enriched_file = run_enrichment(combined_file)
    
    if enrich_success:
        log_success(f"Proceso completo exitoso!")
        log_success(f"Archivo base: {combined_file}")
        log_success(f"Archivo enriquecido: {enriched_file}")
    else:
        log_error("Enriquecimiento falló, pero archivo base disponible")
        log_success(f"Archivo base: {combined_file}")
    
    # Limpieza opcional
    print(f"\n🧹 LIMPIEZA")
    print("-" * 50)
    
    response = input("¿Eliminar archivos individuales por grado? (y/N): ").strip().lower()
    if response == 'y':
        for file in successful_files:
            try:
                os.remove(file)
                log_info(f"Eliminado: {file}")
            except:
                log_error(f"No se pudo eliminar: {file}")
    
    print(f"\n🎉 PROCESO COMPLETADO")
    print("=" * 70)
    print(f"⏰ Fin: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main() 