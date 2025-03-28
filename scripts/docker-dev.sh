#!/bin/bash

# Script para facilitar o desenvolvimento com Docker
# Uso: ./scripts/docker-dev.sh [comando]

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker não está instalado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

# Verifica se o Docker Compose está instalado
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Docker Compose não está instalado ou não está disponível como subcomando do Docker.${NC}"
    exit 1
fi

# Função para mostrar ajuda
show_help() {
    echo -e "${GREEN}=== Script de Desenvolvimento Docker para Chatbot da Clínica Saúde Integrada ===${NC}"
    echo ""
    echo "Uso: ./scripts/docker-dev.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start       - Inicia todos os serviços"
    echo "  stop        - Para todos os serviços"
    echo "  restart     - Reinicia todos os serviços"
    echo "  logs        - Mostra os logs (use ctrl+c para sair)"
    echo "  rebuild     - Reconstrói os containers"
    echo "  ps          - Lista os containers em execução"
    echo "  clean       - Remove todos os containers e volumes (cuidado!)"
    echo "  help        - Mostra esta mensagem de ajuda"
    echo ""
    echo -e "${YELLOW}Dica: Execute este script a partir da raiz do projeto.${NC}"
}

# Verificar se o script está sendo executado da raiz do projeto
if [ ! -f "compose.yaml" ]; then
    echo -e "${RED}Erro: Este script deve ser executado da raiz do projeto.${NC}"
    echo -e "${YELLOW}Exemplo: ./scripts/docker-dev.sh start${NC}"
    exit 1
fi

# Verificar se o diretório scripts existe
if [ ! -d "scripts" ]; then
    echo -e "${YELLOW}Criando diretório 'scripts'...${NC}"
    mkdir -p scripts
fi

# Copiar o script init-db.sql para o diretório scripts se ainda não existir
if [ ! -f "scripts/init-db.sql" ]; then
    echo -e "${YELLOW}Criando script de inicialização do banco de dados...${NC}"
fi

# Garantir que o arquivo .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Arquivo .env não encontrado. Criando a partir do exemplo...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}Arquivo .env criado. Por favor, edite-o com suas credenciais.${NC}"
    else
        echo -e "${RED}Arquivo .env.example não encontrado. Por favor, crie um arquivo .env manualmente.${NC}"
    fi
fi

# Processar comandos
case "$1" in
    start)
        echo -e "${GREEN}Iniciando serviços Docker...${NC}"
        docker compose up -d
        echo -e "${GREEN}Serviços iniciados! Acesse a API em http://localhost:3000${NC}"
        ;;
    stop)
        echo -e "${YELLOW}Parando serviços Docker...${NC}"
        docker compose down
        echo -e "${GREEN}Serviços parados.${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Reiniciando serviços Docker...${NC}"
        docker compose down && docker compose up -d
        echo -e "${GREEN}Serviços reiniciados! Acesse a API em http://localhost:3000${NC}"
        ;;
    logs)
        echo -e "${GREEN}Mostrando logs (use ctrl+c para sair)...${NC}"
        docker compose logs -f
        ;;
    rebuild)
        echo -e "${YELLOW}Reconstruindo containers...${NC}"
        docker compose down && docker compose build --no-cache && docker compose up -d
        echo -e "${GREEN}Containers reconstruídos e iniciados!${NC}"
        ;;
    ps)
        echo -e "${GREEN}Listando containers em execução:${NC}"
        docker compose ps
        ;;
    clean)
        echo -e "${RED}AVISO: Isso removerá todos os containers e volumes relacionados ao projeto.${NC}"
        read -p "Tem certeza que deseja continuar? (s/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            echo -e "${YELLOW}Removendo containers e volumes...${NC}"
            docker compose down -v
            echo -e "${GREEN}Limpeza concluída!${NC}"
        else
            echo -e "${GREEN}Operação cancelada.${NC}"
        fi
        ;;
    help|*)
        show_help
        ;;
esac