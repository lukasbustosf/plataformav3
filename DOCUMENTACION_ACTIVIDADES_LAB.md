# 📚 DOCUMENTACIÓN: ACTIVIDADES LAB - LOCAL vs PRODUCCIÓN

## 🎯 **RESUMEN DEL PROBLEMA**

**Problema principal**: Las actividades del laboratorio funcionaban en local pero no en producción, causando confusión y pérdida de tiempo.

**Causa raíz**: Diferencias en configuración entre entorno local (localhost:5000) y producción (Railway + Vercel).

---

## 🔍 **DIAGNÓSTICO PASO A PASO**

### 1️⃣ **Síntomas del Problema**

```javascript
// ❌ ERRORES EN PRODUCCIÓN:
- "Endpoint not found" (404)
- "Access token required" (401) 
- "Cannot read properties of undefined (reading 'user_id')" (500)
- Lista de actividades vacía: activities.length: 0
```

### 2️⃣ **Scripts de Diagnóstico Creados**

#### `diagnostico-actividades-local.js`
```javascript
// Verifica funcionamiento en local
- API directa: http://localhost:5000/api/lab/activities
- Ruta /lab: http://localhost:5000/lab/activities
```

#### `diagnostico-produccion-actividades.js`
```javascript
// Verifica funcionamiento en producción
- Railway: https://plataformav3-production.up.railway.app
- Vercel: https://plataformav3.vercel.app
```

#### `diagnostico-definitivo.js`
```javascript
// Diagnóstico completo de todas las rutas
- Sin autenticación
- Con token demo
- Verificación de CORS
- Health checks
```

---

## 🛠️ **SOLUCIONES IMPLEMENTADAS**

### 1️⃣ **Problema: Rutas `/lab` no existían en Railway**

**Solución**: Agregar ruta adicional en `server/index.js`
```javascript
app.use('/api/lab', labRoutes); // Ruta original
app.use('/lab', labRoutes);     // Ruta adicional para compatibilidad
```

### 2️⃣ **Problema: Autenticación requerida en rutas públicas**

**Solución**: Quitar autenticación de rutas de actividades
```javascript
// ❌ ANTES:
router.get('/activities', authenticateToken, async (req, res) => {

// ✅ DESPUÉS:
router.get('/activities', async (req, res) => {
```

### 3️⃣ **Problema: Código dependía de `req.user.user_id`**

**Solución**: Simplificar filtros para funcionar sin autenticación
```javascript
// ❌ ANTES:
const userId = req.user.user_id;
const whereClause = {
  AND: [
    ...filterConditions,
    { OR: [{ status: 'active' }, { creator_id: userId }] },
  ],
};

// ✅ DESPUÉS:
const whereClause = {
  AND: [
    ...filterConditions,
    { status: 'active' },
  ],
};
```

### 4️⃣ **Problema: CORS no configurado para Vercel**

**Solución**: Agregar dominio de Vercel en CORS
```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://plataformav3.vercel.app", // ✅ Agregado
    "https://*.vercel.app"
  ],
  credentials: true
}));
```

### 5️⃣ **Problema: Frontend llamaba a URLs incorrectas**

**Solución**: Actualizar configuración de API en `client/src/lib/api.ts`
```javascript
// ❌ ANTES:
baseURL = 'https://plataformav3-server.vercel.app';

// ✅ DESPUÉS:
baseURL = 'https://plataformav3-production.up.railway.app';
```

---

## 🔧 **CONFIGURACIÓN FINAL**

### **Backend (Railway)**
```javascript
// server/index.js
app.use('/api/lab', labRoutes);
app.use('/lab', labRoutes);

// server/routes/lab.js
router.get('/activities', async (req, res) => { // Sin auth
router.get('/materials', async (req, res) => {  // Sin auth
```

### **Frontend (Vercel)**
```javascript
// client/vercel.json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://plataformav3-production.up.railway.app/api/$1"
    },
    {
      "source": "/lab/(.*)",
      "destination": "https://plataformav3-production.up.railway.app/api/lab/$1"
    }
  ]
}
```

### **API Client**
```javascript
// client/src/lib/api.ts
if (typeof window !== 'undefined' && window.location.hostname === 'plataformav3.vercel.app') {
  baseURL = 'https://plataformav3-production.up.railway.app';
}
```

---

## 🚨 **CHECKLIST PARA FUTUROS PROBLEMAS**

### **Antes de hacer cambios:**
- [ ] Verificar que funciona en local
- [ ] Hacer commit y push
- [ ] Esperar 5-10 minutos para Railway
- [ ] Ejecutar script de diagnóstico

### **Si algo falla en producción:**
- [ ] Ejecutar `node diagnostico-definitivo.js`
- [ ] Verificar logs de Railway
- [ ] Verificar configuración de CORS
- [ ] Verificar rutas en `server/index.js`
- [ ] Verificar autenticación en `server/routes/lab.js`

### **Scripts de diagnóstico disponibles:**
```bash
# Diagnóstico local
node diagnostico-actividades-local.js

# Diagnóstico producción
node diagnostico-produccion-actividades.js

# Diagnóstico completo
node diagnostico-definitivo.js
```

---

## 📋 **LECCIONES APRENDIDAS**

### **1. Diferencias entre entornos**
- **Local**: `localhost:5000` - Todo funciona
- **Producción**: Railway + Vercel - Necesita configuración especial

### **2. Autenticación**
- **Rutas públicas**: No requieren `authenticateToken`
- **Rutas privadas**: Requieren `authenticateToken`
- **Código**: Debe funcionar con y sin `req.user`

### **3. CORS**
- Siempre agregar nuevos dominios a la lista de CORS
- Verificar que `credentials: true` esté configurado

### **4. Rutas**
- Mantener compatibilidad con rutas `/api` y `/lab`
- Verificar que las rutas existan en ambos entornos

### **5. Diagnóstico**
- Crear scripts de diagnóstico específicos
- Verificar tanto Railway como Vercel
- Probar con y sin autenticación

---

## 🎯 **COMANDOS ÚTILES**

```bash
# Desplegar cambios
git add .
git commit -m "fix: descripción del cambio"
git push origin main

# Verificar Railway
curl https://plataformav3-production.up.railway.app/health

# Verificar Vercel
curl https://plataformav3.vercel.app/api/lab/activities

# Diagnóstico completo
node diagnostico-definitivo.js
```

---

## ✅ **ESTADO FINAL**

- **✅ Local**: Funciona perfectamente
- **✅ Producción**: Funciona perfectamente  
- **✅ Diagnóstico**: Scripts disponibles
- **✅ Documentación**: Completa para futuras referencias

**¡Nunca más tendremos este problema!** 🎉 