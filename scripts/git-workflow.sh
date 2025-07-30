#!/bin/bash

# 🔄 Script de Git Workflow - EDU21
# Este script maneja el workflow de versionado y deployment

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🔄 Git Workflow - EDU21${NC}"
    echo ""
    echo "Uso: ./scripts/git-workflow.sh [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  ${GREEN}feature${NC} [nombre]     - Crear feature branch"
    echo "  ${GREEN}hotfix${NC} [nombre]      - Crear hotfix branch"
    echo "  ${GREEN}release${NC} [version]    - Crear release branch"
    echo "  ${GREEN}deploy-prod${NC}          - Deploy a producción"
    echo "  ${GREEN}deploy-staging${NC}       - Deploy a staging"
    echo "  ${GREEN}status${NC}               - Mostrar estado actual"
    echo "  ${GREEN}help${NC}                 - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/git-workflow.sh feature nueva-funcionalidad"
    echo "  ./scripts/git-workflow.sh hotfix correccion-urgente"
    echo "  ./scripts/git-workflow.sh release v1.1.0"
    echo "  ./scripts/git-workflow.sh deploy-prod"
}

# Función para crear feature branch
create_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        echo -e "${RED}❌ Error: Debes especificar un nombre para el feature${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🌿 Creando feature branch: feature/$feature_name${NC}"
    
    # Verificar que estamos en develop
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "develop" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a branch develop...${NC}"
        git checkout develop
    fi
    
    # Crear feature branch
    git checkout -b "feature/$feature_name"
    echo -e "${GREEN}✅ Feature branch creado: feature/$feature_name${NC}"
    echo -e "${BLUE}💡 Para continuar:${NC}"
    echo "   1. Desarrolla tu funcionalidad"
    echo "   2. git add . && git commit -m 'feat: $feature_name'"
    echo "   3. git push origin feature/$feature_name"
}

# Función para crear hotfix branch
create_hotfix() {
    local hotfix_name=$1
    if [ -z "$hotfix_name" ]; then
        echo -e "${RED}❌ Error: Debes especificar un nombre para el hotfix${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🚨 Creando hotfix branch: hotfix/$hotfix_name${NC}"
    
    # Verificar que estamos en main
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a branch main...${NC}"
        git checkout main
    fi
    
    # Crear hotfix branch
    git checkout -b "hotfix/$hotfix_name"
    echo -e "${GREEN}✅ Hotfix branch creado: hotfix/$hotfix_name${NC}"
    echo -e "${BLUE}💡 Para continuar:${NC}"
    echo "   1. Corrige el problema urgente"
    echo "   2. git add . && git commit -m 'fix: $hotfix_name'"
    echo "   3. git checkout main && git merge hotfix/$hotfix_name"
    echo "   4. git tag v1.0.1 && git push origin v1.0.1"
}

# Función para crear release branch
create_release() {
    local version=$1
    if [ -z "$version" ]; then
        echo -e "${RED}❌ Error: Debes especificar una versión${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🏷️  Creando release branch: release/$version${NC}"
    
    # Verificar que estamos en develop
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "develop" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a branch develop...${NC}"
        git checkout develop
    fi
    
    # Crear release branch
    git checkout -b "release/$version"
    echo -e "${GREEN}✅ Release branch creado: release/$version${NC}"
    echo -e "${BLUE}💡 Para continuar:${NC}"
    echo "   1. Finaliza la versión (testing, documentación)"
    echo "   2. git checkout main && git merge release/$version"
    echo "   3. git tag $version && git push origin $version"
    echo "   4. git checkout develop && git merge main"
}

# Función para deploy a producción
deploy_prod() {
    echo -e "${BLUE}🚀 Deploy a producción${NC}"
    
    # Verificar que estamos en main
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo -e "${RED}❌ Error: Debes estar en branch main para deploy a producción${NC}"
        exit 1
    fi
    
    # Ejecutar script de deployment
    ./scripts/deploy-prod.sh
}

# Función para deploy a staging
deploy_staging() {
    echo -e "${BLUE}🚀 Deploy a staging${NC}"
    
    # Verificar que estamos en staging
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "staging" ]; then
        echo -e "${YELLOW}⚠️  Cambiando a branch staging...${NC}"
        git checkout staging
    fi
    
    # Deploy a staging
    vercel
    echo -e "${GREEN}✅ Deploy a staging completado${NC}"
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado actual del repositorio${NC}"
    echo ""
    
    # Branch actual
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "🌿 Branch actual: ${GREEN}$CURRENT_BRANCH${NC}"
    
    # Estado de cambios
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "📝 Cambios pendientes: ${YELLOW}Hay cambios sin commitear${NC}"
        git status --short
    else
        echo -e "📝 Cambios pendientes: ${GREEN}No hay cambios pendientes${NC}"
    fi
    
    # Últimos commits
    echo ""
    echo -e "${BLUE}📜 Últimos commits:${NC}"
    git log --oneline -5
    
    # Tags
    echo ""
    echo -e "${BLUE}🏷️  Últimos tags:${NC}"
    git tag --sort=-version:refname | head -5
}

# Procesar comandos
case "$1" in
    "feature")
        create_feature "$2"
        ;;
    "hotfix")
        create_hotfix "$2"
        ;;
    "release")
        create_release "$2"
        ;;
    "deploy-prod")
        deploy_prod
        ;;
    "deploy-staging")
        deploy_staging
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando no reconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac 