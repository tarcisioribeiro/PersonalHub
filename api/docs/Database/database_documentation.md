# Documentação do Banco de Dados - ExpenseLit API

## Visão Geral

O banco de dados da ExpenseLit API é estruturado para gerenciar um sistema completo de controle financeiro pessoal, incluindo contas bancárias, despesas, receitas, empréstimos, cartões de crédito e transferências.

## Tabelas Principais

### 1. members_member

**Descrição:** Tabela que armazena informações dos membros/usuários do sistema.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| name | varchar(200) | NOT NULL | Nome completo |
| document | varchar(200) | NOT NULL | Documento (CPF/CNPJ) - UNIQUE |
| phone | varchar(200) | NOT NULL | Telefone |
| email | varchar(200) | NULL | Email |
| sex | varchar(200) | NOT NULL | Sexo |
| is_creditor | boolean | NOT NULL | Se é credor |
| is_benefited | boolean | NOT NULL | Se é beneficiado |
| active | boolean | NOT NULL | Status ativo |
| birth_date | date | NULL | Data de nascimento |
| address | text | NULL | Endereço |
| profile_photo | varchar(100) | NULL | Foto do perfil |
| emergency_contact | varchar(200) | NULL | Contato de emergência |
| monthly_income | numeric(10,2) | NULL | Renda mensal |
| occupation | varchar(200) | NULL | Ocupação |
| notes | text | NULL | Observações |
| created_by_id | integer | NULL | FK para auth_user |
| updated_by_id | integer | NULL | FK para auth_user |
| user_id | integer | NULL | FK para auth_user - UNIQUE |

**Relacionamentos:**
- `user_id` → `auth_user.id` (ONE-TO-ONE)
- Referenciado por: accounts_account, expenses_expense, revenues_revenue, loans_loan, credit_cards_creditcard, etc.

---

### 2. accounts_account

**Descrição:** Tabela que armazena informações das contas bancárias dos membros.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| account_name | varchar(200) | NOT NULL | Nome da conta |
| institution_name | varchar(200) | NOT NULL | Nome da instituição - UNIQUE |
| account_type | varchar(100) | NOT NULL | Tipo da conta |
| account_image | varchar(100) | NULL | Imagem da conta |
| is_active | boolean | NOT NULL | Status ativo |
| _account_number | text | NULL | Número da conta (criptografado) |
| agency | varchar(20) | NULL | Agência |
| bank_code | varchar(10) | NULL | Código do banco |
| current_balance | numeric(15,2) | NOT NULL | Saldo atual |
| minimum_balance | numeric(15,2) | NOT NULL | Saldo mínimo |
| opening_date | date | NULL | Data de abertura |
| description | text | NULL | Descrição |
| created_by_id | integer | NULL | FK para auth_user |
| owner_id | bigint | NULL | FK para members_member |
| updated_by_id | integer | NULL | FK para auth_user |

**Relacionamentos:**
- `owner_id` → `members_member.id`
- Referenciado por: expenses_expense, revenues_revenue, loans_loan, transfers_transfer, credit_cards_creditcard

---

### 3. expenses_expense

**Descrição:** Tabela que armazena todas as despesas do sistema.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| description | varchar(100) | NOT NULL | Descrição da despesa |
| value | numeric(10,2) | NOT NULL | Valor da despesa |
| date | date | NOT NULL | Data da despesa |
| horary | time | NOT NULL | Horário da despesa |
| category | varchar(200) | NOT NULL | Categoria |
| payed | boolean | NOT NULL | Se foi pago |
| merchant | varchar(200) | NULL | Comerciante |
| location | varchar(200) | NULL | Local |
| payment_method | varchar(20) | NULL | Método de pagamento |
| receipt | varchar(100) | NULL | Comprovante |
| notes | text | NULL | Observações |
| recurring | boolean | NOT NULL | Se é recorrente |
| frequency | varchar(20) | NULL | Frequência |
| account_id | bigint | NOT NULL | FK para accounts_account |
| created_by_id | integer | NULL | FK para auth_user |
| member_id | bigint | NULL | FK para members_member |
| updated_by_id | integer | NULL | FK para auth_user |

**Índices Especiais:**
- Índice composto: (account_id, category)
- Índice composto: (account_id, date)
- Índice composto: (category, date)
- Índice ordenado: date DESC
- Índice composto: (payed, date)

**Relacionamentos:**
- `account_id` → `accounts_account.id`
- `member_id` → `members_member.id`

---

### 4. revenues_revenue

**Descrição:** Tabela que armazena todas as receitas do sistema.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| description | varchar(200) | NOT NULL | Descrição da receita |
| value | numeric(10,2) | NOT NULL | Valor da receita |
| date | date | NOT NULL | Data da receita |
| horary | time | NOT NULL | Horário da receita |
| category | varchar(200) | NOT NULL | Categoria |
| received | boolean | NOT NULL | Se foi recebido |
| source | varchar(200) | NULL | Fonte |
| tax_amount | numeric(10,2) | NOT NULL | Valor do imposto |
| net_amount | numeric(10,2) | NULL | Valor líquido |
| receipt | varchar(100) | NULL | Comprovante |
| recurring | boolean | NOT NULL | Se é recorrente |
| frequency | varchar(20) | NULL | Frequência |
| notes | text | NULL | Observações |
| account_id | bigint | NOT NULL | FK para accounts_account |
| created_by_id | integer | NULL | FK para auth_user |
| member_id | bigint | NULL | FK para members_member |
| updated_by_id | integer | NULL | FK para auth_user |

**Índices Especiais:**
- Índice composto: (account_id, date)
- Índice composto: (account_id, category)
- Índice composto: (category, date)
- Índice ordenado: date DESC
- Índice composto: (received, date)

**Relacionamentos:**
- `account_id` → `accounts_account.id`
- `member_id` → `members_member.id`

---

### 5. loans_loan

**Descrição:** Tabela que armazena informações sobre empréstimos.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| description | varchar(200) | NOT NULL | Descrição do empréstimo |
| value | numeric(10,2) | NOT NULL | Valor do empréstimo |
| payed_value | numeric(10,2) | NOT NULL | Valor pago |
| date | date | NOT NULL | Data do empréstimo |
| horary | time | NOT NULL | Horário |
| category | varchar(200) | NOT NULL | Categoria |
| payed | boolean | NOT NULL | Se foi pago |
| interest_rate | numeric(5,2) | NULL | Taxa de juros |
| installments | integer | NOT NULL | Número de parcelas |
| due_date | date | NULL | Data de vencimento |
| contract_document | varchar(100) | NULL | Documento do contrato |
| payment_frequency | varchar(20) | NOT NULL | Frequência de pagamento |
| late_fee | numeric(10,2) | NOT NULL | Taxa de atraso |
| notes | text | NULL | Observações |
| status | varchar(20) | NOT NULL | Status |
| account_id | bigint | NOT NULL | FK para accounts_account |
| benefited_id | bigint | NOT NULL | FK para members_member (beneficiado) |
| created_by_id | integer | NULL | FK para auth_user |
| creditor_id | bigint | NOT NULL | FK para members_member (credor) |
| guarantor_id | bigint | NULL | FK para members_member (fiador) |
| updated_by_id | integer | NULL | FK para auth_user |

**Relacionamentos:**
- `account_id` → `accounts_account.id`
- `benefited_id` → `members_member.id`
- `creditor_id` → `members_member.id`
- `guarantor_id` → `members_member.id`

---

### 6. credit_cards_creditcard

**Descrição:** Tabela que armazena informações dos cartões de crédito.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| name | varchar(200) | NOT NULL | Nome do cartão |
| on_card_name | varchar(200) | NOT NULL | Nome impresso no cartão |
| flag | varchar(200) | NOT NULL | Bandeira |
| validation_date | date | NOT NULL | Data de validade |
| _security_code | text | NOT NULL | Código de segurança (criptografado) |
| credit_limit | numeric(10,2) | NOT NULL | Limite de crédito |
| max_limit | numeric(10,2) | NOT NULL | Limite máximo |
| _card_number | text | NULL | Número do cartão (criptografado) |
| is_active | boolean | NOT NULL | Status ativo |
| closing_day | integer | NULL | Dia de fechamento |
| due_day | integer | NULL | Dia de vencimento |
| interest_rate | numeric(5,2) | NULL | Taxa de juros |
| annual_fee | numeric(10,2) | NULL | Anuidade |
| notes | text | NULL | Observações |
| associated_account_id | bigint | NOT NULL | FK para accounts_account |
| created_by_id | integer | NULL | FK para auth_user |
| owner_id | bigint | NULL | FK para members_member |
| updated_by_id | integer | NULL | FK para auth_user |

**Relacionamentos:**
- `associated_account_id` → `accounts_account.id`
- `owner_id` → `members_member.id`
- Referenciado por: credit_cards_creditcardexpense, credit_cards_creditcardbill

---

### 7. credit_cards_creditcardexpense

**Descrição:** Tabela que armazena despesas realizadas com cartão de crédito.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| description | varchar(200) | NOT NULL | Descrição da despesa |
| value | numeric(10,2) | NOT NULL | Valor da despesa |
| date | date | NOT NULL | Data da compra |
| horary | time | NOT NULL | Horário |
| category | varchar(200) | NOT NULL | Categoria |
| installment | integer | NOT NULL | Parcela atual |
| payed | boolean | NOT NULL | Se foi pago |
| total_installments | integer | NOT NULL | Total de parcelas |
| merchant | varchar(200) | NULL | Comerciante |
| transaction_id | varchar(100) | NULL | ID da transação |
| location | varchar(200) | NULL | Local |
| notes | text | NULL | Observações |
| receipt | varchar(100) | NULL | Comprovante |
| bill_id | bigint | NULL | FK para credit_cards_creditcardbill |
| card_id | bigint | NOT NULL | FK para credit_cards_creditcard |
| created_by_id | integer | NULL | FK para auth_user |
| member_id | bigint | NULL | FK para members_member |
| updated_by_id | integer | NULL | FK para auth_user |

**Constraints:**
- `installment >= 0` (check constraint)

**Relacionamentos:**
- `card_id` → `credit_cards_creditcard.id`
- `bill_id` → `credit_cards_creditcardbill.id`
- `member_id` → `members_member.id`

---

### 8. credit_cards_creditcardbill

**Descrição:** Tabela que armazena as faturas dos cartões de crédito.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| year | varchar | NOT NULL | Ano |
| month | varchar | NOT NULL | Mês |
| invoice_beginning_date | date | NOT NULL | Data inicial da fatura |
| invoice_ending_date | date | NOT NULL | Data final da fatura |
| closed | boolean | NOT NULL | Se está fechada |
| total_amount | numeric(10,2) | NOT NULL | Valor total |
| minimum_payment | numeric(10,2) | NOT NULL | Pagamento mínimo |
| due_date | date | NULL | Data de vencimento |
| paid_amount | numeric(10,2) | NOT NULL | Valor pago |
| payment_date | date | NULL | Data do pagamento |
| interest_charged | numeric(10,2) | NOT NULL | Juros cobrados |
| late_fee | numeric(10,2) | NOT NULL | Multa por atraso |
| status | varchar(20) | NOT NULL | Status |
| created_by_id | integer | NULL | FK para auth_user |
| credit_card_id | bigint | NOT NULL | FK para credit_cards_creditcard |
| updated_by_id | integer | NULL | FK para auth_user |

**Relacionamentos:**
- `credit_card_id` → `credit_cards_creditcard.id`
- Referenciado por: credit_cards_creditcardexpense

---

### 9. transfers_transfer

**Descrição:** Tabela que armazena transferências entre contas.

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| id | bigint | NOT NULL | Chave primária (autoincrement) |
| uuid | uuid | NOT NULL | Identificador único universal |
| created_at | timestamp with time zone | NOT NULL | Data de criação |
| updated_at | timestamp with time zone | NOT NULL | Data da última atualização |
| is_deleted | boolean | NOT NULL | Flag de exclusão lógica |
| deleted_at | timestamp with time zone | NULL | Data de exclusão |
| description | varchar(200) | NOT NULL | Descrição da transferência |
| value | numeric(10,2) | NOT NULL | Valor |
| date | date | NOT NULL | Data |
| horary | time | NOT NULL | Horário |
| category | varchar(200) | NOT NULL | Categoria |
| transfered | boolean | NOT NULL | Se foi transferido |
| transaction_id | varchar(100) | NULL | ID da transação - UNIQUE |
| fee | numeric(10,2) | NOT NULL | Taxa |
| exchange_rate | numeric(10,6) | NULL | Taxa de câmbio |
| processed_at | timestamp with time zone | NULL | Data de processamento |
| confirmation_code | varchar(50) | NULL | Código de confirmação |
| notes | text | NULL | Observações |
| receipt | varchar(100) | NULL | Comprovante |
| created_by_id | integer | NULL | FK para auth_user |
| destiny_account_id | bigint | NOT NULL | FK para accounts_account (destino) |
| member_id | bigint | NULL | FK para members_member |
| origin_account_id | bigint | NOT NULL | FK para accounts_account (origem) |
| updated_by_id | integer | NULL | FK para auth_user |

**Relacionamentos:**
- `origin_account_id` → `accounts_account.id`
- `destiny_account_id` → `accounts_account.id`
- `member_id` → `members_member.id`

---

## Tabelas do Sistema Django

### auth_user
Tabela padrão do Django para autenticação de usuários.

### auth_group
Tabela padrão do Django para grupos de usuários.

### auth_permission
Tabela padrão do Django para permissões.

### django_admin_log
Tabela padrão do Django para logs de administração.

### django_content_type
Tabela padrão do Django para tipos de conteúdo.

### django_migrations
Tabela padrão do Django para controle de migrações.

### django_session
Tabela padrão do Django para sessões de usuários.

---

## Padrões de Design

### Campos Comuns
Todas as tabelas principais seguem um padrão de campos base:
- `id`: Chave primária autoincrement
- `uuid`: Identificador único universal
- `created_at`: Timestamp de criação
- `updated_at`: Timestamp de atualização
- `is_deleted`: Flag para exclusão lógica
- `deleted_at`: Timestamp de exclusão
- `created_by_id`: FK para usuário que criou
- `updated_by_id`: FK para usuário que atualizou

### Relacionamentos
- Uso extensivo de Foreign Keys para manter integridade referencial
- Relacionamento many-to-one com `members_member` para ownership
- Relacionamento many-to-one com `accounts_account` para transações financeiras

### Índices
- Índices compostos estratégicos para otimização de consultas frequentes
- Índices únicos para garantir integridade de dados (UUID, documentos, etc.)
- Índices ordenados para consultas temporais

### Segurança
- Campos sensíveis são prefixados com `_` e armazenados criptografados:
  - `_account_number`
  - `_security_code`
  - `_card_number`

---

*Documentação gerada automaticamente em 04/09/2025*