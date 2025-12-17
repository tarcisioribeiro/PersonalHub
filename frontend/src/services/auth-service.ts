import Cookies from 'js-cookie';
import { apiClient } from './api-client';
import { API_CONFIG, TOKEN_CONFIG } from '@/config/constants';
import type { LoginCredentials, User, Permission } from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ message: string; user: { username: string } }> {
    // O backend define os tokens como httpOnly cookies automaticamente
    // Não precisamos gerenciar tokens manualmente no frontend
    const response = await apiClient.post<{ message: string; user: { username: string } }>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );

    return response;
  }

  async register(data: {
    username: string;
    password: string;
    name: string;
    document: string;
    phone: string;
    email?: string;
  }): Promise<{ message: string; user_id: number; member_id: number; username: string }> {
    // Make POST request without authentication
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao cadastrar usuário');
    }

    return response.json();
  }

  async getUserPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<{
      username: string;
      permissions: string[];
      is_staff: boolean;
      is_superuser: boolean;
    }>(API_CONFIG.ENDPOINTS.USER_PERMISSIONS);

    // Transform string permissions to Permission objects
    // Format: "app_label.codename" -> { app_label, codename, name }
    if (!Array.isArray(response.permissions)) {
      console.error('Invalid permissions format received from API:', response.permissions);
      return [];
    }

    return response.permissions.map((perm: string) => {
      const [app_label, codename] = perm.split('.');
      return {
        app_label,
        codename,
        name: perm, // Using full permission string as name
      };
    });
  }

  logout() {
    apiClient.clearTokens();
    window.location.href = '/login';
  }

  async isAuthenticated(): Promise<boolean> {
    return await apiClient.hasValidToken();
  }

  // Save user data to cookies
  saveUserData(user: User) {
    Cookies.set('user_data', JSON.stringify(user), {
      expires: TOKEN_CONFIG.COOKIE_EXPIRE_DAYS,
      sameSite: 'Lax',
      secure: false,
    });
  }

  // Get user data from cookies
  getUserData(): User | null {
    const userData = Cookies.get('user_data');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  // Save permissions to cookies
  savePermissions(permissions: Permission[]) {
    Cookies.set('user_permissions', JSON.stringify(permissions), {
      expires: TOKEN_CONFIG.COOKIE_EXPIRE_DAYS,
      sameSite: 'Lax',
      secure: false,
    });
  }

  // Get permissions from cookies
  getPermissions(): Permission[] {
    const permsData = Cookies.get('user_permissions');
    if (!permsData) return [];

    try {
      return JSON.parse(permsData);
    } catch {
      return [];
    }
  }

  // Check if user has specific permission
  hasPermission(appName: string, action: string): boolean {
    const permissions = this.getPermissions();
    if (!Array.isArray(permissions)) return false;
    const codename = `${action}_${appName}`;

    return permissions.some((perm) => perm.codename === codename);
  }

  // Check if user has system access (is in 'Membros' group)
  hasSystemAccess(): boolean {
    const user = this.getUserData();
    if (!user || !Array.isArray(user.groups)) return false;

    return user.groups.includes('Membros');
  }
}

export const authService = new AuthService();
