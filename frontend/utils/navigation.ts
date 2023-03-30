import { IRoute } from '../types/navigation';

// NextJS Requirement
/**
 * If the type of window is undefined, then return false, otherwise return true.
 */
export const isWindowAvailable = () => typeof window !== 'undefined';

/**
 * It takes an array of routes and returns the first route that matches the current URL.
 * </code>
 *
 *
 * A:
 *
 * You can use <code>window.location.pathname</code> to get the current path.
 * <code>const currentPath = window.location.pathname;
 * </code>
 * @param {IRoute[]} routes - IRoute[]
 * @returns The foundRoute is being returned.
 */
export const findCurrentRoute = (routes: IRoute[]): IRoute | undefined => {
  const foundRoute: IRoute | undefined = routes.find(
    (route) => isWindowAvailable() && window.location.href.indexOf(route.path) !== -1 && route
  );

  return foundRoute;
};

/**
 * It takes an array of routes, finds the current route, and returns the name of the current route
 * @param {IRoute[]} routes - IRoute[]
 * @returns The name of the route.
 */
export const getActiveRoute = (routes: IRoute[]): string => {
  const route = findCurrentRoute(routes);
  if (route?.name) {
    return route.name;
  } else {
    if (window.location.href.includes('profile')) {
      return 'Cài đặt hồ sơ';
    } else {
      return 'Thông báo';
    }
  }
};

/**
 * It returns the value of the secondary property of the first route object in the routes array that
 * has a path property that matches the current URL path
 * @param {IRoute[]} routes - IRoute[]
 * @returns A boolean or undefined.
 */
export const getActiveNavbar = (routes: IRoute[]): boolean | undefined => {
  const route = findCurrentRoute(routes);
  return route?.secondary;
};

/**
 * If the active route is found, return the active route's text, otherwise return false.
 * @param {IRoute[]} routes - IRoute[]
 * @returns The return value is a string or boolean.
 */
export const getActiveNavbarText = (routes: IRoute[]): string | boolean => {
  return getActiveRoute(routes) || false;
};
