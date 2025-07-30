#!/usr/bin/env python3
"""
Script de Scraping Completo: Inglés + Todas las Asignaturas Faltantes
Incluye: ING_PROP (1°-4°), ING (5°-6°), y todas las demás asignaturas en todos los grados aplicables
Versión: 1.3.0 - Completo y Correcto con Inglés Dual
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

def scrape_subject_grade(grade, subject, output_prefix="oa_"):
    """Ejecuta scraping para una asignatura y grado específicos"""
    
    output_file = f"{output_prefix}{grade.lower()}_{subject.lower()}.csv"
    
    cmd = [
        "python", "scrape_oa.py",
        "--grades", grade,
        "--subjects", subject,
        "--max-oa", "50",  # Límite generoso
        "--out", output_file,
        "--verbose"
    ]
    
    try:
        log_info(f"🔄 Procesando {grade}-{subject}...")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0:
            # Verificar si se creó el archivo y tiene contenido
            if os.path.exists(output_file):
                df = pd.read_csv(output_file)
                count = len(df)
                if count > 0:
                    log_success(f"✅ {grade}-{subject}: {count} OA extraídos")
                    return output_file, count
                else:
                    log_error(f"❌ {grade}-{subject}: Archivo vacío")
                    return None, 0
            else:
                log_error(f"❌ {grade}-{subject}: No se creó archivo")
                return None, 0
        else:
            log_error(f"❌ {grade}-{subject}: Error en comando")
            if result.stderr:
                log_error(f"    Error: {result.stderr[:200]}...")
            return None, 0
            
    except subprocess.TimeoutExpired:
        log_error(f"❌ {grade}-{subject}: Timeout (>120s)")
        return None, 0
    except Exception as e:
        log_error(f"❌ {grade}-{subject}: Excepción {str(e)}")
        return None, 0

def main():
    """Función principal del scraping completo"""
    
    print("🚀 SCRAPING COMPLETO: INGLÉS + TODAS LAS ASIGNATURAS")
    print("=" * 70)
    
    # MAPEO DE DISPONIBILIDAD DE ASIGNATURAS POR GRADO
    # Basado en curriculumnacional.cl estructura real
    
    subjects_by_grade = {
        '1B': ['MAT', 'LEN', 'CN', 'HIS', 'ING_PROP', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '2B': ['MAT', 'LEN', 'CN', 'HIS', 'ING_PROP', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'], 
        '3B': ['MAT', 'LEN', 'CN', 'HIS', 'ING_PROP', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '4B': ['MAT', 'LEN', 'CN', 'HIS', 'ING_PROP', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],
        '5B': ['MAT', 'LEN', 'CN', 'HIS', 'ING', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],  # ING (no ING_PROP)
        '6B': ['MAT', 'LEN', 'CN', 'HIS', 'ING', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO']   # ING (no ING_PROP)
    }
    
    # Verificar qué ya tenemos para evitar duplicados
    existing_file = "oa_1b_6b_completo_todas_materias.csv"
    processed_combinations = set()
    
    if os.path.exists(existing_file):
        try:
            existing_df = pd.read_csv(existing_file)
            for _, row in existing_df.iterrows():
                combination = f"{row['grade']}-{row['subject']}"
                processed_combinations.add(combination)
            log_info(f"📄 Archivo existente encontrado: {len(processed_combinations)} combinaciones ya procesadas")
        except Exception as e:
            log_info(f"⚠️  No se pudo leer archivo existente: {e}")
    
    # Contador de progreso
    all_files = []
    total_oa = 0
    stats = {}
    
    # Procesar cada grado y sus asignaturas
    for grade in ['1B', '2B', '3B', '4B', '5B', '6B']:
        grade_files = []
        grade_oa = 0
        
        log_info(f"📚 Procesando grado {grade}...")
        
        for subject in subjects_by_grade[grade]:
            combination = f"{grade}-{subject}"
            
            # Solo procesar si NO existe o si ya tenemos pocos datos
            if combination not in processed_combinations:
                file_path, count = scrape_subject_grade(grade, subject, f"oa_completo_")
                
                if file_path and count > 0:
                    grade_files.append(file_path)
                    grade_oa += count
                    
                    # Estadísticas por asignatura
                    if subject not in stats:
                        stats[subject] = 0
                    stats[subject] += count
                
                # Pequeña pausa entre requests
                time.sleep(2)
            else:
                log_info(f"⏭️  {combination} ya procesado, saltando...")
        
        all_files.extend(grade_files)
        total_oa += grade_oa
        
        log_success(f"✅ Grado {grade} completado: {grade_oa} OA en {len(grade_files)} archivos")
    
    # COMBINAR TODOS LOS ARCHIVOS NUEVOS CON LOS EXISTENTES
    log_info("🔄 Combinando todos los archivos...")
    
    all_dataframes = []
    
    # Cargar archivo existente si existe
    if os.path.exists(existing_file):
        try:
            existing_df = pd.read_csv(existing_file)
            all_dataframes.append(existing_df)
            log_info(f"📄 Cargados {len(existing_df)} registros existentes")
        except Exception as e:
            log_error(f"Error cargando archivo existente: {e}")
    
    # Cargar archivos nuevos
    for file_path in all_files:
        if os.path.exists(file_path):
            try:
                df = pd.read_csv(file_path)
                all_dataframes.append(df)
                log_info(f"📄 Cargado {file_path}: {len(df)} registros")
            except Exception as e:
                log_error(f"Error cargando {file_path}: {e}")
    
    # Combinar y eliminar duplicados
    if all_dataframes:
        combined_df = pd.concat(all_dataframes, ignore_index=True)
        
        # Eliminar duplicados basado en código OA
        initial_count = len(combined_df)
        combined_df = combined_df.drop_duplicates(subset=['oa_code'], keep='first')
        final_count = len(combined_df)
        
        duplicates_removed = initial_count - final_count
        if duplicates_removed > 0:
            log_info(f"🔄 Duplicados eliminados: {duplicates_removed}")
        
        # Guardar archivo final
        final_file = "oa_1b_6b_completo_todas_materias_final.csv"
        combined_df.to_csv(final_file, index=False, encoding='utf-8')
        
        log_success(f"💾 Archivo final guardado: {final_file}")
        log_success(f"📊 Total registros finales: {final_count}")
        
        # ESTADÍSTICAS FINALES
        print("\n🎉 RESULTADOS FINALES DEL SCRAPING COMPLETO")
        print("=" * 70)
        
        print(f"📋 Total OA extraídos: {final_count}")
        
        # Por grado
        print(f"\n📚 DISTRIBUCIÓN POR GRADO:")
        grade_counts = combined_df['grade'].value_counts().sort_index()
        for grade, count in grade_counts.items():
            percentage = (count / final_count) * 100
            print(f"   {grade}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Por asignatura
        print(f"\n📖 DISTRIBUCIÓN POR ASIGNATURA:")
        subject_counts = combined_df['subject'].value_counts().sort_values(ascending=False)
        for subject, count in subject_counts.items():
            percentage = (count / final_count) * 100
            print(f"   {subject}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Verificación Inglés específica
        ing_prop_data = combined_df[combined_df['subject'] == 'ING_PROP']
        ing_data = combined_df[combined_df['subject'] == 'ING']
        
        if len(ing_prop_data) > 0 or len(ing_data) > 0:
            print(f"\n🇬🇧 VERIFICACIÓN INGLÉS:")
            if len(ing_prop_data) > 0:
                print(f"   📘 Inglés Propuesta (1°-4°): {len(ing_prop_data)} OA")
                ing_prop_grades = ing_prop_data['grade'].value_counts().sort_index()
                for grade, count in ing_prop_grades.items():
                    print(f"      {grade}: {count} OA")
            
            if len(ing_data) > 0:
                print(f"   📗 Inglés (5°-6°): {len(ing_data)} OA")
                ing_grades = ing_data['grade'].value_counts().sort_index()
                for grade, count in ing_grades.items():
                    print(f"      {grade}: {count} OA")
        
        print(f"\n🎯 PRÓXIMOS PASOS:")
        print(f"   1️⃣  Enriquecer: python enrich_oa.py --input {final_file}")
        print(f"   2️⃣  Generar SQL: python generate_final_1b_6b.py --input {final_file}")
        print(f"   3️⃣  Cargar a Supabase: python load_to_supabase_final.py")
        
    else:
        log_error("❌ No se encontraron archivos para combinar")
    
    # Limpiar archivos temporales (opcional)
    cleanup = input("\n🗑️  ¿Eliminar archivos temporales? (s/N): ").lower().strip()
    if cleanup == 's':
        for file_path in all_files:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    log_info(f"🗑️  Eliminado: {file_path}")
                except Exception as e:
                    log_error(f"Error eliminando {file_path}: {e}")

if __name__ == "__main__":
    main() 