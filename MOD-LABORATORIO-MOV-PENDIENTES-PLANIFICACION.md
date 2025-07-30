# Planificación Detallada de Tareas Pendientes: Módulo de Laboratorios Móviles

Este documento contiene la planificación detallada y checklist para completar el Módulo de Laboratorios Móviles, considerando la relación correcta entre kits, materiales y actividades/planificaciones.

---

## Fase 1: Cimientos del Módulo (Backend y Datos)

### 1.1. Revisión y Ajuste Final del Esquema de BD
- [ ] **Actualizar modelo de datos:**
  - Eliminar columna `lab_product_id` de `lab_activity`.
  - Añadir columna `lab_material_id` a `lab_activity` (relación directa actividad-material).
  - Añadir columna `subject` (asignatura) a `lab_activity`.
  - Revisar migraciones y actualizar `lab-schema.sql`.
  - **Archivos:** `server/database/lab-schema.sql`, migraciones.

### 1.2. Script de Seeding
- [ ] **Crear script de datos de prueba:**
  - Poblar la base con 2-3 kits, 5-10 materiales y varias actividades asociadas a materiales.
  - **Archivos:** `server/database/seed-lab-data.js` (nuevo).

### 1.3. Completar API REST para Materiales (CRUD)
- [ ] **Endpoints completos para materiales:**
  - Implementar `POST`, `PUT`, `DELETE` en la API de materiales.
  - **Archivos:** `server/routes/lab.js`.

---

## Fase 2: Funcionalidades del Administrador

### 2.1. Reparar Creación de Actividades
- [ ] **Formulario de creación:**
  - Permitir seleccionar material existente al crear actividad.
  - **Archivos:** `client/src/app/admin/lab/activities/new/page.tsx`.

### 2.2. Formulario de Edición de Actividades
- [x] **Formulario de edición ampliado:**
  - Permite editar todos los campos relevantes: título, descripción, duración, estado, ciclo, nivel Bloom, grupo, dificultad, imagen, video, recursos, materiales, pasos, evaluación, objetivos, tiempos, autor, revisor, etiquetas, OA, asignatura, nivel, indicadores.
  - **Archivos:** `client/src/app/admin/lab/activities/edit/[id]/page.tsx`.

### 2.3. Funcionalidad de Eliminación de Actividades
- [ ] **Eliminar actividad:**
  - Lógica y modal de confirmación para eliminar actividades.
  - **Archivos:** `client/src/app/admin/lab/activities/page.tsx`.

### 2.4. Gestión de Inventario (Materiales)
- [ ] **CRUD de materiales:**
  - Vista de tabla, formulario de creación y edición.
  - **Archivos:** `client/src/app/admin/lab-management/page.tsx`, `.../materials/new`, `.../materials/edit/[id]`.

---

## Fase 3: Funcionalidades del Docente

### 3.1. Página de Detalle de Actividad
- [ ] **Vista de detalle:**
  - Mostrar toda la información de la actividad, materiales, recursos, video, etc.
  - **Archivos:** `client/src/app/teacher/labs/activity/[slug]/page.tsx`.

### 3.2. Registrar Ejecución
- [ ] **Formulario/modal de registro:**
  - Permitir al docente registrar el uso de la actividad.
  - **Archivos:** `client/src/app/teacher/labs/activity/[slug]/page.tsx`.

### 3.3. Carga de Evidencias
- [ ] **Subida de archivos:**
  - Permitir subir fotos/videos como evidencia.
  - **Archivos:** mismo componente de registro.

### 3.4. Historial de Actividades
- [ ] **Página de historial:**
  - Listado de actividades ejecutadas por el docente.
  - **Archivos:** `client/src/app/teacher/labs/my-history/page.tsx`.

---

## Fase 4: Pulido y Pruebas Finales

### 4.1. Mejoras de UI/UX
- [ ] **Indicadores y notificaciones:**
  - Añadir loaders, mensajes de éxito/error, diseño responsivo.

### 4.2. Pruebas de Flujo Completo (E2E)
- [ ] **Simulación de flujo real:**
  - Admin crea material y actividad.
  - Docente ejecuta y sube evidencia.
  - Admin ve métricas.

---

## Aclaración de Modelo de Datos

- **Un kit (lab_product)** contiene **muchos materiales (lab_material)**.
- **Cada material** puede tener **muchas actividades/planificaciones (lab_activity)**.
- **Cada actividad** debe estar asociada a un material específico, no solo al kit.
- Esto permite tener kits de distintas asignaturas y materiales compartidos entre kits, pero con actividades diferenciadas.

---

**Checklist de avance:**
- [x] = Completado
- [ ] = Pendiente

Actualiza este archivo conforme avances en cada tarea. 