# 🚀 COMANDOS RÁPIDOS PARA VERIFICAR ERRORES ANTES DE VERCEL

## ⚡ COMANDOS RÁPIDOS (1-2 segundos cada uno)

### 1️⃣ **TypeScript Check (Más Rápido)**
```bash
cd client && pnpm run type-check
```
- ✅ Detecta errores de tipos TypeScript
- ✅ No compila, solo verifica tipos
- ✅ Muy rápido (1-2 segundos)

### 2️⃣ **ESLint Check (Errores de código)**
```bash
cd client && pnpm run lint
```
- ✅ Detecta errores de sintaxis
- ✅ Verifica buenas prácticas
- ✅ Rápido (2-3 segundos)

### 3️⃣ **Verificar Imports/Exports**
```bash
cd client && npx tsc --noEmit --skipLibCheck
```
- ✅ Solo verifica imports/exports
- ✅ Ignora librerías externas
- ✅ Super rápido (1 segundo)

### 4️⃣ **Verificar Archivos Específicos**
```bash
cd client && npx tsc --noEmit src/app/teacher/labs/activities/page.tsx
```
- ✅ Solo verifica un archivo específico
- ✅ Útil cuando sabes qué archivo modificaste

## 🔍 COMANDOS DE DIAGNÓSTICO

### 5️⃣ **Verificar Configuración Next.js**
```bash
cd client && npx next lint --dir src/app/teacher/labs/activities
```
- ✅ Verifica solo la carpeta específica
- ✅ Detecta problemas de configuración

### 6️⃣ **Verificar Dependencias**
```bash
cd client && pnpm why @types/react-dom
```
- ✅ Verifica si las dependencias están correctas
- ✅ Útil para problemas de tipos

## 🎯 COMANDO COMPLETO (Cuando tengas tiempo)

### 7️⃣ **Build Completo (Para confirmar)**
```bash
cd client && pnpm run build
```
- ⚠️ Toma 30-60 segundos
- ✅ Simula exactamente lo que hace Vercel
- ✅ Úsalo solo cuando los comandos rápidos pasen

## 📋 WORKFLOW RECOMENDADO

### 🚀 **Antes de cada commit:**
1. `pnpm run type-check` (1 segundo)
2. `pnpm run lint` (2 segundos)
3. Si hay errores → arreglar → repetir
4. Si no hay errores → commit y push

### 🔧 **Cuando hay errores en Vercel:**
1. `npx tsc --noEmit --skipLibCheck` (1 segundo)
2. Arreglar errores específicos
3. `pnpm run type-check` para confirmar
4. Commit y push

## ⚠️ ERRORES COMUNES EN VERCEL

### **TypeScript Errors:**
- `Property 'client' is private` → Usar métodos públicos
- `Type 'destructive' is not assignable` → Verificar variantes disponibles
- `Cannot find module` → Verificar imports

### **Build Errors:**
- `ERR_PNPM_OUTDATED_LOCKFILE` → `pnpm install --no-frozen-lockfile`
- `Command failed with exit code 1` → Verificar TypeScript errors

## 🎯 **COMANDO MÁGICO (Todo en uno):**
```bash
cd client && pnpm run type-check && pnpm run lint && echo "✅ LISTO PARA VERCEL"
```

## 📝 **NOTAS IMPORTANTES:**
- ✅ **type-check** es el más rápido y detecta 90% de errores
- ✅ **lint** detecta problemas de código y buenas prácticas
- ✅ **build** es el más lento pero simula Vercel exactamente
- ⚠️ Siempre ejecuta type-check antes de commit
- ⚠️ Si type-check falla, Vercel fallará seguro

## 🚨 **ERRORES CRÍTICOS ENCONTRADOS:**

### **Errores que SÍ afectan Vercel:**
1. `Unexpected any. Specify a different type` - Muchos errores de `any`
2. `Property 'client' is private` - Ya corregido
3. `Type 'destructive' is not assignable` - Ya corregido

### **Errores que NO afectan Vercel:**
1. `is defined but never used` - Variables no usadas (warnings)
2. `React Hook useEffect has missing dependencies` - Warnings de React
3. `Using <img> could result in slower LCP` - Warnings de Next.js

## 🎯 **COMANDO PARA SOLO ERRORES CRÍTICOS:**
```bash
cd client && npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(error|Error)" | head -10
```
- ✅ Solo muestra los primeros 10 errores críticos
- ✅ Ignora warnings
- ✅ Super rápido 