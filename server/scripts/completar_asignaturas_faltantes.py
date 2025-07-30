#!/usr/bin/env python3
"""
Script para Completar Asignaturas Faltantes
Estrategia: Procesar sistemáticamente las 8 asignaturas que no están en el archivo actual
Versión: 1.0 - Targeted Recovery
"""

import sys
import os
import subprocess
import time
import pandas as pd
from datetime import datetime

def log_info(message):
    """Logger simple"""
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

def scrape_single_subject_all_grades(subject, max_oa=50):
    """Procesa una asignatura específica para todos los grados relevantes"""
    
    # Definir grados según disponibilidad de la asignatura
    if subject == 'ING':
        grades = ['5B', '6B']  # Inglés solo en 5° y 6°
    else:
        grades = ['1B', '2B', '3B', '4B', '5B', '6B']  # Otras asignaturas en todos los grados
    
    output_file = f"oa_{subject.lower()}_todos_grados.csv"
    
    # Construir comando
    command = ["python", "scrape_oa.py"]
    command.extend(["--grades"] + grades)
    command.extend(["--subjects", subject])
    command.extend(["--max-oa", str(max_oa)])
    command.extend(["--out", output_file])
    command.append("--verbose")
    
    log_info(f"Procesando asignatura {subject} en grados: {', '.join(grades)}")
    log_info(f"Comando: {' '.join(command)}")
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=600)
        
        if result.returncode == 0:
            if os.path.exists(output_file):
                df = pd.read_csv(output_file)
                count = len(df)
                if count > 0:
                    log_success(f"Asignatura {subject}: {count} OA extraídos")
                    
                    # Mostrar distribución por grado
                    grade_dist = df['grade'].value_counts().sort_index()
                    for grade, cnt in grade_dist.items():
                        log_info(f"   {grade}: {cnt} OA")
                    
                    return True, output_file, count
                else:
                    log_error(f"Asignatura {subject}: Archivo vacío")
                    return False, None, 0
            else:
                log_error(f"Asignatura {subject}: Archivo no creado")
                return False, None, 0
        else:
            log_error(f"Asignatura {subject}: Error en scraping")
            log_error(f"STDERR: {result.stderr[:200]}...")
            return False, None, 0
            
    except subprocess.TimeoutExpired:
        log_error(f"Asignatura {subject}: Timeout (10 minutos)")
        return False, None, 0
    except Exception as e:
        log_error(f"Asignatura {subject}: Excepción - {e}")
        return False, None, 0

def combine_with_existing(new_files, existing_file="oa_1b_6b_completo_todas_materias.csv"):
    """Combina los nuevos archivos con el archivo existente"""
    
    output_file = "oa_1b_6b_COMPLETO_FINAL.csv"
    
    log_info("Combinando archivos nuevos con datos existentes...")
    
    try:
        # Cargar archivo existente
        if os.path.exists(existing_file):
            existing_df = pd.read_csv(existing_file)
            log_info(f"Datos existentes: {len(existing_df)} registros")
        else:
            log_error(f"Archivo existente no encontrado: {existing_file}")
            existing_df = pd.DataFrame()
        
        # Cargar y combinar nuevos archivos
        combined_df = existing_df.copy()
        
        for file in new_files:
            if os.path.exists(file):
                df = pd.read_csv(file)
                combined_df = pd.concat([combined_df, df], ignore_index=True)
                log_info(f"   📄 {file}: +{len(df)} registros")
            else:
                log_error(f"   ❌ {file}: No encontrado")
        
        # Eliminar duplicados
        before_count = len(combined_df)
        combined_df = combined_df.drop_duplicates(subset=['oa_code'], keep='first')
        after_count = len(combined_df)
        
        # Guardar archivo final
        combined_df.to_csv(output_file, index=False, encoding='utf-8')
        
        log_success(f"Archivo final combinado: {output_file}")
        log_success(f"Total registros: {after_count} (eliminados {before_count - after_count} duplicados)")
        
        return True, output_file
        
    except Exception as e:
        log_error(f"Error combinando archivos: {e}")
        return False, None

def generate_final_summary(final_file):
    """Genera resumen final del dataset completo"""
    
    try:
        df = pd.read_csv(final_file)
        
        print("\n" + "="*70)
        print("🎉 DATASET FINAL COMPLETO: 1° A 6° BÁSICO - TODAS LAS ASIGNATURAS")
        print("="*70)
        
        total_oa = len(df)
        print(f"📋 Total OA final: {total_oa}")
        
        # Por grado
        print(f"\n📚 DISTRIBUCIÓN FINAL POR GRADO:")
        grade_counts = df['grade'].value_counts().sort_index()
        for grade, count in grade_counts.items():
            percentage = (count / total_oa) * 100
            print(f"   {grade}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Por asignatura
        print(f"\n📖 DISTRIBUCIÓN FINAL POR ASIGNATURA:")
        subject_counts = df['subject'].value_counts().sort_values(ascending=False)
        for subject, count in subject_counts.items():
            percentage = (count / total_oa) * 100
            print(f"   {subject}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Verificar Inglés específicamente
        ing_data = df[df['subject'] == 'ING']
        if len(ing_data) > 0:
            print(f"\n🇬🇧 INGLÉS VERIFICADO:")
            ing_by_grade = ing_data['grade'].value_counts().sort_index()
            for grade, count in ing_by_grade.items():
                print(f"   {grade}: {count} OA de Inglés")
        else:
            print(f"\n🇬🇧 INGLÉS: ❌ Aún no incluido")
        
        # Matriz final
        print(f"\n📋 MATRIZ FINAL GRADO x ASIGNATURA:")
        pivot_table = df.pivot_table(values='oa_code', index='grade', columns='subject', aggfunc='count', fill_value=0)
        print(pivot_table.to_string())
        
        print("="*70)
        
        return True
        
    except Exception as e:
        log_error(f"Error generando resumen final: {e}")
        return False

def main():
    """Función principal para completar asignaturas faltantes"""
    
    print("🚀 COMPLETANDO ASIGNATURAS FALTANTES: 1° A 6° BÁSICO")
    print("=" * 60)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Asignaturas faltantes identificadas
    missing_subjects = ['HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO', 'ING']
    
    log_info("ASIGNATURAS FALTANTES A PROCESAR:")
    for subj in missing_subjects:
        note = " (solo 5B-6B)" if subj == 'ING' else " (1B-6B)"
        log_info(f"   {subj}{note}")
    print()
    
    max_oa_per_page = 100
    successful_files = []
    total_new_oa = 0
    failed_subjects = []
    
    # Procesar cada asignatura faltante
    for i, subject in enumerate(missing_subjects, 1):
        print(f"\n📖 ASIGNATURA {subject} ({i}/{len(missing_subjects)})")
        print("-" * 40)
        
        success, output_file, oa_count = scrape_single_subject_all_grades(
            subject=subject,
            max_oa=max_oa_per_page
        )
        
        if success:
            successful_files.append(output_file)
            total_new_oa += oa_count
            log_success(f"Asignatura {subject} completada: {oa_count} OA")
        else:
            failed_subjects.append(subject)
            log_error(f"Asignatura {subject} falló")
        
        # Pausa entre asignaturas
        if i < len(missing_subjects):
            log_info("Pausa de 3 segundos...")
            time.sleep(3)
    
    # Resumen del proceso de recuperación
    print(f"\n📊 RESUMEN DE RECUPERACIÓN")
    print("-" * 40)
    log_success(f"Asignaturas exitosas: {len(successful_files)}/{len(missing_subjects)}")
    log_success(f"Total OA nuevos: {total_new_oa}")
    
    if failed_subjects:
        log_error(f"Asignaturas fallidas: {', '.join(failed_subjects)}")
    
    if not successful_files:
        log_error("No se recuperó ninguna asignatura")
        return
    
    # Combinar con datos existentes
    print(f"\n📁 COMBINANDO CON DATOS EXISTENTES")
    print("-" * 40)
    
    success, final_file = combine_with_existing(successful_files)
    
    if not success:
        log_error("Error combinando con datos existentes")
        return
    
    # Generar resumen final
    print(f"\n📈 RESUMEN FINAL")
    print("-" * 40)
    generate_final_summary(final_file)
    
    # Recomendaciones finales
    print(f"\n✅ PRÓXIMOS PASOS:")
    print("-" * 40)
    print(f"   1. Enriquecimiento: python enrich_oa.py {final_file} oa_final_enriquecido.csv")
    print(f"   2. Cargar a Supabase: python load_to_supabase_final.py {final_file}")
    print(f"   3. Verificar: python analizar_resultados_completos.py")
    
    print(f"\n🎉 PROCESO COMPLETADO")
    print("=" * 60)
    print(f"⏰ Fin: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main() 