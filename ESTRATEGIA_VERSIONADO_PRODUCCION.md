# 🚀 Estrategia de Versionado y Producción - EDU21

## 📋 Índice
1. [Estructura de Repositorios](#estructura-de-repositorios)
2. [Preparación para Producción](#preparación-para-producción)
3. [Gestión de Usuarios](#gestión-de-usuarios)
4. [Deployment Strategy](#deployment-strategy)
5. [Flujo de Desarrollo](#flujo-de-desarrollo)
6. [Comandos y Scripts](#comandos-y-scripts)

---

## 🏗️ Estructura de Repositorios

### **Repositorio Principal: `edu21-platform`**
```
📁 edu21-platform/
├── 🌿 main (v1.0-produccion)        ← Versión estable en Vercel
├── 🌿 develop (v2.0-desarrollo)     ← Versión en desarrollo
├── 🌿 staging (v1.1-hotfixes)       ← Correcciones urgentes
└── 🏷️ tags/
    ├── v1.0.0 (producción actual)
    ├── v1.1.0 (próxima actualización)
    └── v2.0.0-alpha (desarrollo)
```

### **Repositorio de Desarrollo: `edu21-platform-dev`**
```
📁 edu21-platform-dev/
├── 🌿 main (desarrollo activo)
├── 🌿 feature/nuevas-funcionalidades
└── 🌿 experimental (pruebas)
```

---

## 🎯 Preparación para Producción

### **1. Limpiar Código de Desarrollo**
- [ ] Remover logs de debugging
- [ ] Ocultar usuarios demo del login público
- [ ] Configurar variables de entorno de producción
- [ ] Optimizar build y performance

### **2. Gestión de Usuarios**
- [ ] Crear login de desarrollador separado
- [ ] Ocultar usuarios demo del login público
- [ ] Configurar autenticación real
- [ ] Implementar registro de usuarios

### **3. Configuración de Entorno**
- [ ] Variables de entorno de producción
- [ ] Configuración de base de datos
- [ ] Configuración de Vercel
- [ ] Configuración de dominios

---

## 👥 Gestión de Usuarios

### **Login Público (Producción)**
```javascript
// Solo usuarios reales registrados
// Sin acceso a usuarios demo
```

### **Login de Desarrollador**
```javascript
// Acceso rápido a usuarios demo
// Solo para desarrollo y testing
// URL: /login-lukas (oculta)
```

### **Usuarios Demo (Ocultos)**
```javascript
// Mantener para desarrollo interno
// No visibles en producción
// Acceso solo por login de desarrollador
```

---

## 🚀 Deployment Strategy

### **Vercel (Producción)**
- **Branch**: `main`
- **URL**: `https://edu21-platform.vercel.app`
- **Entorno**: Production
- **Usuarios**: Reales registrados

### **Vercel (Staging)**
- **Branch**: `staging`
- **URL**: `https://edu21-staging.vercel.app`
- **Entorno**: Staging
- **Usuarios**: Demo + Reales

### **Local (Desarrollo)**
- **Branch**: `develop`
- **URL**: `http://localhost:3000`
- **Entorno**: Development
- **Usuarios**: Demo + Testing

---

## 🔄 Flujo de Desarrollo

### **Desarrollo de V2**
1. **Crear feature branch** desde `develop`
2. **Desarrollar funcionalidad** en local
3. **Testing** con usuarios demo
4. **Merge** a `develop`
5. **Testing** en staging
6. **Release** a `main` cuando esté listo

### **Hotfixes V1**
1. **Crear hotfix branch** desde `main`
2. **Corregir problema** urgente
3. **Testing** rápido
4. **Merge** a `main` y `develop`
5. **Deploy** inmediato a producción

### **Releases**
1. **v1.0.0** → Producción estable
2. **v1.1.0** → Mejoras menores
3. **v2.0.0** → Nueva versión mayor

---

## 💻 Comandos y Scripts

### **Git Workflow**
```bash
# Crear nueva versión
git checkout main
git pull origin main
git checkout -b release/v1.0.0
git tag v1.0.0
git push origin v1.0.0

# Desarrollo
git checkout develop
git checkout -b feature/nueva-funcionalidad
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Hotfix
git checkout main
git checkout -b hotfix/correccion-urgente
git commit -m "fix: corrección urgente"
git checkout main
git merge hotfix/correccion-urgente
git tag v1.0.1
```

### **Scripts de Deployment**
```bash
# Deploy a producción
npm run build:prod
vercel --prod

# Deploy a staging
npm run build:staging
vercel

# Deploy local
npm run dev
```

---

## 📁 Estructura de Archivos

### **Configuración por Entorno**
```
📁 config/
├── 📄 development.env
├── 📄 staging.env
├── 📄 production.env
└── 📄 .env.example
```

### **Scripts de Build**
```
📁 scripts/
├── 📄 build-prod.js
├── 📄 build-staging.js
├── 📄 deploy-prod.sh
└── 📄 deploy-staging.sh
```

---

## 🔐 Seguridad y Accesos

### **Variables de Entorno**
```bash
# Producción
NODE_ENV=production
DATABASE_URL=prod_database_url
JWT_SECRET=prod_jwt_secret

# Desarrollo
NODE_ENV=development
DATABASE_URL=dev_database_url
JWT_SECRET=dev_jwt_secret
```

### **Accesos de Desarrollador**
- **URL**: `/login-lukas` (oculta)
- **Usuarios**: Solo demo
- **Funcionalidades**: Completas
- **Logs**: Detallados

---

## 📊 Monitoreo y Analytics

### **Producción**
- [ ] Google Analytics
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User analytics

### **Desarrollo**
- [ ] Console logs
- [ ] Debug tools
- [ ] Development analytics
- [ ] Testing metrics

---

## 🎯 Próximos Pasos

### **Inmediato (Esta Semana)**
1. [ ] Crear branch `main` para producción
2. [ ] Limpiar código de desarrollo
3. [ ] Configurar login de desarrollador
4. [ ] Preparar deployment en Vercel

### **Corto Plazo (Próximas 2 Semanas)**
1. [ ] Implementar registro de usuarios reales
2. [ ] Configurar autenticación real
3. [ ] Testing completo de producción
4. [ ] Deploy de v1.0.0

### **Mediano Plazo (1-2 Meses)**
1. [ ] Desarrollo de v2.0 en branch `develop`
2. [ ] Implementación de nuevas funcionalidades
3. [ ] Testing extensivo
4. [ ] Release de v2.0.0

---

*Documento creado: 26 de Julio, 2025*
*Versión: 1.0* 