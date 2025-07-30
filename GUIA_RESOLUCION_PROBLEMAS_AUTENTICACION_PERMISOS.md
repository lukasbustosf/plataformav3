# 🔐 Guía de Resolución de Problemas de Autenticación y Permisos - EDU21

## 📋 Índice
1. [Problema Resuelto](#problema-resuelto)
2. [Diagnóstico Paso a Paso](#diagnóstico-paso-a-paso)
3. [Checklist de Verificación](#checklist-de-verificación)
4. [Herramientas de Debugging](#herramientas-de-debugging)
5. [Patrones de Solución](#patrones-de-solución)
6. [Archivos Críticos](#archivos-críticos)
7. [Comandos Útiles](#comandos-útiles)
8. [Lecciones Aprendidas](#lecciones-aprendidas)

---

## 🎯 Problema Resuelto

### **Descripción del Problema**
- **Error**: 403 Forbidden - "No tienes permisos para editar esta actividad"
- **Síntoma**: Frontend mostraba login correcto como `SUPER_ADMIN_FULL`, pero backend recibía rol `TEACHER`
- **Causa Raíz**: Desincronización entre frontend y backend en la gestión de tokens de autenticación

### **Flujo del Problema**
1. **Frontend**: Guardaba correctamente el token en `localStorage`
2. **Backend**: Recibía `Bearer null` en lugar del token real
3. **Resultado**: Backend identificaba al usuario como `TEACHER` en lugar de `SUPER_ADMIN_FULL`

---

## 🔍 Diagnóstico Paso a Paso

### **1. Identificación del Síntoma**
```javascript
// ❌ Error que se mostraba
Error: No tienes permisos para editar esta actividad del sistema. 
Solo los Super Administradores pueden editar actividades sin creador.
```

### **2. Análisis de Logs Frontend**
```javascript
// ✅ Token se guardaba correctamente
✅ Token guardado en localStorage: demo-token-superadmin-1753532482223

// ❌ Pero se leía como null
🔍 [DEBUG] Token leído de localStorage: null
🔍 [DEBUG] Token substring: undefined...
```

### **3. Análisis de Logs Backend**
```javascript
// ❌ Backend recibía token null
🔍 [DEBUG PUT] Token recibido: Bearer null
🔍 [DEBUG PUT] User recibido: { role: 'TEACHER' }
```

### **4. Rastreo del Flujo de Datos**
1. **Login** → Token generado y guardado en `localStorage`
2. **Fetch request** → Token leído de `localStorage` (resultado: `null`)
3. **Backend** → Recibe `Bearer null` y asigna rol por defecto

---

## ✅ Checklist de Verificación

### **Frontend**
- [ ] ¿El login muestra el rol correcto?
- [ ] ¿El token se guarda en `localStorage`?
- [ ] ¿El fetch lee el token correctamente?
- [ ] ¿Los headers de autorización están presentes?
- [ ] ¿No hay funciones que borren `localStorage` después de guardar?

### **Backend**
- [ ] ¿El middleware de autenticación recibe el token?
- [ ] ¿El token se parsea correctamente?
- [ ] ¿El rol se asigna correctamente?
- [ ] ¿Los permisos se evalúan correctamente?
- [ ] ¿Los logs muestran consistencia?

### **Flujo de Datos**
- [ ] ¿El token persiste entre requests?
- [ ] ¿El orden de operaciones es correcto?
- [ ] ¿No hay race conditions?
- [ ] ¿Los logs muestran el flujo completo?

---

## 🛠️ Herramientas de Debugging

### **Frontend Debugging**
```javascript
// Verificar localStorage
console.log('Token en localStorage:', localStorage.getItem('auth_token'))
console.log('User data en localStorage:', localStorage.getItem('user_data'))

// Verificar headers en fetch
console.log('Headers enviados:', {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
})

// Verificar estado de autenticación
console.log('Auth state:', useAuthStore.getState())
```

### **Backend Debugging**
```javascript
// Verificar token recibido
console.log('Token recibido:', req.headers.authorization)

// Verificar usuario parseado
console.log('User recibido:', req.user)

// Verificar permisos
console.log('Permisos:', {
  userRole: req.user.role,
  isSuperAdmin: userRole === 'SUPER_ADMIN_FULL',
  isCreator: existingActivity.creator_id === userId,
  hasNoCreator: existingActivity.creator_id === null
})
```

---

## 🎯 Patrones de Solución

### **1. Desincronización de Tokens**
- **Síntoma**: Frontend muestra un rol, backend recibe otro
- **Causa**: Token no se envía o se borra antes del request
- **Solución**: Verificar persistencia en `localStorage` y orden de operaciones

### **2. Permisos Incorrectos**
- **Síntoma**: Usuario con permisos recibe 403
- **Causa**: Lógica de permisos mal configurada o roles mal asignados
- **Solución**: Revisar middleware de autorización y lógica de permisos

### **3. Middleware de Autenticación**
- **Síntoma**: Token válido pero usuario no autenticado
- **Causa**: Middleware no parsea correctamente el token
- **Solución**: Verificar lógica de parsing y asignación de roles

### **4. Orden de Operaciones**
- **Síntoma**: Token se guarda pero no persiste
- **Causa**: Funciones que limpian `localStorage` llamadas en orden incorrecto
- **Solución**: Asegurar que `clearAuth()` se llame ANTES de guardar nuevos datos

---

## 📁 Archivos Críticos

### **Frontend**
1. **`client/src/app/login/page.tsx`**
   - Generación y guardado de tokens
   - Orden de operaciones en login
   - Persistencia en `localStorage`

2. **`client/src/store/auth.ts`**
   - Gestión de estado de autenticación
   - Función `clearAuth()` y su impacto
   - Función `initializeAuth()`

3. **`client/src/app/admin/lab/activities/edit/[id]/page.tsx`**
   - Uso de tokens en requests
   - Headers de autorización
   - Manejo de errores

### **Backend**
1. **`server/middleware/auth.js`**
   - Parsing de tokens
   - Asignación de roles
   - Validación de autenticación

2. **`server/routes/lab.js`**
   - Lógica de permisos
   - Validación de roles
   - Manejo de errores de autorización

---

## 💻 Comandos Útiles

### **Gestión de Procesos**
```bash
# Verificar procesos en puerto
netstat -ano | findstr :5000

# Matar proceso específico
taskkill /f /pid <PID>

# Verificar puertos en uso
netstat -ano | findstr :3000
```

### **Reinicio de Servicios**
```bash
# Reiniciar servidor backend
cd server && node index.js

# Reiniciar frontend
cd client && npm run dev

# Reiniciar ambos (PowerShell)
.\restart-complete.ps1
```

### **Debugging de Base de Datos**
```bash
# Verificar conexión a Supabase
node test-supabase-connection.js

# Verificar tablas
node verify-tables.js
```

---

## 🎓 Lecciones Aprendidas

### **1. Orden de Operaciones Crítico**
```javascript
// ❌ INCORRECTO - Causa problemas
localStorage.setItem('auth_token', demoToken)
useAuthStore.getState().clearAuth()  // ¡BORRA EL TOKEN!

// ✅ CORRECTO - Solución
useAuthStore.getState().clearAuth()  // Limpiar primero
localStorage.setItem('auth_token', demoToken)  // Guardar después
```

### **2. Logging Exhaustivo**
- **Frontend**: Loggear cada paso del flujo de autenticación
- **Backend**: Loggear token recibido, usuario parseado y permisos
- **Consistencia**: Verificar que los logs muestren el flujo completo

### **3. Verificación de Persistencia**
- Siempre verificar que `localStorage` mantenga los datos
- Confirmar que no hay funciones que borren datos críticos
- Validar que el orden de operaciones sea correcto

### **4. Debugging Sistemático**
1. **Identificar el síntoma** (error 403, rol incorrecto)
2. **Rastrear el flujo** (frontend → backend)
3. **Verificar cada paso** (login, guardado, lectura, envío, parsing)
4. **Encontrar la causa raíz** (orden de operaciones, funciones que borran)
5. **Aplicar la solución** (corregir orden, eliminar funciones problemáticas)

### **5. Documentación de Cambios**
- Mantener logs de debugging durante el desarrollo
- Documentar patrones de solución encontrados
- Crear checklists para futuros problemas similares

---

## 🚀 Mejores Prácticas

### **Autenticación**
- ✅ Usar tokens JWT con expiración
- ✅ Validar tokens en cada request
- ✅ Implementar refresh tokens
- ✅ Loggear intentos de autenticación fallidos

### **Autorización**
- ✅ Implementar RBAC (Role-Based Access Control)
- ✅ Validar permisos en cada endpoint
- ✅ Usar middleware de autorización
- ✅ Loggear intentos de acceso no autorizado

### **Debugging**
- ✅ Loggear cada paso del flujo de autenticación
- ✅ Verificar persistencia de datos críticos
- ✅ Validar orden de operaciones
- ✅ Documentar patrones de solución

---

## 📞 Contacto y Soporte

Para problemas relacionados con autenticación y permisos:

1. **Revisar esta guía** primero
2. **Verificar los logs** de frontend y backend
3. **Aplicar el checklist** de verificación
4. **Documentar el problema** y la solución encontrada

---

*Última actualización: 26 de Julio, 2025*
*Versión: 1.0* 