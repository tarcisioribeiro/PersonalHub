import { apiClient } from './api-client';

export interface LibraryDashboardStats {
  total_books: number;
  total_authors: number;
  total_publishers: number;
  books_reading: number;
  books_to_read: number;
  books_read: number;
  average_rating: number;
  total_pages_read: number;
  books_by_genre: Array<{
    genre: string;
    genre_display: string;
    count: number;
  }>;
  recent_readings: Array<{
    book_title: string;
    pages_read: number;
    reading_date: string;
  }>;
  top_rated_books: Array<{
    title: string;
    rating: number;
    authors_names: string[];
  }>;
}

class LibraryDashboardService {
  async getStats(): Promise<LibraryDashboardStats> {
    return await apiClient.get<LibraryDashboardStats>(
      '/api/v1/library/dashboard/stats/'
    );
  }
}

export const libraryDashboardService = new LibraryDashboardService();
