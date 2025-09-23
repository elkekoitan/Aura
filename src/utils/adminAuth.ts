/**
 * @module utils/adminAuth
 * @description Provides role-based access control (RBAC) and permission checking utilities
 * for administrative features within the application. Includes mock data for development.
 */
import { AdminPermission, AdminUser } from '../store/types/admin';

/**
 * A mock admin user object for development and testing purposes.
 * In a production environment, this data would be sourced from the
 * authenticated user's session or profile.
 * @type {AdminUser}
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
 * Checks if the current user has administrative access.
 * For development, this function currently returns true for any authenticated user.
 * In production, it should be updated to perform a proper role check.
 * @param {any} [user] - The user object to check.
 * @returns {boolean} True if the user has admin access, false otherwise.
 */
export const hasAdminAccess = (user?: any): boolean => {
  // For development purposes, allow admin access for all authenticated users
  // In production, implement proper role checking:
  // return user?.role === 'admin' || user?.role === 'super_admin';
  return !!user;
};

/**
 * Checks if a given user has a specific permission.
 * @param {AdminPermission} permission - The permission to check for.
 * @param {AdminUser} [user] - The user whose permissions are to be checked.
 * @returns {boolean} True if the user has the specified permission, false otherwise.
 */
export const hasPermission = (permission: AdminPermission, user?: AdminUser): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission);
};

/**
 * Checks if a user has at least one of the specified permissions.
 * @param {AdminPermission[]} permissions - An array of permissions to check for.
 * @param {AdminUser} [user] - The user whose permissions are to be checked.
 * @returns {boolean} True if the user has any of the specified permissions, false otherwise.
 */
export const hasAnyPermission = (permissions: AdminPermission[], user?: AdminUser): boolean => {
  if (!user) return false;
  return permissions.some(permission => user.permissions.includes(permission));
};

/**
 * Checks if a user has all of the specified permissions.
 * @param {AdminPermission[]} permissions - An array of permissions to check for.
 * @param {AdminUser} [user] - The user whose permissions are to be checked.
 * @returns {boolean} True if the user has all of the specified permissions, false otherwise.
 */
export const hasAllPermissions = (permissions: AdminPermission[], user?: AdminUser): boolean => {
  if (!user) return false;
  return permissions.every(permission => user.permissions.includes(permission));
};

/**
 * Retrieves the current admin user.
 * For development, this function returns a mock admin user.
 * In production, this should be replaced with logic to fetch the authenticated user from context.
 * @returns {AdminUser | null} The current admin user object, or null if not available.
 */
export const getCurrentAdminUser = (): AdminUser | null => {
  // For development, return mock admin user
  // In production, this would fetch from the authenticated user context
  return MOCK_ADMIN_USER;
};

/**
 * A helper function to check if a user has permissions to manage products.
 * @param {AdminUser} [user] - The user to check.
 * @returns {boolean} True if the user can manage products, false otherwise.
 */
export const canManageProducts = (user?: AdminUser): boolean => {
  return hasAnyPermission(['products.create', 'products.update', 'products.delete'], user);
};

/**
 * A helper function to check if a user has permissions to manage brands.
 * @param {AdminUser} [user] - The user to check.
 * @returns {boolean} True if the user can manage brands, false otherwise.
 */
export const canManageBrands = (user?: AdminUser): boolean => {
  return hasAnyPermission(['brands.create', 'brands.update', 'brands.delete'], user);
};

/**
 * A helper function to check if a user has permissions to manage categories.
 * @param {AdminUser} [user] - The user to check.
 * @returns {boolean} True if the user can manage categories, false otherwise.
 */
export const canManageCategories = (user?: AdminUser): boolean => {
  return hasAnyPermission(['categories.create', 'categories.update', 'categories.delete'], user);
};

/**
 * A helper function to check if a user has permissions to view analytics.
 * @param {AdminUser} [user] - The user to check.
 * @returns {boolean} True if the user can view analytics, false otherwise.
 */
export const canViewAnalytics = (user?: AdminUser): boolean => {
  return hasPermission('analytics.read', user);
};

/**
 * An object representing the hierarchy of admin roles.
 * @type {Readonly<{MODERATOR: string, ADMIN: string, SUPER_ADMIN: string}>}
 */
export const ADMIN_ROLES = {
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

/**
 * A mapping of admin roles to their default set of permissions.
 * @type {Record<string, AdminPermission[]>}
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
 * Retrieves the array of permissions associated with a specific role.
 * @param {string} role - The role to get permissions for.
 * @returns {AdminPermission[]} An array of permissions for the given role, or an empty array if the role is not found.
 */
export const getPermissionsForRole = (role: string): AdminPermission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Compares two roles to determine if the first has higher privileges than the second.
 * @param {string} role1 - The first role.
 * @param {string} role2 - The second role.
 * @returns {boolean} True if `role1` is higher in the hierarchy than `role2`, false otherwise.
 */
export const isHigherRole = (role1: string, role2: string): boolean => {
  const roleHierarchy = [ADMIN_ROLES.MODERATOR, ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN];
  const role1Index = roleHierarchy.indexOf(role1 as any);
  const role2Index = roleHierarchy.indexOf(role2 as any);
  return role1Index > role2Index;
};
