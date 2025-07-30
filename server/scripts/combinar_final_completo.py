#!/usr/bin/env python3
"""
Script para Combinar TODOS los Archivos Extraídos - Incluyendo ING_PROP
Versión: 1.4.0 - Combinación Final Correcta
"""

import pandas as pd
import glob
import os
from datetime import datetime

def log_info(message):
    """Logger simple"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] ℹ️  {message}")

def log_success(message):
    """Logger para éxitos"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] ✅ {message}")

def main():
    """Función principal de combinación"""
    
    print("🔄 COMBINANDO TODOS LOS ARCHIVOS DE OA")
    print("=" * 60)
    
    all_dataframes = []
    
    # 1. CARGAR ARCHIVO EXISTENTE (si existe)
    existing_file = "oa_1b_6b_completo_todas_materias.csv"
    if os.path.exists(existing_file):
        try:
            existing_df = pd.read_csv(existing_file)
            all_dataframes.append(existing_df)
            log_info(f"📄 Archivo existente: {len(existing_df)} registros")
        except Exception as e:
            log_info(f"⚠️  Error cargando archivo existente: {e}")
    
    # 2. CARGAR TODOS LOS ARCHIVOS oa_completo_*
    completo_files = glob.glob("oa_completo_*.csv")
    log_info(f"🔍 Encontrados {len(completo_files)} archivos oa_completo_*")
    
    for file_path in completo_files:
        try:
            df = pd.read_csv(file_path)
            if len(df) > 0:
                all_dataframes.append(df)
                log_info(f"📄 {file_path}: {len(df)} registros")
        except Exception as e:
            log_info(f"⚠️  Error cargando {file_path}: {e}")
    
    # 3. CARGAR ARCHIVOS ESPECÍFICOS DE ASIGNATURAS
    subject_files = [
        "oa_his_todos_grados.csv",
        "oa_edf_todos_grados.csv", 
        "oa_art_todos_grados.csv",
        "oa_mus_todos_grados.csv",
        "oa_tec_todos_grados.csv",
        "oa_ori_todos_grados.csv",
        "oa_ing_todos_grados.csv"
    ]
    
    for file_path in subject_files:
        if os.path.exists(file_path):
            try:
                df = pd.read_csv(file_path)
                if len(df) > 0:
                    all_dataframes.append(df)
                    log_info(f"📄 {file_path}: {len(df)} registros")
            except Exception as e:
                log_info(f"⚠️  Error cargando {file_path}: {e}")
    
    # 4. COMBINAR TODOS LOS DATAFRAMES
    if all_dataframes:
        log_info("🔄 Combinando todos los DataFrames...")
        combined_df = pd.concat(all_dataframes, ignore_index=True)
        
        # Eliminar duplicados basado en código OA
        initial_count = len(combined_df)
        combined_df = combined_df.drop_duplicates(subset=['oa_code'], keep='first')
        final_count = len(combined_df)
        
        duplicates_removed = initial_count - final_count
        if duplicates_removed > 0:
            log_info(f"🔄 Duplicados eliminados: {duplicates_removed}")
        
        # Ordenar por grado y asignatura
        grade_order = ['1B', '2B', '3B', '4B', '5B', '6B']
        combined_df['grade_sort'] = combined_df['grade'].map({g: i for i, g in enumerate(grade_order)})
        combined_df = combined_df.sort_values(['grade_sort', 'subject', 'oa_code'])
        combined_df = combined_df.drop('grade_sort', axis=1)
        
        # Guardar archivo final
        final_file = "oa_1b_6b_COMPLETO_FINAL_CORREGIDO.csv"
        combined_df.to_csv(final_file, index=False, encoding='utf-8')
        
        log_success(f"💾 Archivo final guardado: {final_file}")
        log_success(f"📊 Total registros finales: {final_count}")
        
        # ESTADÍSTICAS FINALES DETALLADAS
        print("\n🎉 RESULTADOS FINALES COMPLETOS")
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
        
        # VERIFICACIÓN ESPECÍFICA DE INGLÉS DUAL
        ing_prop = combined_df[combined_df['subject'] == 'ING_PROP']
        ing_regular = combined_df[combined_df['subject'] == 'ING']
        
        print(f"\n🇬🇧 VERIFICACIÓN INGLÉS DUAL:")
        
        if len(ing_prop) > 0:
            print(f"   📘 Inglés Propuesta (1°-4°): {len(ing_prop)} OA")
            for grade in ['1B', '2B', '3B', '4B']:
                count = len(ing_prop[ing_prop['grade'] == grade])
                if count > 0:
                    print(f"      {grade}: {count} OA")
            
            # Mostrar algunos códigos de ejemplo
            sample_codes = ing_prop['oa_code'].head(3).tolist()
            print(f"      Códigos ejemplo: {', '.join(sample_codes)}")
        else:
            print(f"   ❌ Inglés Propuesta (1°-4°): 0 OA - NO ENCONTRADO")
        
        if len(ing_regular) > 0:
            print(f"   📗 Inglés (5°-6°): {len(ing_regular)} OA")
            for grade in ['5B', '6B']:
                count = len(ing_regular[ing_regular['grade'] == grade])
                if count > 0:
                    print(f"      {grade}: {count} OA")
            
            # Mostrar algunos códigos de ejemplo
            sample_codes = ing_regular['oa_code'].head(3).tolist()
            print(f"      Códigos ejemplo: {', '.join(sample_codes)}")
        else:
            print(f"   ❌ Inglés (5°-6°): 0 OA - NO ENCONTRADO")
        
        # TOTAL INGLÉS COMBINADO
        total_english = len(ing_prop) + len(ing_regular)
        print(f"   🎯 TOTAL INGLÉS (ambas versiones): {total_english} OA")
        
        # COMPARACIÓN CON OBJETIVOS
        print(f"\n🎯 CUMPLIMIENTO DE OBJETIVOS:")
        expected_subjects = ['MAT', 'LEN', 'CN', 'HIS', 'ING_PROP', 'ING', 'EDF', 'ART', 'MUS', 'TEC', 'ORI']
        found_subjects = combined_df['subject'].unique()
        
        for subject in expected_subjects:
            if subject in found_subjects:
                count = len(combined_df[combined_df['subject'] == subject])
                print(f"   ✅ {subject}: {count} OA")
            else:
                print(f"   ❌ {subject}: No encontrado")
        
        # LPO es opcional
        if 'LPO' in found_subjects:
            count = len(combined_df[combined_df['subject'] == 'LPO'])
            print(f"   🔶 LPO: {count} OA (opcional)")
        
        print(f"\n🚀 ARCHIVO FINAL LISTO:")
        print(f"   📄 {final_file}")
        print(f"   📊 {final_count} OA totales")
        print(f"   🎓 Grados: 1°-6° básico")
        print(f"   📚 Asignaturas: {len(found_subjects)}")
        
    else:
        log_info("❌ No se encontraron archivos para combinar")

if __name__ == "__main__":
    main() 