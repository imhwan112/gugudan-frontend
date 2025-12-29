/**
 * Auth-related TypeScript types
 */

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
  terms_agreed: boolean;
  created_at: string;
}

export interface AuthStatusResponse {
  is_authenticated: boolean;
  user: User | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (provider: string) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export interface OAuthProvidersResponse {
  providers: string[];
}
