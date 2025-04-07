import { Store } from 'pinia';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: import('vue-router').Router;
    $route: import('vue-router').RouteLocationNormalizedLoaded;
  }
} 
