# Security Module API Endpoints

Base URL: `http://localhost:30001/api/v1/security/`

## Authentication
Todos os endpoints requerem autenticação JWT via cookie httpOnly.

---

## Passwords

### List/Create Passwords
```
GET    /api/v1/security/passwords/
POST   /api/v1/security/passwords/
```

**GET Response (PasswordSerializer):**
```json
[
  {
    "id": 1,
    "uuid": "abc-123",
    "title": "Gmail",
    "site": "https://gmail.com",
    "username": "user@email.com",
    "category": "email",
    "category_display": "E-mail",
    "notes": "Minha conta pessoal",
    "last_password_change": "2024-01-15T10:30:00Z",
    "owner": 1,
    "owner_name": "João Silva",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```
**Note:** O campo `password` não é retornado neste endpoint.

**POST Request (PasswordCreateUpdateSerializer):**
```json
{
  "title": "Gmail",
  "site": "https://gmail.com",
  "username": "user@email.com",
  "password": "minha_senha_secreta",
  "category": "email",
  "notes": "Minha conta pessoal",
  "owner": 1
}
```

### Get/Update/Delete Password
```
GET    /api/v1/security/passwords/{id}/
PUT    /api/v1/security/passwords/{id}/
PATCH  /api/v1/security/passwords/{id}/
DELETE /api/v1/security/passwords/{id}/
```

**DELETE:** Implementa soft delete.

### Reveal Password (Decrypt)
```
GET    /api/v1/security/passwords/{id}/reveal/
```

**Response (PasswordRevealSerializer):**
```json
{
  "id": 1,
  "title": "Gmail",
  "username": "user@email.com",
  "password": "minha_senha_secreta"
}
```

**Security:**
- Registra log de auditoria em `ActivityLog`
- Requer permissão `view_password`

---

## Stored Credit Cards

### List/Create Cards
```
GET    /api/v1/security/stored-cards/
POST   /api/v1/security/stored-cards/
```

**GET Response (StoredCreditCardSerializer):**
```json
[
  {
    "id": 1,
    "uuid": "def-456",
    "name": "Cartão Nubank",
    "card_number_masked": "************1234",
    "cardholder_name": "JOAO SILVA",
    "expiration_month": 12,
    "expiration_year": 2027,
    "flag": "MSC",
    "flag_display": "Mastercard",
    "notes": "Cartão principal",
    "owner": 1,
    "owner_name": "João Silva",
    "finance_card": 5,
    "finance_card_name": "Nubank",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**POST Request (StoredCreditCardCreateUpdateSerializer):**
```json
{
  "name": "Cartão Nubank",
  "card_number": "5555444433332222",
  "security_code": "123",
  "cardholder_name": "JOAO SILVA",
  "expiration_month": 12,
  "expiration_year": 2027,
  "flag": "MSC",
  "notes": "Cartão principal",
  "owner": 1,
  "finance_card": 5
}
```

### Get/Update/Delete Card
```
GET    /api/v1/security/stored-cards/{id}/
PUT    /api/v1/security/stored-cards/{id}/
PATCH  /api/v1/security/stored-cards/{id}/
DELETE /api/v1/security/stored-cards/{id}/
```

### Reveal Card (Decrypt)
```
GET    /api/v1/security/stored-cards/{id}/reveal/
```

**Response (StoredCreditCardRevealSerializer):**
```json
{
  "id": 1,
  "name": "Cartão Nubank",
  "card_number": "5555444433332222",
  "security_code": "123",
  "cardholder_name": "JOAO SILVA",
  "expiration_month": 12,
  "expiration_year": 2027
}
```

---

## Stored Bank Accounts

### List/Create Accounts
```
GET    /api/v1/security/stored-accounts/
POST   /api/v1/security/stored-accounts/
```

**GET Response (StoredBankAccountSerializer):**
```json
[
  {
    "id": 1,
    "uuid": "ghi-789",
    "name": "Conta Nubank",
    "institution_name": "Nubank",
    "account_type": "CC",
    "account_type_display": "Conta Corrente",
    "account_number_masked": "*****6789",
    "agency": "0001",
    "notes": "Conta principal",
    "owner": 1,
    "owner_name": "João Silva",
    "finance_account": 3,
    "finance_account_name": "Nubank",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**POST Request (StoredBankAccountCreateUpdateSerializer):**
```json
{
  "name": "Conta Nubank",
  "institution_name": "Nubank",
  "account_type": "CC",
  "account_number": "123456789",
  "agency": "0001",
  "password": "senha_bancaria",
  "digital_password": "123456",
  "notes": "Conta principal",
  "owner": 1,
  "finance_account": 3
}
```

### Get/Update/Delete Account
```
GET    /api/v1/security/stored-accounts/{id}/
PUT    /api/v1/security/stored-accounts/{id}/
PATCH  /api/v1/security/stored-accounts/{id}/
DELETE /api/v1/security/stored-accounts/{id}/
```

### Reveal Account (Decrypt)
```
GET    /api/v1/security/stored-accounts/{id}/reveal/
```

**Response (StoredBankAccountRevealSerializer):**
```json
{
  "id": 1,
  "name": "Conta Nubank",
  "institution_name": "Nubank",
  "account_number": "123456789",
  "agency": "0001",
  "password": "senha_bancaria",
  "digital_password": "123456"
}
```

---

## Archives

### List/Create Archives
```
GET    /api/v1/security/archives/
POST   /api/v1/security/archives/
```

**GET Response (ArchiveSerializer):**
```json
[
  {
    "id": 1,
    "uuid": "jkl-012",
    "title": "Notas Importantes",
    "category": "personal",
    "category_display": "Pessoal",
    "archive_type": "text",
    "archive_type_display": "Texto",
    "file_size": 1024,
    "notes": "Arquivo confidencial",
    "tags": "importante,privado",
    "has_text": true,
    "has_file": false,
    "encrypted_file": null,
    "owner": 1,
    "owner_name": "João Silva",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**POST Request (ArchiveCreateUpdateSerializer):**
```json
{
  "title": "Notas Importantes",
  "category": "personal",
  "archive_type": "text",
  "text_content": "Este é um texto confidencial...",
  "notes": "Arquivo confidencial",
  "tags": "importante,privado",
  "owner": 1
}
```

### Get/Update/Delete Archive
```
GET    /api/v1/security/archives/{id}/
PUT    /api/v1/security/archives/{id}/
PATCH  /api/v1/security/archives/{id}/
DELETE /api/v1/security/archives/{id}/
```

### Reveal Archive (Decrypt)
```
GET    /api/v1/security/archives/{id}/reveal/
```

**Response (ArchiveRevealSerializer):**
```json
{
  "id": 1,
  "title": "Notas Importantes",
  "text_content": "Este é um texto confidencial..."
}
```

---

## Activity Logs

### List Activity Logs
```
GET    /api/v1/security/activity-logs/
```

**Response (ActivityLogSerializer):**
```json
[
  {
    "id": 1,
    "action": "reveal",
    "action_display": "Revelação de Senha/Credencial",
    "model_name": "Password",
    "object_id": 5,
    "description": "Revelou senha: Gmail",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "user": 1,
    "username": "joao",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Note:** Logs são somente leitura (read-only).

---

## Action Types

```python
ACTION_TYPES = (
    ('view', 'Visualização'),
    ('create', 'Criação'),
    ('update', 'Atualização'),
    ('delete', 'Exclusão'),
    ('reveal', 'Revelação de Senha/Credencial'),
    ('download', 'Download de Arquivo'),
    ('login', 'Login'),
    ('logout', 'Logout'),
    ('failed_login', 'Tentativa de Login Falha'),
    ('other', 'Outro')
)
```

---

## Security Features

1. **Encryption:** Todos os dados sensíveis são criptografados com Fernet (campos começando com `_`)
2. **Audit Logging:** Todas as operações de revelação são registradas em `ActivityLog`
3. **Soft Delete:** DELETE não remove registros, apenas marca como deletado
4. **Ownership:** Usuários só podem acessar seus próprios dados (filtro por `owner__user`)
5. **IP Tracking:** Endereço IP registrado em logs de atividade
6. **User Agent:** Informações do navegador registradas em logs

---

## Error Responses

```json
{
  "detail": "Authentication credentials were not provided."
}
```

```json
{
  "detail": "Not found."
}
```

```json
{
  "field_name": [
    "This field is required."
  ]
}
```
