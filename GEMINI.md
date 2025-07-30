# Guía Rápida para Añadir Nuevos Juegos

Este documento contiene las instrucciones y lecciones aprendidas para asegurar que la creación de nuevos juegos en la plataforma EDU21 sea fluida y sin errores.

## Principio Clave: El Registro Dual

Cada nuevo juego debe ser "registrado" en dos lugares clave del sistema para funcionar correctamente, especialmente en el entorno de desarrollo y demostración.

### 1. Registro en el Backend (Servidor)

*   **Objetivo:** Permitir el acceso directo al juego a través de su URL (ej. `/student/games/nuevo-juego/play`) sin errores de "Sesión no encontrada".
*   **Acción:** Asegurarse de que el servidor pueda crear una sesión de juego de demostración dinámica para el nuevo ID del juego.
*   **Archivo Clave:** `server/routes/game.js`
*   **Implementación:** Localiza la ruta `GET /api/game/:id`. Dentro de esta, añade o verifica la lógica que genera una sesión temporal para el ID de tu nuevo juego. Lo ideal es tener una regla general (ej. que reconozca un prefijo como `oa1-mat-`) para no tener que añadir cada juego manualmente.

### 2. Registro en el Frontend (Cliente)

*   **Objetivo:** Mostrar el componente de React correcto para el juego correspondiente a la URL.
*   **Acción:** Añadir una condición específica en la lógica de renderizado que cargue el componente de tu nuevo juego.
*   **Archivo Clave:** `client/src/app/student/games/[id]/play/page.tsx`
*   **Implementación:** Dentro de la función `renderGameComponent`, añade un nuevo bloque `else if (gameId === 'id-de-tu-nuevo-juego')`.
*   **¡IMPORTANTE!** Esta nueva condición debe ir **antes** de cualquier condición más genérica (como las que revisan el `theme` o `engine_id`). El orden es crucial para que la lógica más específica se ejecute primero.

---

## Flujo de Trabajo y Operaciones

Para mantener un flujo de trabajo seguro y predecible, seguiré la siguiente regla operativa:

*   **No iniciaré servicios por mi cuenta:** No ejecutaré comandos para iniciar, reiniciar o compilar el servidor (`node index.js`), el cliente (`npm run dev`), o cualquier proceso de construcción (`npm run build`).
*   **Siempre solicitaré tu acción:** Te pediré explícitamente que realices estas acciones cuando sea necesario. Por ejemplo:
    *   "He aplicado los cambios en el servidor. Por favor, reinícialo para que surtan efecto."
    *   "He corregido un error en el cliente. Por favor, verifica que el proceso de `npm run dev` se haya actualizado o reinícialo si es necesario."
