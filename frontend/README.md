# ExpenseLit Frontend

Frontend moderno para o sistema ExpenseLit, desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Stack Tecnológica

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router v7** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Tailwind CSS v3** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI reutilizáveis
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones
- **js-cookie** - Gerenciamento de cookies

## ⚙️ Instalação e Uso

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar VITE_API_BASE_URL no .env

# Desenvolvimento (porta 3000)
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura Principal

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Header, Sidebar, Layout
│   └── common/      # ProtectedRoute
├── pages/           # Páginas da aplicação
├── services/        # API client e serviços
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── config/          # Constantes e traduções
```

## 🔐 Autenticação

- JWT tokens armazenados em cookies
- Refresh automático de tokens
- Proteção de rotas por permissão
- Zustand store para estado global

## 🌐 API Integration

```tsx
import { apiClient } from '@/services/api-client';

// GET
const data = await apiClient.get('/api/v1/accounts/');

// POST
const result = await apiClient.post('/api/v1/expenses/', formData);
```

## 🎨 Tema Dracula

Gradientes roxo/rosa customizados:
- Primary: `#bd93f9`
- Accent: `#ff79c6`
- Dark mode habilitado por padrão

## 🌍 Traduções PT-BR

Sistema automático de tradução API (inglês) ↔ UI (português):

```tsx
import { translate } from '@/config/constants';
const nome = translate('accountTypes', 'CC'); // "Conta Corrente"
```

Para mais detalhes, veja a documentação completa.
