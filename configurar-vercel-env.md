# Configuración de Variables de Entorno en Vercel

## 🚨 PROBLEMA IDENTIFICADO

La variable `NEXT_PUBLIC_API_URL` no está configurada en Vercel, causando que el frontend use `http://localhost:5000` como fallback.

### URLs Incorrectas:
```
http://localhost:5000/lab/activities
http://localhost:5000/lab/materials
```

### URLs Correctas:
```
https://plataformav3.vercel.app/lab/activities
https://plataformav3.vercel.app/lab/materials
```

---

## ✅ SOLUCIÓN

### Paso 1: Configurar Variables de Entorno en Vercel

1. **Ir al Dashboard de Vercel:**
   - https://vercel.com/dashboard
   - Seleccionar el proyecto `plataformav3`

2. **Ir a Settings > Environment Variables:**
   - Agregar la siguiente variable:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://plataformav3.vercel.app
   Environment: Production
   ```

3. **Redeploy:**
   - Hacer un nuevo deploy después de configurar la variable

---

## 🔧 CONFIGURACIÓN ALTERNATIVA

Si no se puede acceder al dashboard de Vercel, se puede configurar via CLI:

```bash
# Instalar Vercel CLI si no está instalado
npm i -g vercel

# Login a Vercel
vercel login

# Configurar variable de entorno
vercel env add NEXT_PUBLIC_API_URL production

# Valor a ingresar: https://plataformav3.vercel.app

# Redeploy
vercel --prod
```

---

## 🧪 VERIFICACIÓN

Después de configurar la variable, las URLs deberían ser:

```
✅ https://plataformav3.vercel.app/lab/activities
✅ https://plataformav3.vercel.app/lab/materials
```

En lugar de:

```
❌ http://localhost:5000/lab/activities
❌ http://localhost:5000/lab/materials
```

---

## 📋 PASOS PARA IMPLEMENTAR

1. **Acceder al dashboard de Vercel**
2. **Configurar NEXT_PUBLIC_API_URL**
3. **Hacer redeploy**
4. **Verificar que las actividades se cargan correctamente**

**Estado:** ⏳ Pendiente de configuración en Vercel 