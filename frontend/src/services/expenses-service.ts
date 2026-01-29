import { apiClient, type QueryParams } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Expense, ExpenseFormData, PaginatedResponse } from '@/types';

/**
 * Servico para gerenciamento de despesas.
 *
 * @example
 * ```ts
 * // Listar despesas
 * const expenses = await expensesService.getAll();
 *
 * // Criar despesa
 * const expense = await expensesService.create({
 *   description: 'Aluguel',
 *   value: '1500.00',
 *   date: '2024-01-15',
 *   category: 'housing'
 * });
 *
 * // Marcar varias como pagas
 * await expensesService.bulkMarkPaid([1, 2, 3]);
 * ```
 */
class ExpensesService {
  /**
   * Lista todas as despesas.
   *
   * @param params - Filtros opcionais (account, category, payed, etc)
   * @returns Lista de despesas
   */
  async getAll(params?: QueryParams): Promise<Expense[]> {
    const response = await apiClient.get<PaginatedResponse<Expense>>(API_CONFIG.ENDPOINTS.EXPENSES, params);
    return response.results;
  }

  /**
   * Busca uma despesa por ID.
   *
   * @param id - ID da despesa
   * @returns Dados da despesa
   * @throws {NotFoundError} Se despesa nao encontrada
   */
  async getById(id: number): Promise<Expense> {
    return apiClient.get<Expense>(`${API_CONFIG.ENDPOINTS.EXPENSES}${id}/`);
  }

  /**
   * Cria uma nova despesa.
   *
   * @param data - Dados da despesa
   * @returns Despesa criada
   * @throws {ValidationError} Se dados invalidos
   */
  async create(data: ExpenseFormData): Promise<Expense> {
    return apiClient.post<Expense>(API_CONFIG.ENDPOINTS.EXPENSES, data);
  }

  /**
   * Atualiza uma despesa existente.
   *
   * @param id - ID da despesa
   * @param data - Dados para atualizar
   * @returns Despesa atualizada
   */
  async update(id: number, data: Partial<ExpenseFormData>): Promise<Expense> {
    return apiClient.put<Expense>(`${API_CONFIG.ENDPOINTS.EXPENSES}${id}/`, data);
  }

  /**
   * Remove uma despesa.
   *
   * @param id - ID da despesa
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.EXPENSES}${id}/`);
  }

  /**
   * Marca multiplas despesas como pagas.
   *
   * @param expenseIds - Lista de IDs das despesas
   */
  async bulkMarkPaid(expenseIds: number[]): Promise<void> {
    return apiClient.post(`${API_CONFIG.ENDPOINTS.EXPENSES}bulk-mark-paid/`, {
      expense_ids: expenseIds
    });
  }
}

export const expensesService = new ExpensesService();
