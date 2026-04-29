/**
 * Centralized Route constants for the TIMVERSE application.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  CATEGORY: "/category",
  ARTICLE: (slug: string) => `/article/${slug}`,
  
  ADMIN: {
    LOGIN: "/admin-login",
    DASHBOARD: "/admin",
    NEWS: {
      LIST: "/admin/news",
      CREATE: "/admin/news/create",
      EDIT: (id: string) => `/admin/news/edit/${id}`,
    },
    REPORTS: "/admin/reports",
    COMPLAINTS: "/admin/complaints",
  },
};

export const PROTECTED_ROUTES = [ROUTES.PROFILE];
export const ADMIN_ROUTES = ["/admin"]; // Matches startsWith
export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.ADMIN.LOGIN];
