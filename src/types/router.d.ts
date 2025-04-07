import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    roles?: string[];
    permissions?: string[];
    keepAlive?: boolean;
    hidden?: boolean;
  }
} 
