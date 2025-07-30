 explica por que y lo añado a la lista de tareas fundamentales o dame la planfiaciaon actualizada       │
│   y crea un nuevo archivo con todo             "
# Planificación de Tareas Pendientes: Módulo de Laboratorios Móviles

Este documento contiene la planificación detallada para completar el Módulo de Laboratorios Móviles, incluyendo las correcciones y funcionalidades solicitadas.

---

### **Fase 1: Cimientos del Módulo (Backend y Datos)**

Explicación: ¿Por Qué es Fundamental Cambiar la Estructura de la Base de Datos?


  Tu aclaración sobre la estructura del negocio (Kit -> Material -> Planificación/Actividad) reveló una
  falla crítica en el diseño actual de la base de datos.


  Problema Actual:
  La tabla lab_activity (las planificaciones) se conecta directamente con lab_product (el kit completo). Es
  como si una receta de cocina se asociara al libro entero, pero no al ingrediente principal.


  Consecuencias de Mantener el Diseño Actual:
   1. Lógica Incorrecta: No podemos saber para qué material específico es una actividad. Si el "Laboratorio de
      Párvulo" tiene "Bloques Lógicos" y "Set de Cuentas", una actividad llamada "Contando con Colores" estaría
       asociada al kit completo, pero no sabríamos si se hace con los bloques o con las cuentas.
   2. Imposibilidad de Escalar: Si en el futuro se crea un "Laboratorio de Matemáticas" que también incluye
      "Bloques Lógicos", no habría forma de diferenciar las actividades de los bloques de párvulo de las de
      matemáticas. El sistema sería un caos.
   3. Funcionalidad Rota: Sería imposible construir las pantallas que necesitas. Un administrador no podría
      crear una actividad y asignarla a un material específico. Un profesor no podría ver un material y
      descubrir qué planificaciones puede hacer con él.


  Solución Propuesta (La Correcta):
  Debemos cambiar la relación en la base de datos para que lab_activity se conecte directamente con
  lab_material.


   * Cambio Técnico: En la tabla lab_activity, eliminaremos la columna lab_product_id y la reemplazaremos por
     lab_material_id.


  Este cambio es el cimiento indispensable sobre el que se debe construir todo el resto del módulo. Sin él,
  las demás funcionalidades serían imposibles de implementar correctamente.



El objetivo de esta fase es asegurar que la base de datos y la API estén completas y robustas para soportar todas las funcionalidades.

- [ ] **1.1. Revisión y Ajuste Final del Esquema de BD:**
    - **Tarea:** Añadir la columna `subject` (asignatura) a la tabla `lab_activity` para habilitar el filtro que falta.
    - **Archivos:** `server/database/lab-schema.sql`.

- [ ] **1.2. Creación de un Script de "Seeding" (Datos de Prueba):**SQL A SUPERBASE
    - **Tarea:** Crear un script que popule la base de datos con datos de prueba: 2-3 productos (kits), 5-10 materiales y     - **Archivos:** `server/database/seed-lab-data.js` (nuevo archivo).


- [ ] **1.4. Completar API REST para Materiales (CRUD):**
    - **Tarea:** Implementar los endpoints `POST`, `PUT` y `DELETE` para la gestión de materiales (inventario).
    - **Archivos:** `server/routes/lab.js`.

---

### **Fase 2: Funcionalidades del Administrador (Gestión de Catálogo e Inventario)**

- [ ] **2.1. Reparar la Creación de Actividades:**
    - **Problema:** La página `http://localhost:3000/admin/lab/activities/new` no funciona.
    - **Tarea:** Crear la página y el formulario para que un administrador pueda crear una nueva actividad. Este formulario debe permitir seleccionar materiales existentes del inventario.
    - **Archivos:** `client/src/app/admin/lab/activities/new/page.tsx` (nuevo archivo o reparar existente).

- [ ] **2.2. Formulario de Edición de Actividades:**
    - **Tarea:** Construir la página y el formulario para editar una actividad existente.
    - **Archivos:** `client/src/app/admin/lab/activities/edit/[id]/page.tsx` (nuevo archivo).

- [ ] **2.3. Funcionalidad de Eliminación de Actividades:**
    - **Tarea:** Implementar la lógica para que el botón "Eliminar" en la tabla de actividades funcione, con un modal de confirmación.
    - **Archivos:** `client/src/app/admin/lab/activities/page.tsx`.

- [ ] **2.4. Módulo de Gestión de Inventario (Materiales):**
    - **Problema:** No se puede crear o gestionar el inventario de materiales.
    - **Tarea:** Desarrollar la interfaz completa para el CRUD de materiales.
        - **Vista de Tabla:** Mostrar todos los materiales en `http://localhost:3000/admin/lab-management` (pestaña "Materiales").
        - **Formulario de Creación:** Crear la página en `.../materials/new` para añadir nuevos materiales al inventario.
        - **Formulario de Edición:** Crear la página en `.../materials/edit/[id]` para modificar materiales existentes.
    - **Archivos:** `client/src/app/admin/lab-management/page.tsx` y nuevos archivos para los formularios de materiales.

---

### **Fase 3: Funcionalidades del Docente (Uso y Registro)**

- [ ] **3.1. Página de Detalle de Actividad:**
    - **Tarea:** Crear la vista donde el docente puede ver toda la información de una actividad.
    - **Archivos:** `client/src/app/teacher/labs/activity/[slug]/page.tsx` (nuevo archivo).

- [ ] **3.2. Funcionalidad de "Registrar Ejecución":**
    - **Tarea:** Añadir un botón y un formulario/modal en la página de detalle para que el docente registre el uso de la actividad.
    - **Archivos:** `client/src/app/teacher/labs/activity/[slug]/page.tsx`.

- [ ] **3.3. Carga de Evidencias:**
    - **Tarea:** Permitir al docente subir archivos (fotos/videos) como evidencia en el formulario de registro.
    - **Archivos:** El mismo componente del formulario de registro.

- [ ] **3.4. Página "Mi Historial de Actividades":**
    - **Tarea:** Crear una página donde el docente vea un listado de las actividades que ha registrado.
    - **Archivos:** `client/src/app/teacher/labs/my-history/page.tsx` (nuevo archivo).

---

### **Fase 4: Pulido y Pruebas Finales**

- [ ] **4.1. Mejoras de UI/UX:**
    - **Tarea:** Añadir indicadores de carga, notificaciones de éxito/error y asegurar que el diseño sea responsivo en todas las nuevas vistas.

- [ ] **4.2. Pruebas de Flujo Completo (E2E):**
    - **Tarea:** Simular y probar el flujo completo:
        1. Un **admin** añade un material al inventario.
        2. Un **admin** crea una actividad usando ese material.
        3. Un **docente** la encuentra y la ejecuta.
        4. El **docente** registra su uso con evidencias.
        5. El **admin** ve las métricas actualizadas. respecto a lo anterior "

Lo que si te quiero aclarar es que este modulo de laboratorios móviles, en el futuro tendrán de diferentes asignaturas, en este caso nos compraron el laboratorio móvil de parvulo, que dentro de el tenemos diferentes materiales didácticos que asu ves cada material didáctico cuenta con planificaciones me explico? tu asi lo entendias? "
