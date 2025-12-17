/**
 * Schemas de Validação com Zod
 *
 * VAL-03: Validação client-side robusta para todos os formulários
 *
 * Benefícios:
 * - Type-safe: TypeScript infere tipos automaticamente dos schemas
 * - Mensagens de erro em português
 * - Validações complexas (regex, custom validators)
 * - Integração com react-hook-form via zodResolver
 */

import { z } from 'zod';

// ============================================================================
// HELPERS E VALIDAÇÕES CUSTOMIZADAS
// ============================================================================

/**
 * Helper para mensagens de erro em português
 */
const requiredError = (field: string) => `${field} é obrigatório`;
const minError = (field: string, min: number) => `${field} deve ter no mínimo ${min} caracteres`;
const maxError = (field: string, max: number) => `${field} deve ter no máximo ${max} caracteres`;
const emailError = 'Email inválido';
const numberError = (field: string) => `${field} deve ser um número válido`;
const positiveError = (field: string) => `${field} deve ser maior que zero`;

/**
 * Validação de CPF (formato: 000.000.000-00 ou 00000000000)
 */
const cpfRegex = /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/;
const isCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 11 && cpfRegex.test(value);
};

/**
 * Validação de telefone (formato: (00) 00000-0000 ou (00) 0000-0000)
 */
const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

// ============================================================================
// SCHEMAS DE AUTENTICAÇÃO
// ============================================================================

export const loginSchema = z.object({
  username: z.string()
    .min(3, minError('Usuário', 3))
    .max(150, maxError('Usuário', 150)),
  password: z.string()
    .min(1, requiredError('Senha'))
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  username: z.string()
    .min(3, minError('Usuário', 3))
    .max(150, maxError('Usuário', 150))
    .regex(/^[a-zA-Z0-9_-]+$/, 'Apenas letras, números, traço e underscore'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número'),
  confirmPassword: z.string(),
  name: z.string()
    .min(3, minError('Nome', 3))
    .max(255, maxError('Nome', 255)),
  document: z.string()
    .refine(isCPF, 'CPF inválido'),
  phone: z.string()
    .regex(phoneRegex, 'Telefone inválido. Use: (00) 00000-0000'),
  email: z.string()
    .email(emailError)
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

// ============================================================================
// SCHEMAS DE CONTAS BANCÁRIAS
// ============================================================================

export const accountSchema = z.object({
  account_name: z.string()
    .min(1, requiredError('Nome da conta'))
    .max(255, maxError('Nome', 255)),
  account_type: z.enum(['CC', 'CS', 'FG', 'VA', 'VR', 'CP'], {
    message: 'Selecione um tipo de conta válido',
  }),
  institution: z.enum(['NUB', 'SIC', 'MPG', 'IFB', 'CEF', 'BTG', 'ITA', 'SAN', 'BRB', 'BBR', 'BMG', 'PAY', 'C6B', 'INT', 'CAI', 'PAN'], {
    message: 'Selecione uma instituição válida',
  }),
  account_number: z.string()
    .min(1, requiredError('Número da conta'))
    .max(50, maxError('Número da conta', 50)),
  balance: z
    .number({ message: numberError('Saldo') })
    .min(0, 'Saldo não pode ser negativo'),
  owner: z
    .number({ message: 'Proprietário inválido' })
    .int('Proprietário deve ser um número inteiro')
    .positive('Selecione um proprietário'),
});

// ============================================================================
// SCHEMAS DE DESPESAS
// ============================================================================

export const expenseSchema = z.object({
  value: z
    .number({ message: numberError('Valor') })
    .positive(positiveError('Valor')),
  category: z.enum([
    'food and drink', 'bills and services', 'electronics',
    'purchases', 'transportation', 'home', 'education',
    'entertainment', 'clothing', 'health', 'investment',
    'gifts and donations', 'taxes', 'personal care',
    'travel', 'pets', 'savings', 'loans', 'other',
  ], {
    message: 'Selecione uma categoria válida',
  }),
  description: z.string()
    .min(1, requiredError('Descrição'))
    .max(500, maxError('Descrição', 500)),
  date: z.string()
    .min(1, requiredError('Data')),
  is_paid: z.boolean().default(false),
  account: z
    .number({ message: 'Conta inválida' })
    .int('Conta deve ser um número inteiro')
    .positive('Selecione uma conta'),
});

// ============================================================================
// SCHEMAS DE RECEITAS
// ============================================================================

export const revenueSchema = z.object({
  value: z
    .number({ message: numberError('Valor') })
    .positive(positiveError('Valor')),
  category: z.enum([
    'deposit', 'salary', 'award', 'investment return',
    'sale', 'gift', 'refund', 'cashback', 'other',
  ], {
    message: 'Selecione uma categoria válida',
  }),
  description: z.string()
    .min(1, requiredError('Descrição'))
    .max(500, maxError('Descrição', 500)),
  date: z.string()
    .min(1, requiredError('Data')),
  account: z
    .number({ message: 'Conta inválida' })
    .int('Conta deve ser um número inteiro')
    .positive('Selecione uma conta'),
});

// ============================================================================
// SCHEMAS DE CARTÕES DE CRÉDITO
// ============================================================================

export const creditCardSchema = z.object({
  name: z.string()
    .min(1, requiredError('Nome do cartão'))
    .max(255, maxError('Nome', 255)),
  card_number: z.string()
    .length(4, 'Últimos 4 dígitos do cartão')
    .regex(/^\d{4}$/, 'Apenas números'),
  security_code: z.string()
    .min(3, 'CVV deve ter 3 ou 4 dígitos')
    .max(4, 'CVV deve ter 3 ou 4 dígitos')
    .regex(/^\d{3,4}$/, 'Apenas números'),
  card_brand: z.enum(['MSC', 'VSA', 'ELO', 'EXP', 'HCD'], {
    message: 'Selecione uma bandeira válida',
  }),
  credit_limit: z
    .number({ message: numberError('Limite') })
    .positive(positiveError('Limite')),
  billing_due_day: z
    .number({ message: numberError('Dia de vencimento') })
    .int('Dia deve ser um número inteiro')
    .min(1, 'Dia deve estar entre 1 e 31')
    .max(31, 'Dia deve estar entre 1 e 31'),
  associated_account: z
    .number({ message: 'Conta inválida' })
    .int('Conta deve ser um número inteiro')
    .positive('Selecione uma conta de cobrança'),
  status: z.enum(['active', 'blocked', 'cancelled'], {
    message: 'Selecione um status válido',
  }).default('active'),
});

// ============================================================================
// SCHEMAS DE TRANSFERÊNCIAS
// ============================================================================

export const transferSchema = z.object({
  value: z
    .number({ message: numberError('Valor') })
    .positive(positiveError('Valor')),
  date: z.string()
    .min(1, requiredError('Data')),
  transfer_type: z.enum(['doc', 'ted', 'pix'], {
    message: 'Selecione um tipo de transferência válido',
  }),
  description: z.string()
    .min(1, requiredError('Descrição'))
    .max(500, maxError('Descrição', 500)),
  origin_account: z
    .number({ message: 'Conta de origem inválida' })
    .int('Conta deve ser um número inteiro')
    .positive('Selecione uma conta de origem'),
  destiny_account: z
    .number({ message: 'Conta de destino inválida' })
    .int('Conta deve ser um número inteiro')
    .positive('Selecione uma conta de destino'),
}).refine((data) => data.origin_account !== data.destiny_account, {
  message: 'Conta de destino deve ser diferente da conta de origem',
  path: ['destiny_account'],
});

// ============================================================================
// SCHEMAS DE EMPRÉSTIMOS
// ============================================================================

export const loanSchema = z.object({
  value: z
    .number({ message: numberError('Valor') })
    .positive(positiveError('Valor')),
  payed_value: z
    .number({ message: numberError('Valor pago') })
    .min(0, 'Valor pago não pode ser negativo')
    .optional()
    .or(z.literal(0)),
  date: z.string()
    .min(1, requiredError('Data')),
  due_date: z.string()
    .min(1, requiredError('Data de vencimento')),
  is_creditor: z.boolean(),
  description: z.string()
    .min(1, requiredError('Descrição'))
    .max(500, maxError('Descrição', 500)),
  status: z.enum(['pending', 'in_progress', 'paid', 'late', 'cancelled'], {
    message: 'Selecione um status válido',
  }).default('pending'),
  linked_member: z
    .number({ message: 'Membro inválido' })
    .int('Membro deve ser um número inteiro')
    .positive('Selecione um membro'),
}).refine((data) => {
  if (data.payed_value && data.payed_value > data.value) {
    return false;
  }
  return true;
}, {
  message: 'Valor pago não pode ser maior que o valor total',
  path: ['payed_value'],
});

// ============================================================================
// SCHEMAS DE MEMBROS
// ============================================================================

export const memberSchema = z.object({
  name: z.string()
    .min(3, minError('Nome', 3))
    .max(255, maxError('Nome', 255)),
  document: z.string()
    .refine(isCPF, 'CPF inválido'),
  phone: z.string()
    .regex(phoneRegex, 'Telefone inválido. Use: (00) 00000-0000'),
  email: z.string()
    .email(emailError)
    .optional()
    .or(z.literal('')),
  sex: z.enum(['M', 'F', 'O'], {
    message: 'Selecione um sexo válido',
  }),
  is_creditor: z.boolean().default(false),
  is_benefited: z.boolean().default(false),
  active: z.boolean().default(true),
});

// ============================================================================
// TYPE INFERENCE (Types automáticos dos schemas)
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type RevenueFormData = z.infer<typeof revenueSchema>;
export type CreditCardFormData = z.infer<typeof creditCardSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;
export type LoanFormData = z.infer<typeof loanSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;
