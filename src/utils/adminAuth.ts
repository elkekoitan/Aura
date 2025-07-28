/**
 * Admin Authentication Utilities
 * Provides role-based access control and permission checking for admin features
 */

import { AdminPermission, AdminUser } from '../store/types/admin';

/**
 * Mock admin user data for development
 * In production, this would come from the authenticated user's profile
 */
const MOCK_ADMIN_USER: AdminUser = {
  id: 'admin-001',
  email: 'admin@aura.fashion',
  role: 'admin',
  permissions: [
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'brands.create',
    'brands.read',
    'brands.update',
    'brands.delete',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
    'analytics.read',
  ],
  created_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
};

/**
 * Check if current user has admin access
 * For development, always returns true
 * In production, this would check the user's role and permissions
 */
export const hasAdminAccess = (user?: any): boolean => {
  // For development purposes, allow admin access for all authenticated users
  // In production, implement proper role checking:
  // return user?.role === 'admin' || user?.role === 'super_admin';
  return !!user;
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission: AdminPermission, user?: AdminUser): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (permissions: AdminPermission[], user?: AdminUser): boolean => {
  if (!user) return false;
  return permissions.some(permission => user.permissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (permissions: AdminPermission[], user?: AdminUser): boolean => {
  if (!user) return false;
  return permissions.every(permission => user.permissions.includes(permission));
};

/**
 * Get current admin user (mock for development)
 */
export const getCurrentAdminUser = (): AdminUser | null => {
  // For development, return mock admin user
  // In production, this would fetch from the authenticated user context
  return MOCK_ADMIN_USER;
};

/**
 * Permission helper functions for common operations
 */
export const canManageProducts = (user?: AdminUser): boolean => {
  return hasAnyPermission(['products.create', 'products.update', 'products.delete'], user);
};

export const canManageBrands = (user?: AdminUser): boolean => {
  return hasAnyPermission(['brands.create', 'brands.update', 'brands.delete'], user);
};

export const canManageCategories = (user?: AdminUser): boolean => {
  return hasAnyPermission(['categories.create', 'categories.update', 'categories.delete'], user);
};

export const canViewAnalytics = (user?: AdminUser): boolean => {
  return hasPermission('analytics.read', user);
};

/**
 * Admin role hierarchy
 */
export const ADMIN_ROLES = {
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

/**
 * Default permissions for each role
 */
export const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
  [ADMIN_ROLES.MODERATOR]: [
    'products.read',
    'brands.read',
    'categories.read',
  ],
  [ADMIN_ROLES.ADMIN]: [
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'brands.create',
    'brands.read',
    'brands.update',
    'brands.delete',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
    'analytics.read',
  ],
  [ADMIN_ROLES.SUPER_ADMIN]: [
    'products.create',
    'products.read',
    'products.update',
    'products.delete',
    'brands.create',
    'brands.read',
    'brands.update',
    'brands.delete',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
    'users.read',
    'users.update',
    'analytics.read',
  ],
};

/**
 * Get permissions for a role
 */
export const getPermissionsForRole = (role: string): AdminPermission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if role has higher privileges than another role
 */
export const isHigherRole = (role1: string, role2: string): boolean => {
  const roleHierarchy = [ADMIN_ROLES.MODERATOR, ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN];
  const role1Index = roleHierarchy.indexOf(role1 as any);
  const role2Index = roleHierarchy.indexOf(role2 as any);
  return role1Index > role2Index;
};
