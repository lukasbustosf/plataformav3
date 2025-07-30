# CONFIGURACIÓN PARA PRODUCCIÓN - ACTIVIDADES LAB

## ⚠️ DIFERENCIAS CRÍTICAS ENTRE DESARROLLO Y PRODUCCIÓN

### 🔧 DESARROLLO (Local):
- `NODE_ENV=development`
- Tokens demo funcionan automáticamente
- Autenticación simplificada para testing
- Base de datos local o de desarrollo

### 🚀 PRODUCCIÓN (Vercel/Railway):
- `NODE_ENV=production`
- **NO funcionan tokens demo**
- Autenticación real con JWT
- Base de datos de producción

---

## 🚨 PROBLEMAS QUE TENDRÁS EN PRODUCCIÓN

### 1. **Tokens Demo No Funcionan**
```javascript
// En desarrollo (✅ Funciona):
if (process.env.NODE_ENV === 'development') {
  // Tokens demo procesados
}

// En producción (❌ No funciona):
// Los tokens demo son ignorados
```

### 2. **Autenticación Real Requerida**
- Usuarios deben tener cuentas reales en Supabase
- JWT tokens válidos de Supabase
- Middleware de autenticación estricto

### 3. **Variables de Entorno Diferentes**
- `NODE_ENV=production`
- URLs de producción
- Claves de API de producción

---

## ✅ CONFIGURACIÓN CORRECTA PARA PRODUCCIÓN

### Paso 1: Variables de Entorno de Producción

**Archivo:** `server/.env` (producción)
```bash
# CRÍTICO: Cambiar a producción
NODE_ENV=production

# URLs de producción
SUPABASE_URL=https://jzshtjlkidiclisgaqyw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6c2h0amxraWRpY2xpc2dhcXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTgxODIsImV4cCI6MjA2NzQzNDE4Mn0.5ucPKv4F_j6x6gbNoUWeVk5_1OojlJpPRcUTWa0lrpc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6c2h0amxraWRpY2xpc2dhcXl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzg1ODE4MiwiZXhwIjoyMDY3NDM0MTgyfQ.GP8cLryTZwfxIBZPR6fdOKkR-Pw-ejQWIyx4snOSsFE

# Base de datos de producción
DATABASE_URL="postgresql://postgres.jzshtjlkidiclisgaqyw:84788990Lbf@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# JWT Secret para producción
JWT_SECRET=gvlDczYCIB6qAI+SFbM8zrO6MBkEBDl6Y+geX2p/axvFIluof3IsjH13DTahvKNEe1lPUyJHICd8PLjHCoXpXQ

# Puerto de producción
PORT=5000
```

### Paso 2: Verificar Middleware de Autenticación

**Archivo:** `server/middleware/auth.js`
```javascript
// En producción, solo JWT real funciona
if (process.env.NODE_ENV === 'production') {
  // Solo autenticación JWT real
  // Los tokens demo son ignorados
}
```

### Paso 3: Configurar Frontend para Producción

**Archivo:** `client/src/lib/api.ts`
```typescript
// En producción, usar URL de producción
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-servidor-produccion.com' 
  : 'http://localhost:5000';
```

---

## 🔧 PASOS PARA MIGRAR A PRODUCCIÓN

### 1. **Crear Usuarios Reales en Supabase**
```sql
-- Crear usuarios reales en la tabla auth.users
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('profesor@escuela.edu', 'password_hash', NOW());
```

### 2. **Configurar Autenticación Real**
```javascript
// En el frontend, usar login real
const loginResponse = await api.client.post('/auth/login', {
  email: 'profesor@escuela.edu',
  password: 'password_real'
});
```

### 3. **Verificar Rutas de Producción**
```javascript
// Backend debe estar en: https://tu-servidor.com
// Frontend debe estar en: https://tu-app.com
```

---

## 🚀 DEPLOYMENT CHECKLIST

### ✅ Antes del Deploy:
- [ ] `NODE_ENV=production` en todas las variables de entorno
- [ ] URLs de producción configuradas
- [ ] Base de datos de producción conectada
- [ ] Usuarios reales creados en Supabase
- [ ] JWT secret configurado
- [ ] Frontend configurado para usar backend de producción

### ✅ Durante el Deploy:
- [ ] Verificar que el servidor inicie correctamente
- [ ] Probar autenticación con usuario real
- [ ] Verificar que las actividades se carguen
- [ ] Probar todas las funcionalidades

### ✅ Post-Deploy:
- [ ] Monitorear logs de errores
- [ ] Verificar rendimiento
- [ ] Probar en diferentes navegadores
- [ ] Verificar en dispositivos móviles

---

## 🔍 DIAGNÓSTICO DE PRODUCCIÓN

### Script para verificar producción:
```javascript
// test-produccion-actividades.js
const http = require('http');

async function testProduccion() {
  console.log('🚀 DIAGNÓSTICO PRODUCCIÓN ACTIVIDADES LAB');
  
  const PROD_URL = 'https://tu-servidor-produccion.com';
  
  // 1. Verificar servidor
  try {
    const response = await makeRequest(`${PROD_URL}/api/lab/activities`);
    console.log('✅ Servidor responde:', response.status);
  } catch (error) {
    console.log('❌ Servidor no responde');
  }
  
  // 2. Verificar autenticación
  try {
    const response = await makeRequest(`${PROD_URL}/api/lab/activities`, {
      'Authorization': 'Bearer token-real-jwt'
    });
    console.log('✅ Autenticación funciona:', response.status);
  } catch (error) {
    console.log('❌ Error de autenticación');
  }
}

testProduccion();
```

---

## ⚠️ PROBLEMAS COMUNES EN PRODUCCIÓN

### 1. **Error 401 - No Autorizado**
**Causa:** Usuario no logueado o token inválido
**Solución:** Verificar login real y JWT válido

### 2. **Error 500 - Error del Servidor**
**Causa:** Variables de entorno incorrectas
**Solución:** Verificar `NODE_ENV=production` y `DATABASE_URL`

### 3. **Actividades No Se Cargan**
**Causa:** Problema de autenticación o base de datos
**Solución:** Verificar usuario real y permisos en Supabase

### 4. **CORS Errors**
**Causa:** Dominios no configurados
**Solución:** Configurar CORS para dominios de producción

---

## 🎯 RESUMEN PARA PRODUCCIÓN

### ✅ Lo que SÍ funciona:
- Autenticación real con JWT
- Base de datos de producción
- Usuarios reales de Supabase
- Todas las funcionalidades del sistema

### ❌ Lo que NO funciona:
- Tokens demo (`demo-token-*`)
- Login con credenciales demo
- `NODE_ENV=development`

### 🔧 Configuración crítica:
1. **NODE_ENV=production**
2. **Usuarios reales en Supabase**
3. **JWT tokens válidos**
4. **URLs de producción**

**Estado:** ✅ LISTO PARA PRODUCCIÓN (con configuración correcta) 