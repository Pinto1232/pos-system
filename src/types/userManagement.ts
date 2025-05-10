export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  lastLoginFormatted?: string; // Additional field from backend
  roles: string[];
  permissions: string[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  isSystemRole: boolean;
  userCount: number;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  module: string;
  isActive: boolean;
}

export interface Module {
  name: string;
  permissions: Permission[];
}

export interface UserFormData {
  id?: number;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  isActive: boolean;
  roles: string[];
}

export interface RoleFormData {
  id?: number;
  name: string;
  description?: string;
  permissions: string[];
}

export interface PasswordPolicy {
  minLength: number;
  requireSpecialChars: boolean;
  expiryDays: number;
  twoFactorEnabled: boolean;
}

export interface SessionSettings {
  autoLogoutMinutes: number;
  maxConcurrentSessions: number;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  sessionSettings: SessionSettings;
}
