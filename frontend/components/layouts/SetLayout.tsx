/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import cookie from 'react-cookies';
import { RoleConstants } from '../../constants/roles.constant';
import { CookieConstants } from '../../constants/store.constant';
import AnonymousLayout from './anonymous/AnonymousLayout.layout';
import AuthLayout from './auth/AuthLayout.layout';
import UserLayout from './user/UserLayout.layout';

export default function SetLayout({ children }: any) {
  const router = useRouter();
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const role = cookie.load(CookieConstants.ROLE) ? cookie.load(CookieConstants.ROLE) : RoleConstants.ANONYMOUS;

  if (router.pathname === '/_error') {
    return <>{children}</>;
  } else if (router.pathname === '/login' || router.pathname === '/register' || router.pathname === '/forgot-password') {
    return <AuthLayout>{children}</AuthLayout>;
  } else {
    if (isLoggedIn) {
      // if (role === RoleConstants.USER) {
      //   return <UserLayout>{children}</UserLayout>;
      // }
      return <UserLayout>{children}</UserLayout>;
    } else {
      return <AnonymousLayout>{children}</AnonymousLayout>;
    }
  }
}
