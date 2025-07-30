# Guía de Tareas Pendientes y Priorizadas para Producción EDU21

## Objetivo
Dejar una versión estable y funcional de la plataforma en producción, con solo los módulos y rutas aprobadas visibles, y un entorno de desarrollo limpio para continuar el trabajo futuro.

---

## 1. Limpieza y Visibilidad del Menú (Prioridad Máxima)

- [ ] **Dejar visibles solo los siguientes módulos en el menú:**
  - Laboratorios Móviles (solo rutas funcionales: catálogo, detalle, registro de ejecución, historial, etc.)
  - Evaluación → Submódulo “Evaluación gamificada” (`/teacher/oa1-games`)
  -http://localhost:3000/settings 
  -y "http://localhost:3000/help" hay que ver bien que dejamos por que "tutoriales" deberia decir "proximamente"en "contacto" de esa mima pagina, la informacion de contacto esta erronea, podrias agregar la real Fono central centro de ayuda "232144445" por favor. 

- [ ] **Ocultar o eliminar del menú:**
  - Todos los demás módulos y submódulos (tracking, dashboard, reportes, IA, etc.) que no estén listos para producción.
- [ ] **Verificar que no haya rutas rotas o accesibles por URL directa** (404, errores de permisos, etc.).

---

## 2. QA y Pruebas de Flujos Críticos (Prioridad Alta)

- [ ] **Laboratorios Móviles:**
  - Registro de ejecución (con y sin evidencia).
  - Visualización de historial y métricas.
  - revisar filtros de "http://localhost:3000/teacher/labs/activities" falta agregar filtrar por material didactico , 
  - Visualización de actividades y detalles.
- [ ] **Evaluación gamificada:**
  - Acceso y uso correcto de `/teacher/oa1-games`.
  - Visualización y funcionamiento de las evaluaciones gamificadas.
  
- [ ] **Datos de seed:**
  - Verificar que los datos de demo/seed estén cargados y visibles para pruebas/demo.

---

## 3. Preparación del Entorno de Producción (Prioridad Alta)

- [ ] **Build de producción:**
  - Ejecutar `next build` y `next start` para asegurar que la app corre sin errores en modo producción.
- [ ] **Backend en modo producción:**
  - Verificar que el backend corre en el entorno y puerto correctos.
  - Revisar variables de entorno para producción.
- [ ] **Revisar configuración de CORS, uploads y rutas estáticas.**

---

## 4. Documentación y Comunicación (Prioridad Media)

- [ ] **Documentar en README o archivo aparte:**
  - Qué módulos están en producción y cuáles en desarrollo.
  - Qué rutas deben estar ocultas y por qué.
  - Instrucciones para desarrolladores sobre cómo activar/desactivar módulos en el menú.

---

## 5. Sistema de Seeding Modular (Prioridad Media/Baja)

- [ ] **Crear carpeta `server/prisma/seed-data/activities`**
- [ ] **Convertir cada actividad en un archivo JS individual** dentro de esa carpeta.
- [ ] **Actualizar `server/prisma/seed.js` para:**
  - Leer todos los archivos de la carpeta.
  - Usar `prisma.lab_activity.upsert()` para poblar la base de datos.
- [ ] **Probar el seed en entorno de desarrollo y producción.**

---

## 6. (Opcional) Mejoras Futuras y Desarrollo

- [ ] Implementar reportes de uso del laboratorio (cuando la plataforma esté estable).
- [ ] Reactivar y testear módulos ocultos cuando estén listos.
- [ ] Mejorar el sistema de evidencias, analíticas, y otros features según feedback de usuarios.

---

## Notas Finales
- **No ejecutar nunca `prisma migrate reset` en producción.**
- **No modificar el esquema `auth` desde Prisma.**
- **Todos los cambios estructurales deben pasar por `schema.prisma` y migraciones controladas.**
- **Esta guía es la referencia única para la estabilización y despliegue. No saltarse pasos ni agregar features fuera de este plan sin revisión.** 