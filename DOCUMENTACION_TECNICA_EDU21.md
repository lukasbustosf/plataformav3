# Documentación Técnica del Proyecto: Plataforma EDU21

## 1. Resumen del Proyecto

La **Plataforma EDU21** es un sistema de gestión educativa integral diseñado para modernizar y facilitar la interacción entre administradores, profesores y alumnos. Su objetivo principal es proporcionar herramientas digitales para la planificación de clases, la creación y ejecución de actividades de aprendizaje gamificadas y la gestión de recursos pedagógicos.

El proyecto se centra actualmente en el desarrollo del **Módulo de Laboratorios Móviles (ParvuLAB)**, una iniciativa para ofrecer a los docentes un catálogo de actividades prácticas y experimentales que pueden realizar con kits de materiales específicos.

---

## 2. Arquitectura Tecnológica

-   **Frontend:**
    -   Framework: **Next.js (React)**
    -   Lenguaje: **TypeScript**
    -   Estilos: **Tailwind CSS** y componentes `shadcn/ui`.
-   **Backend:**
    -   Entorno: **Node.js** con **Express**
    -   Lenguaje: **JavaScript (ESM)**
-   **Base de Datos:**
    -   Proveedor: **Supabase** (PostgreSQL)
    -   ORM: **Prisma**. Se ha integrado para gestionar el esquema de la base de datos y las consultas, reemplazando las consultas SQL manuales.
-   **Autenticación:**
    -   Gestionada por **Supabase Auth**.
    -   El backend utiliza un middleware personalizado (`authenticateToken`, `requireRole`) para proteger las rutas.

---

## 3. Estado Actual y Fase del Proyecto

Nos encontramos en la **Fase 3: Implementación del Módulo de Laboratorios Móviles**.

### Fase 3.1: Corrección y Estabilización de la Base de Datos (Recién Completada)

Acabamos de superar un punto crítico que impedía el avance:

-   **Problema:** El esquema de la base de datos en Supabase no estaba sincronizado con las expectativas del ORM (Prisma). Faltaban tablas cruciales como `lab_activity_metrics`, lo que causaba errores 500 en el servidor al intentar consultar actividades.
-   **Solución Implementada:**
    1.  Se generó un script SQL maestro y correcto (`FINAL_CLEAN_PUBLIC_ONLY.sql`) que reconstruye todo el esquema `public` desde cero.
    2.  Se ejecutó este script en Supabase para asegurar que la estructura de la base de datos sea la correcta.
    3.  Se sincronizó el `schema.prisma` con la base de datos real.
    4.  Se estableció un historial de migraciones limpio y se pobló la base de datos con datos de prueba (`prisma db seed`).
-   **Estado:** La base de datos ahora es **estable y consistente**. El servidor puede iniciarse y realizar consultas sin errores de esquema.

### Fase 3.2: Implementación de "Registrar Ejecución" (En Progreso)

Esta es la tarea en la que estamos trabajando **ahora mismo**. El objetivo es permitir que un profesor registre en la plataforma que ha realizado una actividad de laboratorio con sus estudiantes.

---

## 4. Próximos Pasos y Hoja de Ruta Lógica

Aquí se detallan las tareas en el orden en que deben ser abordadas para completar la funcionalidad actual.

### Fase 3.2: Implementación de "Registrar Ejecución" (Continuación)

1.  **Backend - Crear Endpoint (Realizado):**
    -   **Tarea:** Añadir la ruta `POST /api/lab/activity-logs` en `server/routes/lab.js`.
    -   **Lógica:** La ruta debe recibir los datos del formulario, validarlos y usar una transacción de Prisma para:
        -   Crear un nuevo registro en `lab_activity_log`.
        -   Actualizar las estadísticas correspondientes en `lab_activity_metrics`.
    -   **Estado:** **Completado.**

2.  **Frontend - Crear Componente Modal (Realizado):**
    -   **Tarea:** Crear el componente `LogExecutionModal.tsx`.
    -   **Lógica:** Debe contener un formulario controlado (con `react-hook-form`) para que el profesor ingrese los detalles de la ejecución (cantidad de alumnos, valoración, notas, etc.).
    -   **Estado:** **Completado.**

3.  **Frontend - Integrar el Modal en la Página de Detalles (Tarea Actual):**
    -   **Tarea:** Modificar el archivo `client/src/app/teacher/labs/activity/[slug]/page.tsx`.
    -   **Lógica:**
        -   Importar y utilizar el componente `LogExecutionModal`.
        -   Asociar el modal al botón "Registrar Ejecución".
        -   Asegurarse de que el modal se abre correctamente y puede enviar los datos al endpoint del backend.
    -   **Estado:** **Pendiente. Esta es nuestra próxima acción.**

### Fase 3.3: Visualización de Datos de Ejecución

Una vez que se puedan registrar ejecuciones, el siguiente paso lógico es mostrar esa información.

1.  **Frontend - Mostrar Métricas Agregadas:**
    -   **Tarea:** En la página de detalles de la actividad, leer los datos del `lab_activity_metrics` (que ahora se incluyen en la respuesta del API) y mostrarlos en tarjetas de información (ej. "Veces ejecutada", "Rating Promedio").

2.  **Frontend - Mostrar Historial de Ejecuciones:**
    -   **Tarea:** En la misma página, crear una nueva sección o pestaña para mostrar un historial de las ejecuciones que el profesor ha registrado para esa actividad (`my_recent_executions`).

### Fase 4: Funcionalidades Adicionales del Módulo

Una vez completado el ciclo de registro y visualización, se pueden abordar estas características:

1.  **Gestión de Favoritos y Colecciones:** Permitir a los profesores marcar actividades como favoritas y agruparlas en colecciones personalizadas.
2.  **Reportes y Analíticas:** Crear un panel para que los directores o administradores puedan ver estadísticas de uso de los laboratorios a nivel de escuela.
3.  **Subida de Evidencias:** Ampliar el formulario de registro de ejecución para permitir a los profesores subir fotos o documentos como evidencia del trabajo realizado.

---

## 5. Principios y Convenciones Clave

-   **Gestión de la Base de Datos:** Debido a las restricciones de Supabase, **no se deben aplicar migraciones de Prisma directamente sobre el esquema `auth`**. Todas las modificaciones manuales o con scripts deben apuntar exclusivamente al esquema `public`.
-   **Autenticación en Desarrollo:** El middleware de autenticación (`server/middleware/auth.js`) utiliza un usuario "profesor" con datos fijos en modo de desarrollo para facilitar las pruebas.
-   **Datos de Prueba (Seeding):** El archivo `server/prisma/seed.js` es la fuente de verdad para los datos iniciales de desarrollo. Cualquier dato esencial para que la aplicación se inicie (como el usuario de demo o la escuela de demo) debe estar definido ahí.

---

## 9. Ejemplo de Código: Registro de Ejecución de Laboratorio

### 9.1. Ejemplo de Uso del Modal en el Frontend

```tsx
// En client/src/app/teacher/labs/activity/[slug]/page.tsx

import LogExecutionModal from "@/components/lab/LogExecutionModal";

// ...código existente...

const [showModal, setShowModal] = useState(false);

return (
  <>
    {/* ...otros componentes... */}
    <button onClick={() => setShowModal(true)}>
      Registrar Ejecución
    </button>
    <LogExecutionModal
      open={showModal}
      onClose={() => setShowModal(false)}
      activityId={activity.id}
      // otros props necesarios
    />
    {/* ...otros componentes... */}
  </>
);
```

### 9.2. Ejemplo de Llamada al Endpoint en el Modal

```tsx
// Dentro de LogExecutionModal.tsx

const onSubmit = async (data) => {
  const response = await fetch("/api/lab/activity-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      activityId: props.activityId,
      ...data,
    }),
  });
  if (response.ok) {
    // Mostrar feedback de éxito y cerrar modal
  } else {
    // Manejar error
  }
};
```

### 9.3. Ejemplo de Endpoint Backend

```js
// En server/routes/lab.js

router.post("/activity-logs", authenticateToken, async (req, res) => {
  const { activityId, alumnos, valoracion, notas } = req.body;
  // Validar datos...
  try {
    const log = await prisma.lab_activity_log.create({
      data: {
        activityId,
        alumnos,
        valoracion,
        notas,
        // otros campos...
      },
    });
    // Actualizar métricas...s
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la ejecución" });
  }
});
```

---
