# CLAUDE.md - Contexto do Projeto PersonalHub

Este documento fornece contexto completo sobre o projeto PersonalHub para assistentes de IA como Claude.

## Visão Geral

PersonalHub é um sistema completo de gestão financeira pessoal desenvolvido como uma aplicação full-stack moderna, utilizando Django REST Framework no backend e React com TypeScript no frontend. O sistema permite que usuários gerenciem suas finanças pessoais de forma completa, incluindo contas bancárias, cartões de crédito, despesas, receitas e empréstimos.

## Arquitetura

### Estrutura de Pastas

```
PersonalHub/
├── api/                          # Backend Django
│   ├── accounts/                 # App de contas bancárias
│   ├── authentication/           # App de autenticação
│   ├── credit_cards/             # App de cartões de crédito
│   ├── dashboard/                # App de dashboard
│   ├── expenses/                 # App de despesas
│   ├── loans/                    # App de empréstimos
│   ├── members/                  # App de membros
│   ├── revenues/                 # App de receitas
│   ├── app/                      # Configurações do Django
│   │   ├── settings.py           # Configurações principais
│   │   ├── urls.py               # URLs principais
│   │   ├── encryption.py         # Sistema de criptografia
│   │   ├── health.py             # Health check endpoint
│   │   ├── middleware.py         # Middlewares customizados
│   │   └── permissions.py        # Permissões customizadas
│   ├── manage.py                 # Django management
│   ├── requirements.txt          # Dependências Python
│   ├── Dockerfile                # Docker do backend
│   ├── entrypoint.sh             # Script de inicialização
│   └── .env.example              # Exemplo de variáveis de ambiente
│
└── frontend/                     # Frontend React
    ├── src/                      # Código fonte
    │   ├── components/           # Componentes React
    │   ├── pages/                # Páginas da aplicação
    │   ├── services/             # Serviços de API
    │   ├── store/                # Estado global (Zustand)
    │   ├── utils/                # Utilitários
    │   └── types/                # Tipos TypeScript
    ├── public/                   # Arquivos públicos
    ├── package.json              # Dependências Node
    ├── vite.config.ts            # Configuração do Vite
    ├── tsconfig.json             # Configuração TypeScript
    └── tailwind.config.js        # Configuração TailwindCSS
```

## Backend (API)

### Stack Tecnológica

- **Python 3.12**: Linguagem principal
- **Django 5.x**: Framework web
- **Django REST Framework**: API REST
- **PostgreSQL 16**: Banco de dados
- **Cryptography (Fernet)**: Criptografia de dados sensíveis
- **JWT**: Autenticação via tokens
- **CORS Headers**: Gerenciamento de CORS

### Apps Django

1. **accounts**: Gerencia contas bancárias e instituições financeiras
2. **authentication**: Sistema de login/logout com JWT e cookies
3. **credit_cards**: Cadastro e gerenciamento de cartões de crédito
4. **dashboard**: Endpoints para dados consolidados e estatísticas
5. **expenses**: Registro e gerenciamento de despesas
6. **loans**: Controle de empréstimos e parcelas
7. **members**: Gerenciamento de membros da família/grupo
8. **revenues**: Controle de receitas

### Recursos Importantes

#### Criptografia
- Arquivo: `api/app/encryption.py`
- Dados sensíveis (números de cartão, CVV) são criptografados com Fernet
- Chave de criptografia: variável `ENCRYPTION_KEY` no `.env`

#### Autenticação
- Cookie-based authentication com JWT
- Middleware customizado em `api/authentication/middleware.py`
- Cookies HttpOnly e Secure em produção

#### Permissões
- Sistema de permissões customizado em `api/app/permissions.py`
- Grupos de usuários com permissões específicas
- Command: `python manage.py setup_permissions`

#### Health Check
- Endpoint: `/health/`
- Verifica conectividade do banco de dados
- Usado pelo Docker healthcheck

### Models Principais

#### Account (accounts/models.py)
- Instituição financeira
- Nome da conta
- Saldo
- Tipo (corrente, poupança, investimento)
- Relacionamento com membro

#### CreditCard (credit_cards/models.py)
- Número (criptografado)
- CVV (criptografado)
- Limite
- Fechamento e vencimento
- Relacionamento com conta

#### Expense (expenses/models.py)
- Descrição
- Valor
- Data
- Categoria
- Status de pagamento
- Relacionamento com conta/cartão

#### Revenue (revenues/models.py)
- Descrição
- Valor
- Data
- Categoria
- Relacionamento com conta

#### Loan (loans/models.py)
- Valor total
- Parcelas
- Valor das parcelas
- Data de início
- Status

#### Member (members/models.py)
- Nome
- Relacionamento
- Ativo/inativo

## Frontend

### Stack Tecnológica

- **React 19**: Library UI
- **TypeScript**: Linguagem tipada
- **Vite**: Build tool e dev server
- **TailwindCSS**: Framework CSS
- **Radix UI**: Componentes acessíveis
- **Axios**: Cliente HTTP
- **Zustand**: Gerenciamento de estado
- **React Router Dom**: Roteamento
- **React Hook Form + Zod**: Formulários e validação
- **Recharts**: Gráficos
- **date-fns**: Manipulação de datas
- **Sonner**: Toast notifications

### Estrutura de Componentes

- **UI Components**: Componentes reutilizáveis em `src/components/ui/`
- **Feature Components**: Componentes específicos de funcionalidades
- **Pages**: Páginas principais da aplicação
- **Layouts**: Layouts compartilhados

### Gerenciamento de Estado

- Zustand para estado global
- Estados locais com React Hooks
- Context API para temas e autenticação

### Roteamento

- React Router Dom v7
- Rotas protegidas com autenticação
- Lazy loading de páginas

## Banco de Dados

### PostgreSQL

- Versão: 16.9-alpine
- Porta: 5435 (mapeada do 5432 interno)
- Database: `personalhub_db`
- Encoding: UTF8
- Locale: pt_BR.UTF-8
- Volume persistente: `postgres_data`

### Migrações

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Ver status
python manage.py showmigrations
```

## Docker

### Serviços

1. **api**: Backend Django
   - Build: `./api/Dockerfile`
   - Porta: 8002
   - Healthcheck em `/health/`
   - Volumes para media, logs e static

2. **frontend**: Frontend React/Vite
   - Build: `./frontend/Dockerfile`
   - Porta: 3000
   - Hot reload em desenvolvimento

3. **db**: PostgreSQL
   - Imagem: postgres:16.9-alpine
   - Porta: 5435
   - Volume persistente
   - Healthcheck com pg_isready

### Rede

- `personalhub-network`: Bridge network conectando todos os serviços

### Volumes

- `postgres_data`: Dados persistentes do PostgreSQL
- `./media`: Upload de arquivos
- `./logs`: Logs da aplicação
- `./backups`: Backups do banco

## Variáveis de Ambiente

### Backend (.env)

```
# Database
DB_HOST=db
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=personalhub_db

# Django
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=senha_segura
SECRET_KEY=chave_secreta_django
ENCRYPTION_KEY=chave_fernet_criptografia

# Logging
LOG_FORMAT=json
```

### Frontend

```
VITE_API_URL=http://localhost:8002
```

## Comandos Importantes

### Desenvolvimento

```bash
# Backend
cd api
python manage.py runserver 0.0.0.0:8002

# Frontend
cd frontend
npm run dev
```

### Docker

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Executar comando no container
docker-compose exec api python manage.py <comando>
```

### Django Management Commands

```bash
# Atualizar balanços
python manage.py update_balances

# Configurar permissões
python manage.py setup_permissions

# Criar superusuário
python manage.py createsuperuser
```

## Fluxo de Autenticação

1. Usuário faz POST para `/api/auth/login/` com credenciais
2. Backend valida e retorna JWT no cookie HttpOnly
3. Frontend armazena estado de autenticação
4. Requisições subsequentes incluem cookie automaticamente
5. Middleware valida JWT em cada requisição
6. Logout limpa o cookie

## Segurança

### Implementado

- Criptografia de dados sensíveis com Fernet
- JWT em cookies HttpOnly
- CORS configurado
- Validação de dados no backend
- Sanitização de inputs
- HTTPS em produção
- Senha com hash bcrypt

### Considerações

- Nunca commitar `.env` com dados reais
- Rotacionar chaves de criptografia periodicamente
- Usar HTTPS em produção
- Configurar ALLOWED_HOSTS adequadamente
- Implementar rate limiting em produção
- Monitorar logs de acesso

## Padrões de Código

### Backend

- PEP 8 para estilo de código Python
- Docstrings em funções complexas
- Type hints quando apropriado
- Serializers para validação de dados
- ViewSets para APIs RESTful
- Permissions classes para autorização

### Frontend

- ESLint + Prettier para formatação
- TypeScript strict mode
- Componentes funcionais com hooks
- Props tipadas com TypeScript
- Composição sobre herança
- Custom hooks para lógica reutilizável

## Testing

### Backend

```bash
# Rodar todos os testes
python manage.py test

# Testes específicos
python manage.py test accounts

# Com coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e
```

## Deploy

### Considerações

1. Configurar variáveis de ambiente de produção
2. Usar PostgreSQL dedicado
3. Configurar HTTPS/SSL
4. Implementar CDN para static files
5. Configurar logs centralizados
6. Implementar monitoramento (Sentry, etc)
7. Configurar backups automatizados
8. Implementar CI/CD pipeline

### Checklist de Produção

- [ ] DEBUG=False no Django
- [ ] SECRET_KEY único e seguro
- [ ] ALLOWED_HOSTS configurado
- [ ] CORS_ALLOWED_ORIGINS configurado
- [ ] HTTPS habilitado
- [ ] Logs configurados
- [ ] Backups automatizados
- [ ] Monitoramento ativo
- [ ] Rate limiting implementado
- [ ] Static files servidos via CDN

## Troubleshooting Comum

### Erro de conexão com banco de dados
- Verificar se container do PostgreSQL está rodando
- Validar credenciais no `.env`
- Aguardar healthcheck completar

### Erro de criptografia
- Validar ENCRYPTION_KEY no `.env`
- Não mudar a chave depois de dados criptografados
- Backup antes de rotacionar chaves

### CORS errors
- Verificar CORS_ALLOWED_ORIGINS
- Validar URLs do frontend
- Conferir credentials: true no axios

### Migrations conflitantes
- `python manage.py migrate --fake-initial`
- Resolver conflitos manualmente
- Criar nova migration de merge

## Recursos Úteis

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- React Docs: https://react.dev/
- Vite Docs: https://vitejs.dev/
- TailwindCSS: https://tailwindcss.com/
- PostgreSQL Docs: https://www.postgresql.org/docs/

## Contato e Suporte

Para questões sobre o projeto, consulte a documentação adicional ou entre em contato com a equipe de desenvolvimento.
