import { User, UserRole } from './index';

// ===============================================
// AUTHENTICATION TYPES
// ===============================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  schoolId?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MFASetupRequest {
  userId: string;
  method: 'totp' | 'sms' | 'email';
}

export interface MFAVerificationRequest {
  userId: string;
  code: string;
  method: 'totp' | 'sms' | 'email';
}

export interface SessionInfo {
  userId: string;
  sessionId: string;
  loginTime: string;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

export interface SecurityEvent {
  eventId: string;
  userId: string;
  eventType: 'login' | 'logout' | 'failed_login' | 'password_change' | 'mfa_enabled' | 'mfa_disabled';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

// ===============================================
// PERMISSION CHECKS TYPES
// ===============================================

export interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export interface RoleCapabilities {
  canCreateQuiz: boolean;
  canManageClasses: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canAccessSettings: boolean;
  canUseAI: boolean;
  canManageBudget: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canImpersonate: boolean;
}

// ===============================================
// AUTH GUARD TYPES
// ===============================================

export interface AuthGuardResult {
  isAuthenticated: boolean;
  hasPermission: boolean;
  redirectTo: string | null;
  user: User | null;
}

export interface RouteProtection {
  requireAuth: boolean;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  redirectTo?: string;
} 