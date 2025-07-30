# 📚 Pipeline OA MINEDUC → Supabase

## Descripción

Pipeline automático para extraer, enriquecer y cargar Objetivos de Aprendizaje (OA) desde el portal oficial MINEDUC hacia la base de datos Supabase de EDU21.

## Arquitectura del Pipeline

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Portal MINEDUC  │ ►  │  scrape_oa.py    │ ►  │  oa_raw.csv     │
│ curriculumnac.  │    │  (Web Scraping)  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  oa_enriched.   │ ◄  │  enrich_oa.py    │ ◄  │ + verb_bloom.csv│
│  csv            │    │  (Enriquecimiento│    │ + cog_skills.csv│
└─────────────────┘    │   Bloom & Cog)   │    └─────────────────┘
         │              └──────────────────┘
         ▼
┌─────────────────┐    ┌──────────────────┐
│ Supabase DB     │ ◄  │ COPY / Cron Job  │
│ learning_object.│    │ (Auto Update)    │
└─────────────────┘    └──────────────────┘
```

## Instalación y Configuración

### 1. Instalar Dependencias Python

```bash
cd server/scripts
pip install -r requirements.txt
```

### 2. Verificar Estructura de Archivos

```
server/
├── scripts/
│   ├── scrape_oa.py          # Script de scraping
│   ├── enrich_oa.py          # Script de enriquecimiento  
│   ├── requirements.txt      # Dependencias Python
│   └── README_Pipeline_OA.md # Esta documentación
├── datasets/
│   ├── verb_bloom.csv        # Mapeo verbos → Bloom
│   └── cognitive_skills.csv  # Mapeo OA → habilidades cognitivas
└── database/
    └── supabase_cron_oa_update.sql  # Job cron mensual
```

## Uso del Pipeline

### Paso 1: Scraping desde MINEDUC

Extrae OA desde el portal oficial del MINEDUC:

```bash
# Extraer todos los OA del año 2023
python scrape_oa.py --year 2023 --out oa_raw.csv

# Extraer grados específicos
python scrape_oa.py --grades 1B 2B 3B --out oa_basica.csv

# Extraer asignaturas específicas
python scrape_oa.py --subjects MAT LEN --out oa_mat_len.csv

# Modo verbose para debugging
python scrape_oa.py --verbose --out oa_debug.csv
```

**Salida**: `oa_raw.csv` con columnas:
- `oa_code`: Código del OA (ej: MAT-5B-OA01)
- `oa_desc`: Descripción completa del OA
- `grade`: Código del grado (ej: 5B)
- `subject`: Código de la asignatura (ej: MAT)

### Paso 2: Enriquecimiento con Bloom y Cognitive Skills

Procesa el archivo raw y añade metadatos educativos:

```bash
# Enriquecimiento estándar
python enrich_oa.py --input oa_raw.csv --output oa_enriched.csv

# Con logging detallado
python enrich_oa.py --input oa_raw.csv --output oa_enriched.csv --verbose
```

**Salida**: `oa_enriched.csv` con columnas adicionales:
- `bloom_level`: Nivel de Bloom (Recordar, Comprender, Aplicar, Analizar, Evaluar, Crear)
- `cog_skill`: Habilidad cognitiva principal
- `complexity_level`: Nivel de complejidad (1-5)
- `ministerial_priority`: Prioridad ministerial (high, normal, low)
- `oa_version`: Versión de la malla (2023, 2026)

### Paso 3: Carga en Supabase

#### Opción A: Carga Manual (CSV)

```sql
-- 1. Crear tabla temporal
CREATE TEMP TABLE temp_oa_mineduc_import (
    oa_code VARCHAR(50),
    oa_desc TEXT,
    oa_short_desc VARCHAR(255),
    grade_code VARCHAR(10),
    subject_code VARCHAR(10),
    bloom_level VARCHAR(20),
    cog_skill VARCHAR(50),
    oa_version VARCHAR(10),
    semester INTEGER,
    complexity_level INTEGER,
    estimated_hours INTEGER,
    ministerial_priority VARCHAR(20),
    is_transversal BOOLEAN
);

-- 2. Cargar CSV
COPY temp_oa_mineduc_import(oa_code,oa_desc,oa_short_desc,grade_code,subject_code,bloom_level,cog_skill,oa_version,semester,complexity_level,estimated_hours,ministerial_priority,is_transversal)
FROM 'oa_enriched.csv' WITH CSV HEADER;

-- 3. Ejecutar actualización
SELECT update_oa_mineduc_monthly();
```

#### Opción B: Carga Programática (Python)

```python
import psycopg2
import pandas as pd

# Cargar CSV enriquecido
df = pd.read_csv('oa_enriched.csv')

# Conectar a Supabase
conn = psycopg2.connect(SUPABASE_DB_URL)
cur = conn.cursor()

# Insertar registros
for _, row in df.iterrows():
    cur.execute("""
        INSERT INTO temp_oa_mineduc_import (...)
        VALUES (%s, %s, ...)
    """, tuple(row))

conn.commit()

# Ejecutar actualización
cur.execute("SELECT update_oa_mineduc_monthly();")
result = cur.fetchone()
print(result[0])
```

### Paso 4: Automatización con Cron

#### Configurar Job Mensual en Supabase

```sql
-- Activar extensión cron (solo admin)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar job para el primer día de cada mes a las 02:00
SELECT cron.schedule(
    'oa-monthly-update',
    '0 2 1 * *',
    'SELECT update_oa_mineduc_monthly();'
);

-- Verificar jobs programados
SELECT * FROM cron.job;
```

#### Monitoreo del Job

```sql
-- Ver historial de ejecuciones
SELECT 
    jobname, 
    start_time, 
    end_time, 
    status,
    return_message
FROM cron.job_run_details 
WHERE jobname = 'oa-monthly-update' 
ORDER BY start_time DESC 
LIMIT 10;

-- Estadísticas de OA
SELECT 
    oa_version,
    COUNT(*) as total_oa,
    COUNT(*) FILTER (WHERE deprecated_at IS NULL) as active_oa,
    COUNT(*) FILTER (WHERE deprecated_at IS NOT NULL) as deprecated_oa
FROM learning_objectives 
GROUP BY oa_version;
```

## Configuración de Archivos de Referencia

### verb_bloom.csv

Mapea verbos pedagógicos a niveles de la taxonomía de Bloom:

```csv
verbo,bloom_level,confidence
recordar,Recordar,0.95
identificar,Recordar,0.90
describir,Comprender,0.90
aplicar,Aplicar,0.95
analizar,Analizar,0.95
evaluar,Evaluar,0.95
crear,Crear,0.95
```

### cognitive_skills.csv

Define habilidades cognitivas y sus palabras clave:

```csv
skill_name,skill_code,description,keywords,subject_affinity
Memoria de Trabajo,memoria_trabajo,"Retener información temporalmente","retener,mantener,recordar",MAT;LEN
Razonamiento Lógico,razonamiento_logico,"Seguir reglas lógicas","inferir,deducir,razonar",MAT;CN
```

## Troubleshooting

### Errores Comunes

#### 1. Error de Conexión MINEDUC

```
requests.exceptions.ConnectionError: HTTPSConnectionPool
```

**Solución**: 
- Verificar conectividad a internet
- Probar con proxy si es necesario
- Ajustar timeout en `scrape_oa.py`

#### 2. CSV Malformado

```
pd.errors.ParserError: Error tokenizing data
```

**Solución**:
- Verificar encoding UTF-8
- Revisar caracteres especiales en descripciones OA
- Usar `pandas.read_csv()` con `error_bad_lines=False`

#### 3. Error de Permisos Supabase

```
psycopg2.errors.InsufficientPrivilege: permission denied
```

**Solución**:
- Verificar que el usuario tenga permisos CREATE TABLE
- Usar función `prepare_oa_import_table()` como SECURITY DEFINER
- Revisar RLS policies

#### 4. Job Cron No Ejecuta

```sql
-- Verificar que pg_cron esté habilitado
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Ver errores en logs
SELECT * FROM cron.job_run_details WHERE status = 'failed';
```

### Testing del Pipeline

#### Test Completo End-to-End

```bash
# 1. Test scraping (modo limitado)
python scrape_oa.py --grades 1B --subjects MAT --out test_raw.csv

# 2. Test enriquecimiento
python enrich_oa.py --input test_raw.csv --output test_enriched.csv --verbose

# 3. Test carga Supabase
psql $SUPABASE_URL -c "SELECT test_oa_update_manual();"
```

#### Validación de Datos

```sql
-- Verificar mapeo Bloom correcto
SELECT bloom_level, COUNT(*) 
FROM learning_objectives 
GROUP BY bloom_level;

-- OA sin mapeo de asignatura
SELECT oa_code, subject_id 
FROM learning_objectives 
WHERE subject_id IS NULL;

-- Verificar duplicados
SELECT oa_code, COUNT(*) 
FROM learning_objectives 
GROUP BY oa_code 
HAVING COUNT(*) > 1;
```

## Métricas y Monitoreo

### KPIs del Pipeline

- **Coverage Rate**: % de OA oficiales MINEDUC capturados
- **Bloom Accuracy**: % de OA con nivel Bloom correcto (validación pedagógica)
- **Processing Time**: Tiempo total del pipeline completo
- **Error Rate**: % de OA que fallan en procesamiento

### Dashboard de Monitoreo

```sql
-- Query para dashboard de administrador
SELECT 
    'Total OA Activos' as metric,
    COUNT(*) as value
FROM learning_objectives 
WHERE deprecated_at IS NULL

UNION ALL

SELECT 
    'OA Agregados Este Mes' as metric,
    COUNT(*) as value
FROM learning_objectives 
WHERE created_at >= DATE_TRUNC('month', NOW())

UNION ALL

SELECT 
    'Última Actualización' as metric,
    EXTRACT(DAYS FROM NOW() - MAX(updated_at)) as value
FROM learning_objectives;
```

## Extensiones Futuras

### Versión 2026 Support

- Detectar automáticamente nueva malla curricular 2026
- Migración gradual: mantener ambas versiones
- API endpoint para toggle entre versiones

### Multi-idioma

- Soporte para Mapuzugun y otros idiomas originarios
- Detección automática de idioma en descripciones OA
- Traducción automática con validación pedagógica

### IA Integration

- Clasificación automática Bloom con ML
- Detección de prerequisitos automática
- Generación de habilidades cognitivas con LLM

---

**Autor**: EDU21 Development Team  
**Versión**: 1.1.0  
**Última actualización**: 2025-01-20  
**Soporte**: Revisar issues en repositorio EDU21 