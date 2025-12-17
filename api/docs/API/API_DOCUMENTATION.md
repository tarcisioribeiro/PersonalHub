# ExpenseLit API - Documentação Completa

## 📋 Visão Geral

A ExpenseLit API é uma API RESTful para gerenciamento de finanças pessoais, desenvolvida em Django com Django REST Framework. A API permite o controle completo de contas, despesas, receitas, cartões de crédito, empréstimos e transferências.

## 🔗 Base URL

```
http://localhost:8002/api/v1/
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Todos os endpoints (exceto autenticação) requerem um token válido.

### Obter Token

**POST** `/authentication/token/`

```json
{
    "username": "admin",
    "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Usar Token

Inclua o token no header de todas as requisições:

```
Authorization: Bearer {access_token}
```

### Renovar Token

**POST** `/authentication/token/refresh/`

```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 📊 Status Codes

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Recurso deletado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token inválido ou ausente |
| 403 | Forbidden | Usuário sem permissão para a ação |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

## 🏦 Contas (Accounts)

### Tipos de Conta Disponíveis

| Código | Nome |
|--------|------|
| CC | Conta Corrente |
| CS | Conta Salário |
| FG | Fundo de Garantia |
| VA | Vale Alimentação |

### Instituições Disponíveis

| Código | Nome |
|--------|------|
| NUB | Nubank |
| SIC | Sicoob |
| MPG | Mercado Pago |
| IFB | Ifood Benefícios |
| CEF | Caixa Econômica Federal |

### Endpoints

- **GET** `/accounts/` - Lista todas as contas
- **POST** `/accounts/` - Cria uma nova conta
- **GET** `/accounts/{id}/` - Busca conta específica
- **PUT** `/accounts/{id}/` - Atualiza conta
- **DELETE** `/accounts/{id}/` - Exclui conta

### Campos Completos da Conta

**Campos obrigatórios:**
- `name`: Nome da instituição (NUB, SIC, MPG, IFB, CEF)
- `account_type`: Tipo da conta (CC, CS, FG, VA)
- `is_active`: Se a conta está ativa (padrão: true)

**Campos opcionais:**
- `account_image`: Imagem/logo da conta
- `account_number`: Número da conta (criptografado automaticamente)
- `agency`: Código da agência
- `bank_code`: Código do banco
- `current_balance`: Saldo atual (padrão: 0.00)
- `minimum_balance`: Saldo mínimo permitido (padrão: 0.00)
- `opening_date`: Data de abertura da conta
- `description`: Descrição ou observações
- `owner`: ID do membro proprietário da conta

### Exemplo de Conta (Completo)

```json
{
    "id": 1,
    "name": "NUB",
    "account_type": "CC",
    "account_image": "/media/accounts/nubank.png",
    "is_active": true,
    "account_number": "****1234",
    "agency": "0001",
    "bank_code": "260",
    "current_balance": "2500.50",
    "minimum_balance": "0.00",
    "opening_date": "2020-01-15",
    "description": "Conta principal",
    "owner": 1
}
```

**⚠️ Segurança:** O campo `account_number` é automaticamente criptografado ao ser salvo. Use a propriedade `account_number_masked` para obter a versão mascarada (****1234) nas respostas da API.

## 💸 Despesas (Expenses)

### Categorias de Despesas

| Código | Nome |
|--------|------|
| food and drink | Comida e bebida |
| bills and services | Contas e serviços |
| electronics | Eletrônicos |
| family and friends | Amizades e Família |
| pets | Animais de estimação |
| digital signs | Assinaturas digitais |
| house | Casa |
| purchases | Compras |
| donate | Doações |
| education | Educação |
| loans | Empréstimos |
| entertainment | Entretenimento |
| taxes | Impostos |
| investments | Investimentos |
| others | Outros |
| vestuary | Roupas |
| health and care | Saúde e cuidados pessoais |
| professional services | Serviços profissionais |
| supermarket | Supermercado |
| rates | Taxas |
| transport | Transporte |
| travels | Viagens |

### Filtros Disponíveis

- `category` - Filtrar por categoria
- `payed` - Filtrar por status de pagamento (true/false)
- `account` - Filtrar por conta (ID)
- `date_from` - Data inicial (YYYY-MM-DD)
- `date_to` - Data final (YYYY-MM-DD)

### Endpoints

- **GET** `/expenses/` - Lista todas as despesas
- **POST** `/expenses/` - Cria uma nova despesa
- **GET** `/expenses/{id}/` - Busca despesa específica
- **PUT** `/expenses/{id}/` - Atualiza despesa
- **DELETE** `/expenses/{id}/` - Exclui despesa

### Campos Completos da Despesa

**Campos obrigatórios:**
- `description`: Descrição da despesa
- `value`: Valor da despesa
- `date`: Data da despesa
- `horary`: Horário da despesa
- `category`: Categoria da despesa
- `account`: ID da conta
- `payed`: Se foi paga

**Campos opcionais:**
- `merchant`: Nome do estabelecimento
- `location`: Local da compra
- `payment_method`: Método de pagamento (cash, debit_card, credit_card, pix, transfer, check, other)
- `receipt`: Arquivo do comprovante
- `member`: ID do membro responsável
- `notes`: Observações
- `recurring`: Se é despesa recorrente (padrão: false)
- `frequency`: Frequência se recorrente (daily, weekly, monthly, quarterly, semiannual, annual)

### Exemplo de Despesa (Completo)

```json
{
    "id": 1,
    "description": "Supermercado Extra",
    "value": "234.50",
    "date": "2024-01-15",
    "horary": "19:30:00",
    "category": "supermarket",
    "account": 1,
    "payed": true,
    "merchant": "Extra Supermercados",
    "location": "Shopping ABC",
    "payment_method": "debit_card",
    "receipt": "/media/expenses/receipts/receipt_123.pdf",
    "member": 1,
    "notes": "Compras do mês",
    "recurring": false,
    "frequency": null
}
```

## 💳 Cartões de Crédito (Credit Cards)

### Bandeiras Disponíveis

| Código | Nome |
|--------|------|
| MSC | Master Card |
| VSA | Visa |
| ELO | Elo |
| EXP | American Express |
| HCD | Hipercard |

### ⚠️ Segurança do CVV

O campo `security_code` (CVV) é **automaticamente criptografado** antes de ser salvo no banco de dados usando criptografia Fernet. 

**Importante:**
- O CVV nunca é retornado nas respostas da API
- Deve conter apenas 3 ou 4 dígitos numéricos
- É obrigatório apenas na criação/atualização do cartão

### Endpoints - Cartões

- **GET** `/credit-cards/` - Lista todos os cartões
- **POST** `/credit-cards/` - Cria novo cartão
- **GET** `/credit-cards/{id}/` - Busca cartão específico
- **PUT** `/credit-cards/{id}/` - Atualiza cartão
- **DELETE** `/credit-cards/{id}/` - Exclui cartão

### Endpoints - Faturas

- **GET** `/credit-card-bills/` - Lista todas as faturas
- **POST** `/credit-card-bills/` - Cria nova fatura
- **GET** `/credit-card-bills/{id}/` - Busca fatura específica
- **PUT** `/credit-card-bills/{id}/` - Atualiza fatura
- **DELETE** `/credit-card-bills/{id}/` - Exclui fatura

### Endpoints - Despesas do Cartão

- **GET** `/credit-card-expenses/` - Lista despesas do cartão
- **POST** `/credit-card-expenses/` - Cria nova despesa
- **GET** `/credit-card-expenses/{id}/` - Busca despesa específica
- **PUT** `/credit-card-expenses/{id}/` - Atualiza despesa
- **DELETE** `/credit-card-expenses/{id}/` - Exclui despesa

### Campos Completos do Cartão

**Campos obrigatórios:**
- `name`: Nome do cartão
- `on_card_name`: Nome impresso no cartão
- `flag`: Bandeira (MSC, VSA, ELO, EXP, HCD)
- `validation_date`: Data de validade
- `security_code`: CVV (apenas na criação/atualização)
- `credit_limit`: Limite atual
- `max_limit`: Limite máximo
- `associated_account`: ID da conta associada

**Campos opcionais:**
- `card_number`: Número do cartão (criptografado)
- `is_active`: Se está ativo (padrão: true)
- `closing_day`: Dia de fechamento da fatura
- `due_day`: Dia de vencimento da fatura
- `interest_rate`: Taxa de juros (%)
- `annual_fee`: Anuidade
- `owner`: ID do proprietário
- `notes`: Observações

### Exemplo de Cartão (Resposta Completa)

```json
{
    "id": 1,
    "name": "Cartão Principal",
    "on_card_name": "JOAO DA SILVA",
    "flag": "MSC",
    "validation_date": "2028-12-31",
    "credit_limit": "5000.00",
    "max_limit": "10000.00",
    "associated_account": 1,
    "card_number": "****1234",
    "is_active": true,
    "closing_day": 15,
    "due_day": 10,
    "interest_rate": "2.50",
    "annual_fee": "120.00",
    "owner": 1,
    "notes": "Cartão para gastos principais"
}
```

**⚠️ Segurança:** O campo `card_number` é automaticamente criptografado ao ser salvo. Use a propriedade `card_number_masked` para obter a versão mascarada (****1234) nas respostas da API. O campo `security_code` (CVV) é criptografado e nunca retornado nas respostas.

### Exemplo de Cartão (Criação)

```json
{
    "name": "Cartão Reserva",
    "on_card_name": "MARIA DOS SANTOS",
    "flag": "VSA",
    "validation_date": "2029-06-30",
    "security_code": "456",
    "credit_limit": "3000.00",
    "max_limit": "8000.00",
    "associated_account": 1
}
```

## 📄 Faturas de Cartão (Credit Card Bills)

### Campos da Fatura

**Campos obrigatórios:**
- `credit_card`: ID do cartão de crédito
- `year`: Ano da fatura (2025, 2026, 2027, 2028, 2029, 2030)
- `month`: Mês da fatura (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)
- `invoice_beginning_date`: Data de início da fatura
- `invoice_ending_date`: Data de fim da fatura
- `closed`: Se a fatura está fechada

**Campos opcionais:**
- `total_amount`: Valor total da fatura (padrão: 0.00)
- `minimum_payment`: Valor mínimo para pagamento (padrão: 0.00)
- `due_date`: Data de vencimento
- `paid_amount`: Valor pago (padrão: 0.00)
- `payment_date`: Data do pagamento
- `interest_charged`: Juros cobrados (padrão: 0.00)
- `late_fee`: Multa por atraso (padrão: 0.00)
- `status`: Status da fatura (open, closed, paid, overdue)

### Exemplo de Fatura

```json
{
    "id": 1,
    "credit_card": 1,
    "year": "2024",
    "month": "Jan",
    "invoice_beginning_date": "2024-01-05",
    "invoice_ending_date": "2024-02-04",
    "closed": false,
    "total_amount": "1250.75",
    "minimum_payment": "125.00",
    "due_date": "2024-02-15",
    "paid_amount": "0.00",
    "payment_date": null,
    "interest_charged": "0.00",
    "late_fee": "0.00",
    "status": "open"
}
```

## 💳 Despesas de Cartão (Credit Card Expenses)

### Campos da Despesa de Cartão

**Campos obrigatórios:**
- `description`: Descrição da compra
- `value`: Valor da compra
- `date`: Data da compra
- `horary`: Horário da compra
- `category`: Categoria da despesa
- `card`: ID do cartão usado
- `installment`: Número da parcela atual
- `payed`: Se foi paga

**Campos opcionais:**
- `total_installments`: Total de parcelas (padrão: 1)
- `merchant`: Nome do estabelecimento
- `transaction_id`: ID da transação
- `location`: Local da compra
- `bill`: ID da fatura associada
- `member`: ID do membro responsável
- `notes`: Observações
- `receipt`: Comprovante da compra

### Exemplo de Despesa de Cartão

```json
{
    "id": 1,
    "description": "Compra online Amazon",
    "value": "299.90",
    "date": "2024-01-15",
    "horary": "14:20:00",
    "category": "electronics",
    "card": 1,
    "installment": 3,
    "payed": false,
    "total_installments": 6,
    "merchant": "Amazon Brasil",
    "transaction_id": "AMZ123456789",
    "location": "E-commerce",
    "bill": 1,
    "member": 1,
    "notes": "Fone de ouvido bluetooth",
    "receipt": "/media/credit_cards/receipts/amazon_receipt.pdf"
}
```

## 💵 Receitas (Revenues)

### Categorias de Receitas

| Código | Nome |
|--------|------|
| deposit | Depósito |
| award | Prêmio |
| salary | Salário |
| ticket | Vale |
| income | Rendimentos |
| refund | Reembolso |
| cashback | Cashback |
| transfer | Transferência Recebida |
| received_loan | Empréstimo Recebido |
| loan_devolution | Devolução de empréstimo |

### Endpoints

- **GET** `/revenues/` - Lista todas as receitas
- **POST** `/revenues/` - Cria nova receita
- **GET** `/revenues/{id}/` - Busca receita específica
- **PUT** `/revenues/{id}/` - Atualiza receita
- **DELETE** `/revenues/{id}/` - Exclui receita

### Campos Completos da Receita

**Campos obrigatórios:**
- `description`: Descrição da receita
- `value`: Valor bruto
- `date`: Data da receita
- `horary`: Horário da receita
- `category`: Categoria da receita
- `account`: ID da conta
- `received`: Se foi recebida

**Campos opcionais:**
- `source`: Fonte da receita
- `tax_amount`: Valor de impostos (padrão: 0.00)
- `net_amount`: Valor líquido (calculado automaticamente)
- `member`: ID do membro responsável
- `receipt`: Arquivo do comprovante
- `recurring`: Se é receita recorrente (padrão: false)
- `frequency`: Frequência se recorrente
- `notes`: Observações

### Exemplo de Receita (Completa)

```json
{
    "id": 1,
    "description": "Salário Janeiro",
    "value": "4500.00",
    "date": "2024-01-05",
    "horary": "08:00:00",
    "category": "salary",
    "account": 1,
    "received": true,
    "source": "Empresa XYZ Ltda",
    "tax_amount": "450.00",
    "net_amount": "4050.00",
    "member": 1,
    "receipt": "/media/revenues/receipts/holerite_jan.pdf",
    "recurring": true,
    "frequency": "monthly",
    "notes": "Salário fixo mensal"
}
```

## 👥 Membros (Members)

Sistema unificado para cadastro de pessoas relacionadas (família, amigos, credores, beneficiários, usuários).

### Campos Obrigatórios

- `name` - Nome completo
- `document` - Documento (CPF/CNPJ) - único
- `phone` - Telefone
- `sex` - Sexo (M - Masculino / F - Feminino)

### Campos Opcionais

- `email` - Email válido (opcional)
- `is_user` - Se é usuário do sistema (padrão: true)
- `is_creditor` - Se pode ser credor em empréstimos (padrão: true)  
- `is_benefited` - Se pode ser beneficiário (padrão: true)
- `active` - Status ativo (padrão: true)

### Endpoints

- **GET** `/members/` - Lista todos os membros
- **POST** `/members/` - Cria novo membro
- **GET** `/members/{id}/` - Busca membro específico
- **PUT** `/members/{id}/` - Atualiza membro
- **DELETE** `/members/{id}/` - Exclui membro

### Filtros Disponíveis

- `is_user=true/false` - Filtrar apenas usuários
- `is_creditor=true/false` - Filtrar apenas credores
- `is_benefited=true/false` - Filtrar apenas beneficiários
- `active=true/false` - Filtrar por status

### Campos Completos do Membro

**Campos obrigatórios:**
- `name`: Nome completo
- `document`: Documento (CPF/CNPJ) - único
- `phone`: Telefone
- `sex`: Sexo (M - Masculino / F - Feminino)

**Campos opcionais básicos:**
- `email`: Email válido
- `user`: ID do usuário do sistema (OneToOneField, opcional)
- `is_creditor`: Se pode ser credor (padrão: true)
- `is_benefited`: Se pode ser beneficiário (padrão: true)
- `active`: Status ativo (padrão: true)

**Novos campos opcionais:**
- `birth_date`: Data de nascimento
- `address`: Endereço completo
- `profile_photo`: Foto de perfil
- `emergency_contact`: Contato de emergência
- `monthly_income`: Renda mensal
- `occupation`: Profissão/ocupação
- `notes`: Observações

### Exemplo de Membro (Completo)

```json
{
    "id": 1,
    "name": "João da Silva",
    "document": "12345678901",
    "phone": "11999887766",
    "email": "joao.silva@email.com",
    "sex": "M",
    "is_user": true,
    "is_creditor": true,
    "is_benefited": true,
    "active": true,
    "birth_date": "1990-05-15",
    "address": "Rua das Flores, 123 - São Paulo/SP",
    "profile_photo": "/media/members/photos/joao.jpg",
    "emergency_contact": "Maria Silva - 11888777666",
    "monthly_income": "5000.00",
    "occupation": "Desenvolvedor",
    "notes": "Membro fundador",
    "age": 34,
    "is_user_linked": true
}
```

**Propriedades calculadas:**
- `age`: Idade calculada baseada na data de nascimento
- `is_user`: True se vinculado a um usuário do sistema (campo calculado)

### Validações

- `document` deve ser único no sistema
- `email` deve ter formato válido quando informado
- `sex` deve ser 'M' ou 'F'
- Ao menos um dos flags (is_user, is_creditor, is_benefited) deve ser true

## 🔄 Transferências (Transfers)

Sistema para registrar transferências entre contas próprias.

### Validações

- A conta de origem deve ser diferente da conta de destino
- Ambas as contas devem existir e estar ativas
- O valor deve ser positivo

### Endpoints

- **GET** `/transfers/` - Lista todas as transferências
- **POST** `/transfers/` - Cria nova transferência
- **GET** `/transfers/{id}/` - Busca transferência específica
- **PUT** `/transfers/{id}/` - Atualiza transferência
- **DELETE** `/transfers/{id}/` - Exclui transferência

### Campos Completos da Transferência

**Campos obrigatórios:**
- `description`: Descrição da transferência
- `value`: Valor transferido
- `date`: Data da transferência
- `horary`: Horário da transferência
- `category`: Tipo de transferência (doc, ted, pix)
- `origin_account`: ID da conta de origem
- `destiny_account`: ID da conta de destino
- `transfered`: Se foi transferido

**Campos opcionais:**
- `transaction_id`: ID único da transação
- `fee`: Taxa cobrada (padrão: 0.00)
- `exchange_rate`: Taxa de câmbio (se aplicável)
- `processed_at`: Data/hora do processamento
- `confirmation_code`: Código de confirmação
- `notes`: Observações
- `receipt`: Comprovante da transferência
- `member`: ID do membro responsável

### Exemplo de Transferência (Completa)

```json
{
    "id": 1,
    "description": "Transferência para poupança",
    "value": "500.00",
    "date": "2024-01-18",
    "horary": "10:15:00",
    "category": "pix",
    "origin_account": 1,
    "destiny_account": 2,
    "transfered": true,
    "transaction_id": "TXN123456789",
    "fee": "0.00",
    "exchange_rate": null,
    "processed_at": "2024-01-18T10:15:23Z",
    "confirmation_code": "CONF789",
    "notes": "Reserva de emergência",
    "receipt": "/media/transfers/receipts/transfer_123.pdf",
    "member": 1
}
```

## 💰 Empréstimos (Loans)

Sistema para controlar empréstimos feitos a terceiros.

### Campos

- `description` - Descrição do empréstimo
- `value` - Valor total do empréstimo
- `payed_value` - Valor já recebido de volta
- `date` - Data do empréstimo
- `horary` - Horário do empréstimo
- `category` - Categoria do empréstimo
- `account` - Conta de onde saiu o dinheiro
- `creditor` - Pessoa que deve (referência ao membro)

### Validações

- O valor pago não pode ser maior que o valor total
- O credor deve ser um membro válido

### Endpoints

- **GET** `/loans/` - Lista todos os empréstimos
- **POST** `/loans/` - Cria novo empréstimo
- **GET** `/loans/{id}/` - Busca empréstimo específico
- **PUT** `/loans/{id}/` - Atualiza empréstimo
- **DELETE** `/loans/{id}/` - Exclui empréstimo

### Campos Completos do Empréstimo

**Campos obrigatórios:**
- `description`: Descrição do empréstimo
- `value`: Valor total
- `payed_value`: Valor já pago
- `date`: Data do empréstimo
- `horary`: Horário do empréstimo
- `category`: Categoria da despesa
- `account`: ID da conta
- `benefited`: ID do beneficiado (quem recebeu)
- `creditor`: ID do credor (quem emprestou)
- `payed`: Se foi quitado

**Campos opcionais:**
- `interest_rate`: Taxa de juros (%)
- `installments`: Número de parcelas (padrão: 1)
- `due_date`: Data de vencimento
- `contract_document`: Documento do contrato
- `payment_frequency`: Frequência de pagamento (padrão: monthly)
- `late_fee`: Multa por atraso (padrão: 0.00)
- `guarantor`: ID do avalista
- `notes`: Observações
- `status`: Status (active, paid, overdue, cancelled)

### Exemplo de Empréstimo (Completo)

```json
{
    "id": 1,
    "description": "Empréstimo para reforma",
    "value": "5000.00",
    "payed_value": "1500.00",
    "date": "2024-01-10",
    "horary": "09:00:00",
    "category": "house",
    "account": 1,
    "benefited": 2,
    "creditor": 1,
    "payed": false,
    "interest_rate": "2.00",
    "installments": 12,
    "due_date": "2024-12-10",
    "contract_document": "/media/loans/contracts/contrato_123.pdf",
    "payment_frequency": "monthly",
    "late_fee": "50.00",
    "guarantor": 3,
    "notes": "Empréstimo para reforma da cozinha",
    "status": "active"
}
```

## 🛡️ Permissões

A API utiliza um sistema de permissões baseado no sistema padrão do Django. Cada modelo possui as seguintes permissões:

- `view_{model}` - Visualizar registros
- `add_{model}` - Criar novos registros  
- `change_{model}` - Editar registros existentes
- `delete_{model}` - Excluir registros

### Verificar Permissões do Usuário

**GET** `/authentication/user-permissions/`

```json
{
    "username": "admin",
    "permissions": [
        "accounts.add_account",
        "accounts.view_account",
        "expenses.add_expense",
        "expenses.view_expense"
    ],
    "is_staff": true,
    "is_superuser": true
}
```

## ❌ Tratamento de Erros

### Erros de Validação (400)

```json
{
    "field_name": [
        "Error message describing what's wrong"
    ],
    "another_field": [
        "Another error message"
    ]
}
```

### Erro de Autenticação (401)

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

### Erro de Permissão (403)

```json
{
    "detail": "You do not have permission to perform this action."
}
```

### Recurso Não Encontrado (404)

```json
{
    "detail": "Not found."
}
```

## 📋 Opções de Enumeração

### Frequências de Pagamento (PAYMENT_FREQUENCY_CHOICES)

| Código | Nome |
|--------|------|
| daily | Diário |
| weekly | Semanal |
| monthly | Mensal |
| quarterly | Trimestral |
| semiannual | Semestral |
| annual | Anual |

### Métodos de Pagamento (PAYMENT_METHOD_CHOICES)

| Código | Nome |
|--------|------|
| cash | Dinheiro |
| debit_card | Cartão de Débito |
| credit_card | Cartão de Crédito |
| pix | PIX |
| transfer | Transferência |
| check | Cheque |
| other | Outro |

### Status de Empréstimo (LOAN_STATUS_CHOICES)

| Código | Nome |
|--------|------|
| active | Ativo |
| paid | Quitado |
| overdue | Em atraso |
| cancelled | Cancelado |

### Status de Fatura (BILL_STATUS_CHOICES)

| Código | Nome |
|--------|------|
| open | Aberta |
| closed | Fechada |
| paid | Paga |
| overdue | Em atraso |

### Categorias de Transferência (TRANSFER_CATEGORIES)

| Código | Nome |
|--------|------|
| doc | DOC |
| ted | TED |
| pix | PIX |

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente Obrigatórias

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expenselit
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Django
SECRET_KEY=sua_secret_key_django
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@exemplo.com
DJANGO_SUPERUSER_PASSWORD=senha_admin

# Criptografia (OBRIGATÓRIA para segurança do CVV)
ENCRYPTION_KEY=sua_chave_fernet_base64
```

### Gerar Chave de Criptografia

```bash
python -c "from cryptography.fernet import Fernet; print('ENCRYPTION_KEY=' + Fernet.generate_key().decode())"
```

## 📝 Notas Importantes

1. **Segurança**: Todos os CVVs são criptografados automaticamente
2. **Autenticação**: Tokens JWT têm tempo de vida limitado
3. **Permissões**: Sistema baseado em grupos e permissões do Django
4. **Validações**: Campos obrigatórios e validações customizadas implementadas
5. **Soft Delete**: Não implementado - exclusões são definitivas
6. **Paginação**: Não implementada na versão atual
7. **Filtros**: Disponíveis apenas em alguns endpoints

## 🚀 Próximas Melhorias Planejadas

- [ ] Implementar paginação
- [ ] Adicionar mais filtros
- [ ] Implementar soft delete
- [ ] Adicionar endpoints de relatórios
- [ ] Implementar cache
- [ ] Adicionar validações de negócio mais robustas
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte a collection do Postman
3. Execute os testes unitários
4. Verifique os logs da aplicação