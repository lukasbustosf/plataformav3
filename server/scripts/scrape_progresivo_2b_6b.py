#!/usr/bin/env python3
"""
Script de Scraping Progresivo OA MINEDUC
Estrategia: Grado por Grado - Todas las Asignaturas
Versión: 1.1.0 - Escalamiento Estable
"""

import sys
import os
import subprocess
import time
import pandas as pd
from datetime import datetime

def log_info(message):
    """Logger simple para el proceso progresivo"""
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

def run_single_scraper(grade, subjects, max_oa=50):
    """Ejecuta el scraper para un grado específico con todas las asignaturas"""
    
    output_file = f"oa_{grade.lower()}_all_subjects.csv"
    
    # Construir comando
    command = ["python", "scrape_oa.py"]
    command.extend(["--grades", grade])
    command.extend(["--subjects"] + subjects)
    command.extend(["--max-oa", str(max_oa)])
    command.extend(["--out", output_file])
    command.append("--verbose")
    
    log_info(f"Procesando grado {grade}...")
    log_info(f"Comando: {' '.join(command)}")
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=600)
        
        if result.returncode == 0:
            # Verificar que el archivo se creó y tiene contenido
            if os.path.exists(output_file):
                df = pd.read_csv(output_file)
                count = len(df)
                if count > 0:
                    log_success(f"Grado {grade}: {count} OA extraídos - {output_file}")
                    return True, output_file, count
                else:
                    log_error(f"Grado {grade}: Archivo vacío")
                    return False, None, 0
            else:
                log_error(f"Grado {grade}: Archivo no creado")
                return False, None, 0
        else:
            log_error(f"Grado {grade}: Error en scraping")
            log_error(f"STDERR: {result.stderr[:200]}...")
            return False, None, 0
            
    except subprocess.TimeoutExpired:
        log_error(f"Grado {grade}: Timeout (10 minutos)")
        return False, None, 0
    except Exception as e:
        log_error(f"Grado {grade}: Excepción - {e}")
        return False, None, 0

def combine_csv_files(file_list, output_name="oa_2b_6b_combinado.csv"):
    """Combina múltiples archivos CSV en uno solo"""
    
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
        
        return True
        
    except Exception as e:
        log_error(f"Error combinando archivos: {e}")
        return False

def generate_summary(combined_file):
    """Genera resumen estadístico del scraping"""
    
    try:
        df = pd.read_csv(combined_file)
        
        print("\n" + "="*60)
        print("📊 RESUMEN ESTADÍSTICO FINAL")
        print("="*60)
        
        # Totales
        total_oa = len(df)
        print(f"📋 Total OA extraídos: {total_oa}")
        
        # Por grado
        print(f"\n📚 DISTRIBUCIÓN POR GRADO:")
        grade_counts = df['grade'].value_counts().sort_index()
        for grade, count in grade_counts.items():
            print(f"   {grade}: {count} OA")
        
        # Por asignatura
        print(f"\n📖 DISTRIBUCIÓN POR ASIGNATURA:")
        subject_counts = df['subject'].value_counts().sort_values(ascending=False)
        for subject, count in subject_counts.items():
            print(f"   {subject}: {count} OA")
        
        # Códigos de muestra por grado
        print(f"\n🔍 MUESTRA DE CÓDIGOS POR GRADO:")
        for grade in sorted(df['grade'].unique()):
            grade_oa = df[df['grade'] == grade]['oa_code'].tolist()[:5]
            codes_str = ", ".join(grade_oa)
            print(f"   {grade}: {codes_str}...")
        
        print("="*60)
        
        return True
        
    except Exception as e:
        log_error(f"Error generando resumen: {e}")
        return False

def main():
    """Función principal para scraping progresivo"""
    
    print("🚀 SCRAPING PROGRESIVO EDU21: 2° A 6° BÁSICO")
    print("=" * 50)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Configuración
    grades = ['2B', '3B', '4B', '5B', '6B']
    subjects = ['MAT', 'LEN', 'CN', 'HIS', 'ING', 'EDF', 'ART', 'MUS', 'TEC', 'ORI']
    max_oa_per_page = 50
    
    log_info(f"Grados a procesar: {', '.join(grades)}")
    log_info(f"Asignaturas por grado: {', '.join(subjects)}")
    log_info(f"Máximo OA por página: {max_oa_per_page}")
    print()
    
    successful_files = []
    total_oa_count = 0
    failed_grades = []
    
    # Procesar grado por grado
    for i, grade in enumerate(grades, 1):
        print(f"\n📚 GRADO {grade} ({i}/{len(grades)})")
        print("-" * 30)
        
        success, output_file, oa_count = run_single_scraper(
            grade=grade,
            subjects=subjects,
            max_oa=max_oa_per_page
        )
        
        if success:
            successful_files.append(output_file)
            total_oa_count += oa_count
            log_success(f"Grado {grade} completado exitosamente")
        else:
            failed_grades.append(grade)
            log_error(f"Grado {grade} falló")
        
        # Pausa entre grados para evitar sobrecarga del servidor
        if i < len(grades):
            log_info("Pausa de 3 segundos...")
            time.sleep(3)
    
    # Resumen del proceso
    print(f"\n📊 RESUMEN DEL PROCESO")
    print("-" * 30)
    log_success(f"Grados exitosos: {len(successful_files)}/{len(grades)}")
    log_success(f"Total OA extraídos: {total_oa_count}")
    
    if failed_grades:
        log_error(f"Grados fallidos: {', '.join(failed_grades)}")
    
    # Combinar archivos si hay éxitos
    if successful_files:
        print(f"\n🔄 COMBINANDO ARCHIVOS")
        print("-" * 30)
        
        combined_success = combine_csv_files(
            successful_files, 
            "oa_2b_6b_completo_progresivo.csv"
        )
        
        if combined_success:
            log_success("Archivos combinados exitosamente")
            
            # Generar resumen estadístico
            print(f"\n📈 GENERANDO RESUMEN")
            print("-" * 30)
            generate_summary("oa_2b_6b_completo_progresivo.csv")
            
            # Ejecutar enriquecimiento automático
            print(f"\n🧠 ENRIQUECIMIENTO AUTOMÁTICO")
            print("-" * 30)
            
            enrich_command = [
                "python", "enrich_oa.py",
                "--input", "oa_2b_6b_completo_progresivo.csv",
                "--output", "oa_2b_6b_enriquecido_progresivo.csv",
                "--verbose"
            ]
            
            log_info("Iniciando enriquecimiento con Bloom y Cognitive Skills...")
            
            try:
                enrich_result = subprocess.run(enrich_command, capture_output=True, text=True, timeout=900)
                
                if enrich_result.returncode == 0:
                    log_success("✅ ENRIQUECIMIENTO COMPLETADO")
                    
                    # Generar archivos finales para Supabase
                    log_info("Generando archivos finales para Supabase...")
                    
                    final_command = [
                        "python", "load_to_supabase_final.py",
                        "--input", "oa_2b_6b_enriquecido_progresivo.csv",
                        "--output-prefix", "oa_2b_6b_final_progresivo"
                    ]
                    
                    final_result = subprocess.run(final_command, capture_output=True, text=True, timeout=300)
                    
                    if final_result.returncode == 0:
                        log_success("✅ ARCHIVOS FINALES PARA SUPABASE GENERADOS")
                    else:
                        log_error("❌ Error generando archivos finales")
                        
                else:
                    log_error("❌ Error en enriquecimiento")
                    
            except subprocess.TimeoutExpired:
                log_error("❌ Timeout en enriquecimiento")
            except Exception as e:
                log_error(f"❌ Error en enriquecimiento: {e}")
                
        else:
            log_error("Error combinando archivos")
    else:
        log_error("No se generaron archivos exitosos")
    
    print()
    print("=" * 50)
    print(f"⏰ Fin: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🎉 PROCESO PROGRESIVO COMPLETADO")

if __name__ == "__main__":
    main() 