# Chatbot da Clínica Saúde Integrada

Um chatbot para WhatsApp que permite agendamento de consultas e fornece informações aos pacientes da Clínica Saúde Integrada.

## Tecnologias

- Node.js v22 com TypeScript
- Fastify v5 para API REST
- Integração com WhatsApp Business API
- Integração com OpenAI para processamento de linguagem natural
- Banco de dados PostgreSQL hospedado no Neon
- Redis para cache e gerenciamento de sessões hospedado no Upstash

## Pré-requisitos

- Node.js v22+
- pnpm
- Docker e Docker Compose (para desenvolvimento local)
- Contas ativas no Neon (PostgreSQL) e Upstash (Redis) para produção
- Credenciais para WhatsApp Business API e OpenAI

## Configuração do Ambiente

1. Clone o repositório:

   ```bash
   git clone https://github.com/6laercio/saude-integrada-chatbot.git
   cd saude-integrada-chatbot
   ```

2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas credenciais:

   - `DATABASE_URL`: URL de conexão com o PostgreSQL (Neon ou Docker local)
   - `REDIS_URL`: URL de conexão com o Redis (Upstash ou Docker local)
   - `WHATSAPP_TOKEN`: Token de autenticação da API do WhatsApp
   - `WHATSAPP_PHONE_NUMBER_ID`: ID do número de telefone do WhatsApp Business
   - `WHATSAPP_VERIFY_TOKEN`: Token de verificação do webhook
   - `OPENAI_API_KEY`: Chave de API da OpenAI

## Executando o Projeto

### Desenvolvimento com Docker (Recomendado)

O projeto está configurado para desenvolvimento local usando Docker. Isso permite executar a aplicação completa com PostgreSQL e Redis sem instalá-los na sua máquina.

1. Verifique se o arquivo `.env` está configurado (veja a seção anterior)

2. Inicie os serviços com Docker Compose:

   ```bash
   docker compose up -d
   ```

   Isso iniciará três containers:

   - `app`: A aplicação Node.js/Fastify
   - `postgres`: Banco de dados PostgreSQL local
   - `redis`: Servidor Redis local

3. Acesse a API em `http://localhost:3000`

4. Para visualizar os logs em tempo real:

   ```bash
   docker compose logs -f
   ```

5. Para parar os serviços:

   ```bash
   docker compose down
   ```

#### Script auxiliar para desenvolvimento

Para facilitar o desenvolvimento, você pode usar o script `docker-dev.sh`:

```bash
# Torne o script executável
chmod +x scripts/docker-dev.sh

# Inicie os serviços
./scripts/docker-dev.sh start

# Visualize os logs
./scripts/docker-dev.sh logs

# Pare os serviços
./scripts/docker-dev.sh stop

# Veja todos os comandos disponíveis
./scripts/docker-dev.sh help
```

#### Serviços e portas (Docker)

- **Aplicação:** http://localhost:3000
- **PostgreSQL:** localhost:5432
  - Usuário: `postgres`
  - Senha: `postgres`
  - Database: `saudeintegrada`
- **Redis:** localhost:6379

### Desenvolvimento sem Docker

```bash
# Executar em modo de desenvolvimento
pnpm dev
```

Neste caso, você precisará ter PostgreSQL e Redis instalados localmente ou usar as versões hospedadas no Neon e Upstash.

### Produção

```bash
# Compilar o projeto
pnpm build

# Executar em produção
pnpm start
```

## Estrutura do Projeto

```
saude-integrada-chatbot/
├── src/
│   ├── config/              # Configurações da aplicação
│   ├── db/                  # Configuração e modelos do banco de dados
│   ├── routes/              # Definição de rotas da API
│   ├── services/            # Serviços da aplicação
│   │   ├── whatsapp/        # Integração com a API do WhatsApp
│   │   ├── openai/          # Integração com a OpenAI
│   │   └── scheduling/      # Lógica de agendamento
│   ├── utils/               # Funções utilitárias
│   ├── app.ts               # Configuração do Fastify
│   └── index.ts             # Ponto de entrada da aplicação
├── .env                      # Variáveis de ambiente (não versionado)
├── .env.example              # Exemplo de variáveis de ambiente
├── .eslintrc.json           # Configuração do ESLint
├── .gitignore               # Arquivos ignorados pelo git
├── .prettierrc              # Configuração do Prettier
├── compose.yaml             # Configuração do Docker Compose
├── Dockerfile               # Definição do container Docker
├── scripts/                 # Scripts auxiliares
│   └── docker-dev.sh        # Script para desenvolvimento com Docker
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração do TypeScript
└── README.md                # Este arquivo
```

## Serviços Externos

### Neon PostgreSQL

Este projeto utiliza o [Neon](https://neon.tech/) como banco de dados PostgreSQL serverless em produção. Configure sua instância no Neon e obtenha a URL de conexão para adicionar à variável `DATABASE_URL` no arquivo `.env`.

Para desenvolvimento local, o Docker Compose configura automaticamente um banco PostgreSQL.

### Upstash Redis

Para cache e gerenciamento de sessões em produção, utilizamos o [Upstash](https://upstash.com/) como Redis serverless. Configure uma instância no Upstash e adicione a URL de conexão à variável `REDIS_URL` no arquivo `.env`.

Para desenvolvimento local, o Docker Compose configura automaticamente um servidor Redis.

## Métricas de Sucesso

- Redução de 40% no tempo de espera para agendamento
- Diminuição de 40% nas reclamações
- Taxa de satisfação do usuário acima de 85%
- Taxa de finalização bem-sucedida de agendamentos via chatbot acima de 75%
- Tempo médio de resolução abaixo de 3 minutos

## Licença

MIT
