# PROMPT: Solución Definitiva para Path Aliases en Vercel

## 🚨 PROBLEMA CRÍTICO
Vercel no puede resolver path aliases (`@/`) en un monorepo Next.js, aunque funciona perfectamente en local.

## 📋 CONTEXTO COMPLETO

### Estructura del Proyecto (Monorepo)
```
plataforma-edu21/
├── client/                    # Frontend Next.js
│   ├── src/
│   │   ├── store/auth.ts     # ✅ Existe
│   │   ├── components/
│   │   │   ├── layout/DashboardLayout.tsx  # ✅ Existe
│   │   │   └── ui/Button.tsx # ✅ Existe
│   │   └── app/
│   │       └── admin/
│   │           └── access-policies/page.tsx # ❌ No encuentra @/store/auth
│   ├── tsconfig.json         # Configuración TypeScript
│   ├── next.config.js        # Configuración Next.js
│   └── package.json          # Dependencias frontend
├── server/                   # Backend Node.js
├── vercel.json              # Configuración Vercel
├── .vercelignore            # Archivos ignorados por Vercel
├── tsconfig.json            # Configuración TypeScript raíz
└── package-backend.json     # Dependencias backend (renombrado)
```

### Configuraciones Actuales

#### 1. client/tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "bundler"
  }
}
```

#### 2. client/next.config.js
```javascript
const path = require('path');

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  }
}
```

#### 3. vercel.json (raíz)
```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/.next",
  "installCommand": "cd client && npm install",
  "devCommand": "cd client && npm run dev",
  "framework": "nextjs"
}
```

#### 4. .vercelignore (raíz)
```
server/
package-backend.json
tests/
*.md
scripts/
node_modules/
.next/
.env*
```

### Error Específico en Vercel
```
Module not found: Can't resolve '@/store/auth'
Module not found: Can't resolve '@/components/layout/DashboardLayout'
Module not found: Can't resolve '@/components/ui/Button'
```

### Lo que SÍ funciona en local
- ✅ `npm run build` en `client/` funciona perfectamente
- ✅ Path aliases resueltos correctamente
- ✅ No hay errores de TypeScript
- ✅ Todos los imports funcionan

### Lo que NO funciona en Vercel
- ❌ Vercel no puede resolver `@/` paths
- ❌ Build falla con errores de webpack
- ❌ Mismo código que funciona en local

## 🎯 OBJETIVO
Encontrar una solución **DEFINITIVA** que permita a Vercel resolver path aliases correctamente en este monorepo.

## 🔍 HIPÓTESIS DEL PROBLEMA

### Posibles Causas:
1. **Vercel ejecuta desde la raíz** en lugar de `client/`
2. **Conflicto entre tsconfig.json** de raíz y client
3. **Webpack no lee la configuración** correctamente en Vercel
4. **Problema con monorepo** y resolución de módulos
5. **Vercel ignora next.config.js** en subdirectorio

### Lo que hemos intentado:
- ✅ Configurar webpack aliases explícitamente
- ✅ Múltiples configuraciones de tsconfig.json
- ✅ .vercelignore para ignorar archivos innecesarios
- ✅ vercel.json con comandos específicos
- ✅ Renombrar package.json raíz

## 🚀 SOLUCIONES A PROBAR

### Opción 1: Configuración Absoluta en Vercel
```json
// vercel.json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/.next",
  "installCommand": "cd client && npm install",
  "framework": "nextjs",
  "functions": {
    "client/src/**/*.tsx": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Opción 2: Path Aliases Relativos
Cambiar todos los imports de `@/` a `../` o rutas relativas.

### Opción 3: Configuración TypeScript Estricta
```json
// client/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    },
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### Opción 4: Webpack Configuración Avanzada
```javascript
// client/next.config.js
const path = require('path');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    return config;
  }
}
```

### Opción 5: Deploy Directo desde client/
- Mover todo a la raíz de un nuevo repo
- Deploy solo el frontend

## 📝 PREGUNTAS ESPECÍFICAS

1. **¿Por qué Vercel no lee next.config.js del subdirectorio client/?**
2. **¿Cómo configurar path aliases en monorepo Next.js para Vercel?**
3. **¿Es mejor usar rutas relativas en lugar de path aliases para Vercel?**
4. **¿Cómo forzar a Vercel a usar la configuración de webpack correcta?**
5. **¿Existe una configuración específica de Vercel para monorepos?**

## 🎯 RESULTADO ESPERADO
Una solución que permita:
- ✅ Deploy exitoso en Vercel
- ✅ Path aliases funcionando (`@/store/auth`, etc.)
- ✅ Sin cambios masivos en el código
- ✅ Mantener estructura de monorepo

## ⚠️ RESTRICCIONES
- No cambiar toda la estructura del proyecto
- Mantener monorepo
- No reescribir todos los imports
- Solución que funcione inmediatamente

---

**¿Puedes proporcionar una solución definitiva para este problema específico de path aliases en Vercel con monorepo Next.js?** 