# Sistema de Seed Modular para EDU21

## 🎯 Objetivo

Este sistema resuelve el problema de manejar 190 actividades en un solo archivo `seed.js` que se vuelve inmanejable. Proporciona una solución modular, escalable y fácil de mantener.

## 📁 Estructura del Sistema

```
prisma/
├── seed-modular.js                    # Script principal modular
├── seed.js                           # Script original (legacy)
├── seed-data/
│   └── activities/                   # Carpeta con actividades individuales
│       ├── 001-habitat-animales.js
│       ├── 002-sonidos-magicos.js
│       └── 003-mi-mascota-amiga.js
├── scripts/
│   ├── convert-csv-to-activities.js  # Convertir CSV a archivos individuales
│   └── insert-activities-manual.sql  # Script SQL manual
└── README-SEED.md                    # Esta documentación
```

## 🚀 Cómo Usar

### Opción 1: Seed Modular (Recomendado)

```bash
cd server/prisma
node seed-modular.js
```

### Opción 2: Seed Original (Legacy)

```bash
cd server/prisma
node seed.js
```

### Opción 3: Script SQL Manual

1. Ve a Supabase Dashboard
2. Abre SQL Editor
3. Copia y pega el contenido de `scripts/insert-activities-manual.sql`
4. Ejecuta el script

## 📝 Formato de Archivos de Actividades

Cada actividad debe seguir este formato:

```javascript
module.exports = {
  // Metadatos de la actividad
  metadata: {
    id: 'uuid-unico',
    slug: 'nombre-actividad-slug',
    title: 'Título de la Actividad',
    product: 'LABORATORIO MOVIL DE PARVULO',
    thematic_axis: 'VIDA Y RELACIONES',
    material_name: 'NOMBRE DEL MATERIAL',
    status: 'active'
  },

  // Datos de la actividad
  activity: {
    description: 'Instrucción General...',
    steps_markdown: 'Instrucción Específica...',
    learning_objectives: ['OA 1: Descripción...', 'OA 2: Descripción...'],
    indicators_markdown: '- Indicador 1\n- Indicador 2',
    assessment_markdown: '- ¿Pregunta 1?\n- ¿Pregunta 2?',
    resource_urls: ['url1', 'url2'],
    cover_image_url: 'https://ejemplo.com/imagen.jpg',
    video_url: 'https://youtube.com/watch?v=...',
    oa_ids: ['OA 1', 'OA 2'],
    duration_minutes: 45,
    group_size: 4,
    bloom_level: 'comprender', // recordar, comprender, aplicar, analizar, evaluar, crear
    target_cycle: 'PK', // PK, K1, K2
    difficulty_level: 2, // 1, 2, 3
    subject: 'Ciencias Naturales',
    grade_level: 'Pre-Kínder'
  },

  // Material asociado
  material: {
    name: 'NOMBRE DEL MATERIAL',
    internal_code: 'PARVULAB-M05',
    quantity_per_kit: 9
  }
};
```

## 🔧 Convertir Datos CSV

Si tienes tus 190 actividades en formato CSV, puedes convertirlas automáticamente:

```bash
cd server/prisma
node scripts/convert-csv-to-activities.js
```

### Formato CSV Esperado

```csv
PRODUCTO,EJE TEMATIC,NOMBRE DE MATERIAL DIDACTICO,NOMBRE ACTIVIDAD,TEXTO DE LA CLASE,URL RECURSO
LABORATORIO MOVIL DE PARVULO,VIDA Y RELACIONES,MEMORICE EL ANIMAL,El hábitat de los animales,"Instrucción General: ...",https://ejemplo.com
```

## ✅ Ventajas del Sistema Modular

1. **Escalabilidad**: Fácil agregar nuevas actividades sin tocar el archivo principal
2. **Mantenibilidad**: Cada actividad en su propio archivo
3. **Control de versiones**: Cambios específicos por actividad
4. **Reutilización**: Materiales se crean automáticamente sin duplicados
5. **Seguridad**: Usa `upsert` para evitar duplicados y permitir actualizaciones
6. **Debugging**: Errores específicos por actividad

## 🛠️ Comandos Útiles

### Verificar actividades cargadas
```bash
cd server/prisma
ls seed-data/activities/ | wc -l
```

### Ejecutar solo una actividad específica
```bash
cd server/prisma
node -e "
const { loadActivitiesFromFiles } = require('./seed-modular.js');
loadActivitiesFromFiles().then(activities => {
  const activity = activities.find(a => a.metadata.slug === 'el-habitat-de-los-animales');
  console.log(activity);
});
"
```

### Limpiar actividades (cuidado en producción)
```sql
-- Solo usar en desarrollo
DELETE FROM public.lab_activity WHERE slug LIKE '%-%';
DELETE FROM public.lab_material WHERE internal_code LIKE 'PARVULAB-%';
```

## 🔍 Troubleshooting

### Error: "Cannot find module"
```bash
# Asegúrate de estar en el directorio correcto
cd server/prisma
# Verifica que existe el directorio de actividades
ls seed-data/activities/
```

### Error: "Connection failed"
```bash
# Verifica tu DATABASE_URL en .env
cat .env | grep DATABASE_URL
```

### Error: "Duplicate key"
```bash
# El sistema usa upsert, así que esto no debería pasar
# Si ocurre, verifica que los slugs sean únicos
```

## 📊 Monitoreo

El sistema proporciona logs detallados:

```
🚀 Iniciando seed modular...

📚 Creando datos básicos...
✅ Colegio: Colegio Demo EDU21
✅ Usuario: profesor@demo.edu21.cl
✅ Kit: Laboratorio movil de Parvulo - ParvuLAB

📁 Cargando actividades desde archivos...
✅ Cargado: El hábitat de los animales
✅ Cargado: Los sonidos mágicos de los animales
✅ Cargado: Mi mascota es mi amiga
📊 Total de actividades cargadas: 3

🔧 Procesando materiales...
✅ Material upserted: MEMORICE EL ANIMAL

🎯 Procesando actividades...
✅ Actividad upserted: El hábitat de los animales
✅ Actividad upserted: Los sonidos mágicos de los animales
✅ Actividad upserted: Mi mascota es mi amiga

✅ Seed modular completado exitosamente!
📈 Resumen:
   - Colegios: 1
   - Usuarios: 1
   - Kits: 1
   - Materiales: 1
   - Actividades: 3
```

## 🚨 Notas Importantes

1. **Nunca ejecutes `prisma migrate reset` en producción**
2. **No modifiques el esquema `auth` desde Prisma**
3. **Todos los cambios estructurales deben pasar por `schema.prisma`**
4. **El sistema usa `upsert` para evitar duplicados**
5. **Los materiales se crean automáticamente basados en las actividades**

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de error
2. Verifica la estructura de archivos
3. Confirma que tu DATABASE_URL es correcta
4. Asegúrate de que Prisma Client esté generado: `npx prisma generate` 