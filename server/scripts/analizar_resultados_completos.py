#!/usr/bin/env python3
"""
Análisis Estadístico de Resultados: Scraping Completo 1°-6° Básico
Versión: 1.0 - Análisis Detallado
"""

import pandas as pd
import numpy as np
from datetime import datetime

def analyze_combined_file(file_path="oa_1b_6b_completo_todas_materias.csv"):
    """Analiza el archivo combinado con todas las estadísticas"""
    
    print("🔍 ANÁLISIS ESTADÍSTICO: SCRAPING COMPLETO 1°-6° BÁSICO")
    print("=" * 70)
    
    try:
        # Cargar datos
        df = pd.read_csv(file_path)
        total_oa = len(df)
        
        print(f"📄 Archivo analizado: {file_path}")
        print(f"📋 Total registros: {total_oa}")
        print(f"⏰ Fecha análisis: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Análisis por grado
        print(f"\n📚 DISTRIBUCIÓN POR GRADO:")
        grade_counts = df['grade'].value_counts().sort_index()
        for grade, count in grade_counts.items():
            percentage = (count / total_oa) * 100
            print(f"   {grade}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Análisis por asignatura
        print(f"\n📖 DISTRIBUCIÓN POR ASIGNATURA:")
        subject_counts = df['subject'].value_counts().sort_values(ascending=False)
        for subject, count in subject_counts.items():
            percentage = (count / total_oa) * 100
            print(f"   {subject}: {count:3d} OA ({percentage:5.1f}%)")
        
        # Verificar asignaturas únicas
        unique_subjects = sorted(df['subject'].unique())
        print(f"\n🎯 ASIGNATURAS ENCONTRADAS ({len(unique_subjects)}):")
        print(f"   {', '.join(unique_subjects)}")
        
        # Verificar disponibilidad de Inglés
        ing_data = df[df['subject'] == 'ING']
        if len(ing_data) > 0:
            print(f"\n🇬🇧 INGLÉS (ING) - DISPONIBILIDAD:")
            ing_by_grade = ing_data['grade'].value_counts().sort_index()
            for grade, count in ing_by_grade.items():
                print(f"   {grade}: {count} OA de Inglés")
            
            # Muestra de códigos de Inglés
            sample_codes = ing_data['oa_code'].tolist()[:10]
            print(f"   📋 Muestra códigos: {', '.join(sample_codes)}")
        else:
            print(f"\n🇬🇧 INGLÉS (ING): ❌ NO se encontraron registros")
        
        # Verificar otras asignaturas específicas
        expected_subjects = ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO', 'ING']
        missing_subjects = []
        
        print(f"\n✅ VERIFICACIÓN DE ASIGNATURAS ESPERADAS:")
        for subj in expected_subjects:
            count = len(df[df['subject'] == subj])
            if count > 0:
                print(f"   ✅ {subj}: {count} OA")
            else:
                print(f"   ❌ {subj}: No encontrado")
                missing_subjects.append(subj)
        
        if missing_subjects:
            print(f"\n⚠️  ASIGNATURAS FALTANTES: {', '.join(missing_subjects)}")
        
        # Matriz grado x asignatura
        print(f"\n📋 MATRIZ GRADO x ASIGNATURA:")
        try:
            pivot_table = df.pivot_table(values='oa_code', index='grade', columns='subject', aggfunc='count', fill_value=0)
            print(pivot_table.to_string())
        except Exception as e:
            print(f"   ❌ Error generando matriz: {e}")
        
        # Análisis de URLs únicas
        unique_urls = df['source_url'].nunique()
        print(f"\n🔗 ANÁLISIS DE FUENTES:")
        print(f"   URLs únicas procesadas: {unique_urls}")
        
        # Muestra de URLs por asignatura
        print(f"\n🌐 MUESTRA DE URLs POR ASIGNATURA:")
        for subject in unique_subjects[:5]:  # Primeras 5 asignaturas
            sample_url = df[df['subject'] == subject]['source_url'].iloc[0] if len(df[df['subject'] == subject]) > 0 else "N/A"
            print(f"   {subject}: {sample_url}")
        
        # Verificar marcas de tiempo
        timestamps = pd.to_datetime(df['scraped_at'])
        earliest = timestamps.min()
        latest = timestamps.max()
        duration = latest - earliest
        
        print(f"\n⏰ ANÁLISIS TEMPORAL:")
        print(f"   Inicio scraping: {earliest.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   Fin scraping: {latest.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   Duración total: {duration}")
        
        print("=" * 70)
        
        return {
            'total_oa': total_oa,
            'grades': grade_counts.to_dict(),
            'subjects': subject_counts.to_dict(),
            'missing_subjects': missing_subjects,
            'has_ingles': len(ing_data) > 0,
            'unique_subjects': unique_subjects
        }
        
    except FileNotFoundError:
        print(f"❌ ERROR: Archivo {file_path} no encontrado")
        return None
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None

def compare_with_expected():
    """Compara con los resultados esperados"""
    
    print(f"\n📊 COMPARACIÓN CON EXPECTATIVAS:")
    print("-" * 50)
    
    expected_by_grade = {
        '1B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],  # 10 asignaturas
        '2B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],  # 10 asignaturas  
        '3B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],  # 10 asignaturas
        '4B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO'],  # 10 asignaturas
        '5B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO', 'ING'],  # 11 asignaturas (+ Inglés)
        '6B': ['MAT', 'LEN', 'CN', 'HIS', 'EDF', 'ART', 'MUS', 'TEC', 'ORI', 'LPO', 'ING']   # 11 asignaturas (+ Inglés)
    }
    
    total_expected_subjects = 62  # 10*4 + 11*2 = 40 + 22 = 62
    
    print(f"🎯 CONFIGURACIÓN ESPERADA:")
    for grade, subjects in expected_by_grade.items():
        ing_note = " (incluye INGLÉS)" if 'ING' in subjects else ""
        print(f"   {grade}: {len(subjects)} asignaturas{ing_note}")
    
    print(f"\n📊 TOTALES ESPERADOS:")
    print(f"   Total asignaturas-grado esperadas: {total_expected_subjects}")
    print(f"   Grados con Inglés: 5B, 6B")
    print(f"   Total OA esperados: 600-800 (estimación)")

def main():
    """Función principal de análisis"""
    
    # Analizar archivo principal
    results = analyze_combined_file()
    
    if results:
        # Comparar con expectativas
        compare_with_expected()
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES:")
        print("-" * 50)
        
        if not results['has_ingles']:
            print("   🔧 Re-ejecutar scraping incluyendo Inglés para 5B y 6B")
        
        if results['missing_subjects']:
            print(f"   🔧 Investigar por qué faltan: {', '.join(results['missing_subjects'])}")
        
        if results['total_oa'] < 300:
            print("   🔧 El número de OA parece bajo, verificar configuración de asignaturas")
        
        print(f"\n✅ SIGUIENTE PASO: Enriquecimiento de datos con IA")
        print(f"   python enrich_oa.py oa_1b_6b_completo_todas_materias.csv oa_1b_6b_enriquecido_final.csv")

if __name__ == "__main__":
    main() 