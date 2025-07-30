# 🔧 Configuración de Variables de Entorno en Vercel

## 📋 Variables Requeridas

Para que EDU21 funcione en Vercel, necesitas configurar estas variables de entorno:

### **1. Ve a tu proyecto en Vercel:**
- Dashboard > Tu proyecto EDU21 > Settings > Environment Variables

### **2. Agrega estas variables:**

```
SUPABASE_URL=https://jximjwzcivxnoirejlpc.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
OPENAI_API_KEY=tu_openai_api_key_aqui
FRONTEND_URL=https://tu-dominio-vercel.vercel.app
```

### **3. Configuración por entorno:**
- **Production**: Todas las variables
- **Preview**: Todas las variables  
- **Development**: Todas las variables

### **4. Obtener credenciales de Supabase:**
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto EDU21
3. Settings > API
4. Copia:
   - Project URL → `SUPABASE_URL`
   - anon public → `SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

### **5. Obtener OpenAI API Key:**
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Copia la key → `OPENAI_API_KEY`

### **6. Después de configurar:**
1. Ve a Deployments
2. Haz "Redeploy" del último deployment
3. Verifica que funcione correctamente

## 🚨 Nota Importante
Si las credenciales de Supabase no funcionan, verifica que:
- El proyecto esté activo (no suspendido)
- Las credenciales sean las correctas
- El proyecto tenga las tablas necesarias 