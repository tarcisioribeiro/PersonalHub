# ExpenseLit API - Guia de Respostas de Erro

## 📋 Visão Geral

Este guia detalha todas as possíveis respostas de erro da ExpenseLit API, com exemplos práticos e soluções.

## 🔐 Erros de Autenticação (401 Unauthorized)

### Token Inválido ou Expirado

**Cenário**: Token JWT inválido, malformado ou expirado

**Resposta**:
```json
{
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
        {
            "token_class": "AccessToken",
            "token_type": "access", 
            "message": "Token is invalid or expired"
        }
    ]
}
```

**Soluções**:
1. Renovar token usando o endpoint `/authentication/token/refresh/`
2. Fazer login novamente se o refresh token também expirou
3. Verificar se o token está no formato correto: `Bearer {token}`

### Credenciais Inválidas (Login)

**Cenário**: Username ou senha incorretos

**Resposta**:
```json
{
    "detail": "No active account found with the given credentials"
}
```

**Soluções**:
1. Verificar username e senha
2. Confirmar se o usuário está ativo
3. Verificar se o usuário existe no sistema

### Token Ausente

**Cenário**: Tentativa de acessar endpoint protegido sem token

**Resposta**:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

**Solução**: Incluir header `Authorization: Bearer {token}` na requisição

## 🚫 Erros de Permissão (403 Forbidden)

### Sem Permissão para Ação

**Cenário**: Usuário autenticado mas sem permissão para a operação

**Resposta**:
```json
{
    "detail": "You do not have permission to perform this action."
}
```

**Soluções**:
1. Verificar permissões do usuário em `/authentication/user-permissions/`
2. Solicitar permissões ao administrador
3. Verificar se está tentando acessar recurso de outro usuário

## ❌ Erros de Validação (400 Bad Request)

### Dados de Entrada Inválidos

#### Campos Obrigatórios Ausentes

**Cenário**: Campos obrigatórios não fornecidos

**Resposta**:
```json
{
    "description": ["This field is required."],
    "value": ["This field is required."],
    "account": ["This field is required."]
}
```

#### Formato de Dados Incorreto

**Cenário**: Dados em formato inválido

**Resposta**:
```json
{
    "value": ["A valid number is required."],
    "date": ["Date has wrong format. Use one of these formats instead: YYYY-MM-DD."],
    "email": ["Enter a valid email address."]
}
```

#### Escolhas Inválidas

**Cenário**: Valor não está nas opções permitidas

**Resposta**:
```json
{
    "category": ["Select a valid choice. invalid_category is not one of the available choices."],
    "account_type": ["Select a valid choice. INVALID is not one of the available choices."]
}
```

### Validações Específicas por Modelo

#### Accounts (Contas)

**Nome duplicado**:
```json
{
    "name": ["Account with this Nome already exists."]
}
```

**Nome inválido**:
```json
{
    "name": ["Select a valid choice. INVALID_BANK is not one of the available choices."]
}
```

#### Credit Cards (Cartões)

**CVV inválido**:
```json
{
    "security_code": ["CVV deve conter apenas dígitos"],
    "security_code": ["CVV deve ter 3 ou 4 dígitos"]
}
```

**Data de validade inválida**:
```json
{
    "validation_date": ["Data de validade deve ser posterior à data atual"]
}
```

**Limites inválidos**:
```json
{
    "credit_limit": ["Limite de crédito não pode ser maior que o limite máximo"]
}
```

#### Expenses (Despesas)

**Valor negativo**:
```json
{
    "value": ["Ensure this value is greater than or equal to 0."]
}
```

**Categoria inválida**:
```json
{
    "category": ["Select a valid choice. nonexistent_category is not one of the available choices."]
}
```

#### Members (Membros)

**Documento duplicado**:
```json
{
    "document": ["Member with this Documento already exists."]
}
```

**Email inválido**:
```json
{
    "email": ["Enter a valid email address."]
}
```

**Sexo inválido**:
```json
{
    "sex": ["Select a valid choice. X is not one of the available choices."]
}
```

#### Transfers (Transferências)

**Conta origem igual à destino**:
```json
{
    "non_field_errors": ["A conta de origem deve ser diferente da conta de destino"]
}
```

**Conta inexistente**:
```json
{
    "origin_account": ["Invalid pk \"999\" - object does not exist."]
}
```

#### Loans (Empréstimos)

**Valor pago maior que total**:
```json
{
    "payed_value": ["O valor pago não pode ser maior que o valor total do empréstimo"]
}
```

**Credor inválido**:
```json
{
    "creditor": ["Invalid pk \"999\" - object does not exist."]
}
```

#### Credit Card Expenses (Despesas do Cartão)

**Parcelas inválidas**:
```json
{
    "installment": ["Ensure this value is greater than 0."]
}
```

## 🔍 Erros de Recurso Não Encontrado (404 Not Found)

### Recurso Não Existe

**Cenário**: Tentativa de acessar, atualizar ou deletar recurso inexistente

**Resposta**:
```json
{
    "detail": "Not found."
}
```

**Soluções**:
1. Verificar se o ID está correto
2. Confirmar se o recurso não foi deletado
3. Verificar se você tem permissão para ver o recurso

### Endpoint Não Existe

**Cenário**: URL incorreta ou endpoint que não existe

**Resposta**:
```json
{
    "detail": "Not found."
}
```

**Soluções**:
1. Verificar a URL da requisição
2. Consultar a documentação da API
3. Verificar se está usando o método HTTP correto

## ⚙️ Erros Internos do Servidor (500 Internal Server Error)

### Erro de Configuração

**Cenário**: Problema de configuração do servidor (ex: chave de criptografia ausente)

**Resposta**:
```json
{
    "detail": "Internal server error."
}
```

**Causas Comuns**:
1. `ENCRYPTION_KEY` não configurada no ambiente
2. Erro de conexão com banco de dados
3. Configuração incorreta do Django
4. Problema com dependências

### Erro de Criptografia

**Cenário**: Problema ao criptografar/descriptografar CVV

**Resposta**:
```json
{
    "detail": "Erro ao criptografar dados: invalid key format"
}
```

**Soluções**:
1. Verificar se `ENCRYPTION_KEY` está corretamente definida
2. Gerar nova chave com: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`
3. Atualizar variável de ambiente

## 🔧 Erros de Método HTTP (405 Method Not Allowed)

### Método Não Permitido

**Cenário**: Uso de método HTTP incorreto para o endpoint

**Resposta**:
```json
{
    "detail": "Method \"PATCH\" not allowed."
}
```

**Soluções**:
1. Verificar métodos permitidos para cada endpoint
2. Usar método correto (GET, POST, PUT, DELETE)

## 📊 Códigos de Status e Significados

| Código | Nome | Quando Ocorre |
|--------|------|---------------|
| 400 | Bad Request | Dados inválidos, validação falhou |
| 401 | Unauthorized | Token ausente, inválido ou expirado |
| 403 | Forbidden | Sem permissão para a ação |
| 404 | Not Found | Recurso ou endpoint não encontrado |
| 405 | Method Not Allowed | Método HTTP incorreto |
| 409 | Conflict | Conflito de dados (ex: chave duplicada) |
| 422 | Unprocessable Entity | Dados válidos mas logicamente incorretos |
| 429 | Too Many Requests | Muitas requisições (se rate limiting estiver ativo) |
| 500 | Internal Server Error | Erro interno do servidor |
| 503 | Service Unavailable | Serviço temporariamente indisponível |

## 🛠️ Como Debugar Erros

### 1. Verificar Headers da Requisição

```bash
curl -X GET \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  http://localhost:8002/api/v1/accounts/
```

### 2. Validar JSON

Use um validador JSON para garantir que o payload está correto.

### 3. Verificar Logs do Servidor

```bash
# Em modo desenvolvimento
python manage.py runserver --verbosity=2

# Docker
docker logs container_name
```

### 4. Testar Token

```bash
# Verificar se o token é válido
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"token": "your_access_token"}' \
  http://localhost:8002/api/v1/authentication/token/verify/
```

### 5. Verificar Permissões

```bash
curl -X GET \
  -H "Authorization: Bearer your_token" \
  http://localhost:8002/api/v1/authentication/user-permissions/
```

## 🚀 Melhores Práticas para Lidar com Erros

### No Frontend/Cliente

1. **Sempre verificar status code** antes de processar resposta
2. **Implementar retry** para erros temporários (500, 503)
3. **Renovar token automaticamente** quando receber 401
4. **Mostrar mensagens de erro amigáveis** para usuários
5. **Logar erros** para debugging

### Exemplo em JavaScript

```javascript
async function makeAPIRequest(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 401:
          // Renovar token e tentar novamente
          await refreshToken();
          return makeAPIRequest(url, options);
          
        case 400:
          // Mostrar erros de validação
          displayValidationErrors(errorData);
          break;
          
        case 403:
          // Usuário sem permissão
          showPermissionError();
          break;
          
        case 404:
          // Recurso não encontrado
          showNotFoundError();
          break;
          
        case 500:
          // Erro interno - tentar novamente após delay
          setTimeout(() => makeAPIRequest(url, options), 5000);
          break;
          
        default:
          console.error('API Error:', errorData);
      }
      
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

## 📞 Obtendo Ajuda

Se você encontrar um erro não documentado aqui:

1. **Verifique os logs** do servidor Django
2. **Execute os testes** para verificar se é um problema conhecido
3. **Consulte a documentação** da API
4. **Verifique a configuração** do ambiente
5. **Teste com dados válidos** conhecidos

## 🔄 Atualizações

Este guia é atualizado conforme novos tipos de erro são identificados ou validações são adicionadas à API.