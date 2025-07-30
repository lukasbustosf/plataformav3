# Guía Detallada: Usando Prisma con Supabase en EDU21

## 1. ¿Qué es Prisma y por qué lo usamos?

**Prisma** es un **ORM (Mapeador Objeto-Relacional)**. Piensa en él como un traductor inteligente entre nuestro código de JavaScript/TypeScript y la base de datos PostgreSQL de Supabase.

-   **Antes de Prisma:** Escribíamos consultas SQL manualmente en strings (`"SELECT * FROM users WHERE id = ..."`). Esto es propenso a errores de tipeo, difícil de mantener y no nos da autocompletado ni seguridad de tipos.
-   **Con Prisma:** Definimos la estructura de nuestra base de datos en un archivo especial (`schema.prisma`) y Prisma nos da un "cliente" con funciones nativas de JavaScript para hablar con la base de datos (ej. `prisma.user.findUnique(...)`).

**Ventajas Clave:**
-   **Seguridad de Tipos:** Si intentas consultar una columna que no existe, TypeScript te avisará *antes* de que el código se ejecute.
-   **Autocompletado:** El editor te sugiere los modelos y campos disponibles.
-   **Menos Errores:** Elimina los errores de sintaxis de SQL.
-   **Migraciones:** Prisma puede gestionar los cambios en la estructura de la base de datos a lo largo del tiempo.

## 2. El Desafío: La particularidad de Supabase

Aquí es donde radica la complejidad de nuestro proyecto y la razón de los problemas que enfrentamos.

Supabase no es una base de datos PostgreSQL "tonta". Tiene su propia lógica interna, especialmente para la autenticación.

-   **El Esquema `auth`:** Supabase tiene un esquema llamado `auth` donde guarda toda la información de usuarios, sesiones, etc. **Este esquema está protegido y no permite que herramientas externas como Prisma lo modifiquen.** Intentar hacerlo causa errores de permisos.
-   **El Esquema `public`:** Este es el esquema donde viven *nuestras* tablas: `lab_activity`, `schools`, etc. Aquí sí tenemos control total.

**La Conclusión Crucial:** Nuestro `schema.prisma` necesita "ver" ambos esquemas para entender las relaciones (ej. un `creator_id` en `lab_activity` se relaciona con un `id` en `auth.users`), pero **solo podemos permitir que Prisma gestione y migre el esquema `public`**.

## 3. Nuestro Flujo de Trabajo y Comandos (La "Clase")

Debido al desafío anterior, no podemos usar el flujo de trabajo más simple de Prisma. Hemos tenido que adaptarlo.

### Comando 1: `prisma db pull`

-   **¿Qué hace?:** **Introspección.** Lee la estructura actual de la base de datos remota (en Supabase) y actualiza tu archivo `schema.prisma` para que sea un reflejo exacto de ella.
-   **¿Cuándo lo usamos?:** Lo usamos cuando la "fuente de verdad" es la base de datos. Lo hicimos después de que **tú** ejecutaras el script SQL manual (`FINAL_CLEAN_PUBLIC_ONLY.sql`). El script arregló la base de datos, y con `db pull` le dijimos a Prisma: "Oye, ve a ver cómo quedó la base de datos y actualiza tu esquema".

### Comando 2: `prisma migrate dev`

-   **¿Qué hace (idealmente)?:** Compara tu `schema.prisma` con el "historial de migraciones" de Prisma. Si detecta cambios, genera un nuevo archivo de migración SQL y lo aplica a la base de datos para sincronizarlos. Es el comando principal en un proyecto estándar.
-   **¿Por qué falló para nosotros?:** Este comando es muy listo, pero también muy estricto. Al ejecutarlo, vio dos cosas:
    1.  Nuestra carpeta de migraciones local estaba vacía o no coincidía con la base de datos.
    2.  La base de datos remota en Supabase **no estaba vacía** (tenía todas las tablas del esquema `auth` y las que creamos con el script).
-   **Su conclusión fue:** "Hay un desajuste ('drift'). La única forma segura de arreglarlo es borrar toda la base de datos (resetearla) y empezar de cero aplicando mi historial".
-   **Tu acción fue la correcta:** Cancelaste la operación porque un reseteo habría borrado el esquema `auth` de Supabase, rompiendo la autenticaci��n por completo.

### Comando 3: `rmdir /s /q` (o `rm -rf` en Mac/Linux)

-   **¿Qué hace?:** Borra una carpeta y todo su contenido de forma forzada y silenciosa.
-   **¿Por qué lo usamos?:** Lo usamos para borrar la carpeta `server/prisma/migrations`. El objetivo era eliminar el "historial de migraciones" local de Prisma para que olvidara su estado anterior y pudiéramos empezar de cero, pero **solo en el historial de Prisma, no en la base de datos**.

### Comando 4: `prisma db push`

-   **¿Qué hace?:** Es una herramienta más directa que `migrate dev`. **No usa migraciones.** Simplemente empuja el estado de tu `schema.prisma` a la base de datos. Si una tabla no existe, la crea. Si una columna falta, la añade.
-   **¿Por qué lo usamos?:** Lo usamos como un truco para "sellar" el estado. Después de que `db pull` sincronizó nuestro `schema.prisma` y la base de datos ya era correcta, `db push` simplemente confirmó que no había nada que cambiar ("The database is already in sync"). Esto nos permitió eludir el estricto mecanismo de `migrate dev` y dejar a Prisma en un estado consistente.

### Comando 5: `prisma db seed`

-   **¿Qué hace?:** Ejecuta el script definido en la sección `prisma.seed` de tu `package.json`. En nuestro caso, ejecuta `node prisma/seed.js`.
-   **¿Cuándo lo usamos?:** Es el último paso. Una vez que la ESTRUCTURA de la base de datos es correcta, este comando la PUEBLA con los DATOS iniciales necesarios para el desarrollo (el usuario demo, la escuela demo, el kit de laboratorio, etc.).

## 4. Buenas Prácticas y lo que NO se debe hacer

-   **SÍ:** Considera siempre el archivo `schema.prisma` como la **única fuente de verdad** para la estructura de tu base de datos `public`.
-   **SÍ:** Después de cambiar `schema.prisma` (ej. añadir un campo a un modelo), el siguiente paso debería ser `prisma migrate dev`. Ahora que hemos establecido una base limpia, este comando debería funcionar para cambios futuros en el esquema `public`.
-   **SÍ:** Usa `prisma db seed` para crear o resetear los datos de desarrollo.

-   **NO, NUNCA:** **Nunca ejecutes `prisma migrate reset` en este proyecto.** Este comando intentará borrar toda la base de datos, incluyendo el esquema `auth` de Supabase, y romperá todo el sistema de autenticación.
-   **NO:** **No modifiques la estructura de la base de datos directamente desde el panel de Supabase.** Si añades una columna allí, Prisma no lo sabrá y tendrás un "drift" de nuevo. Todos los cambios de estructura deben empezar en `schema.prisma`.
-   **NO:** **Nunca intentes crear una migración que modifique el esquema `auth`.** Prisma es lo suficientemente inteligente como para no hacerlo por defecto, pero cualquier intento manual está prohibido.

Espero que esta guía detallada aclare el proceso, los comandos y las reglas a seguir. ¡No dudes en preguntar si algo no quedó claro!
