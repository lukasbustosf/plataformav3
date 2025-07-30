#!/usr/bin/env python3
"""
Script de Scraping Masivo OA MINEDUC
Extrae OA de 2° a 6° Básico - Todas las Asignaturas
Versión: 1.1.0 - Escalamiento Horizontal
"""

import sys
import os
import subprocess
import time
from datetime import datetime

# Agregar el directorio actual al path para importar módulos
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def log_info(message):
    """Logger simple para el proceso masivo"""
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

def run_scraper(grades, subjects, max_oa=50, output_suffix=""):
    """Ejecuta el scraper con parámetros específicos"""
    
    output_file = f"oa_raw_{output_suffix}.csv" if output_suffix else "oa_raw.csv"
    
    # Construir comando con argumentos separados correctamente
    command = ["python", "scrape_oa.py"]
    command.extend(["--grades"] + grades)
    command.extend(["--subjects"] + subjects)
    command.extend(["--max-oa", str(max_oa)])
    command.extend(["--out", output_file])
    command.append("--verbose")
    
    log_info(f"Ejecutando: {' '.join(command)}")
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            log_success(f"Scraping exitoso - Archivo: {output_file}")
            return True, output_file
        else:
            log_error(f"Error en scraping: {result.stderr}")
            return False, None
            
    except subprocess.TimeoutExpired:
        log_error("Timeout en scraping (5 minutos)")
        return False, None
    except Exception as e:
        log_error(f"Excepción en scraping: {e}")
        return False, None

def main():
    """Función principal para scraping masivo"""
    
    print("🚀 SCRAPING MASIVO EDU21: 2° A 6° BÁSICO")
    print("=" * 50)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Configuración del scraping masivo
    all_grades = ['2B', '3B', '4B', '5B', '6B']
    all_subjects = ['MAT', 'LEN', 'CN', 'HIS', 'ING', 'EDF', 'ART', 'MUS', 'TEC', 'ORI']
    
    log_info(f"Grados a procesar: {', '.join(all_grades)}")
    log_info(f"Asignaturas a procesar: {', '.join(all_subjects)}")
    log_info("Máximo OA por página: 50")
    print()
    
    # ESTRATEGIA 1: Scraping completo de una vez
    log_info("ESTRATEGIA 1: Scraping masivo completo")
    
    success, output_file = run_scraper(
        grades=all_grades,
        subjects=all_subjects,
        max_oa=50,
        output_suffix="2b_6b_completo"
    )
    
    if success:
        log_success(f"✅ SCRAPING MASIVO COMPLETADO: {output_file}")
        
        # Mostrar estadísticas del archivo
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                total_records = len(lines) - 1  # Restar header
                
            log_success(f"📊 Total OA extraídos: {total_records}")
            
            # Ejecutar enriquecimiento automáticamente
            log_info("🔄 Iniciando enriquecimiento automático...")
            
            enrich_command = [
                "python", "enrich_oa.py",
                "--input", output_file,
                "--output", output_file.replace("raw", "enriquecido"),
                "--verbose"
            ]
            
            enrich_result = subprocess.run(enrich_command, capture_output=True, text=True, timeout=600)
            
            if enrich_result.returncode == 0:
                log_success("✅ ENRIQUECIMIENTO COMPLETADO")
                
                # Crear archivos finales para Supabase
                log_info("🔄 Generando archivos finales para Supabase...")
                
                final_command = [
                    "python", "load_to_supabase_final.py",
                    "--input", output_file.replace("raw", "enriquecido"),
                    "--output-prefix", "oa_2b_6b_final"
                ]
                
                final_result = subprocess.run(final_command, capture_output=True, text=True, timeout=300)
                
                if final_result.returncode == 0:
                    log_success("✅ ARCHIVOS FINALES GENERADOS")
                else:
                    log_error("❌ Error generando archivos finales")
                    
            else:
                log_error("❌ Error en enriquecimiento")
                
        except Exception as e:
            log_error(f"Error procesando estadísticas: {e}")
    
    else:
        log_error("❌ FALLO EN SCRAPING MASIVO")
        
        # ESTRATEGIA 2: Scraping por bloques
        log_info("ESTRATEGIA 2: Scraping por bloques como respaldo")
        
        successful_files = []
        
        # Scraping por grado
        for grade in all_grades:
            log_info(f"📚 Procesando grado {grade}...")
            
            success, output_file = run_scraper(
                grades=[grade],
                subjects=all_subjects,
                max_oa=50,
                output_suffix=f"grado_{grade}"
            )
            
            if success:
                successful_files.append(output_file)
                log_success(f"✅ Grado {grade} completado")
            else:
                log_error(f"❌ Error en grado {grade}")
            
            time.sleep(2)  # Pausa entre grados
        
        if successful_files:
            log_success(f"✅ Archivos generados: {len(successful_files)}")
            for file in successful_files:
                log_info(f"   📄 {file}")
        else:
            log_error("❌ No se generaron archivos exitosos")
    
    print()
    print("=" * 50)
    print(f"⏰ Fin: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🎉 PROCESO MASIVO COMPLETADO")

if __name__ == "__main__":
    main() 