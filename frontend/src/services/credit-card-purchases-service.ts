import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type {
  CreditCardPurchase,
  CreditCardPurchaseFormData,
  PaginatedResponse,
} from '@/types';

class CreditCardPurchasesService {
  /**
   * Busca todas as compras, lidando com paginação automaticamente.
   * Busca todas as páginas e concatena os resultados.
   */
  async getAll(params?: Record<string, any>): Promise<CreditCardPurchase[]> {
    const allResults: CreditCardPurchase[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiClient.get<PaginatedResponse<CreditCardPurchase>>(
        API_CONFIG.ENDPOINTS.CREDIT_CARD_PURCHASES,
        { ...params, page }
      );

      allResults.push(...response.results);

      // Verifica se há mais páginas
      hasMore = response.next !== null;
      page++;
    }

    return allResults;
  }

  async getById(id: number): Promise<CreditCardPurchase> {
    return apiClient.get<CreditCardPurchase>(
      `${API_CONFIG.ENDPOINTS.CREDIT_CARD_PURCHASES}${id}/`
    );
  }

  async create(data: CreditCardPurchaseFormData): Promise<CreditCardPurchase> {
    return apiClient.post<CreditCardPurchase>(
      API_CONFIG.ENDPOINTS.CREDIT_CARD_PURCHASES,
      data
    );
  }

  async update(
    id: number,
    data: Partial<CreditCardPurchaseFormData>
  ): Promise<CreditCardPurchase> {
    return apiClient.patch<CreditCardPurchase>(
      `${API_CONFIG.ENDPOINTS.CREDIT_CARD_PURCHASES}${id}/`,
      data
    );
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.CREDIT_CARD_PURCHASES}${id}/`);
  }

  async getByCard(cardId: number): Promise<CreditCardPurchase[]> {
    return this.getAll({ card: cardId });
  }

  async getByCategory(category: string): Promise<CreditCardPurchase[]> {
    return this.getAll({ category });
  }
}

export const creditCardPurchasesService = new CreditCardPurchasesService();
