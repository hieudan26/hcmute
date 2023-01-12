/* eslint-disable react-hooks/exhaustive-deps */
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import cookie from 'react-cookies';
import { login, logout } from '../../app/slices/authSlice';
import { clearUserNotAuth } from '../../app/slices/userNotAuthSlice';
import { RoleConstants } from '../../constants/roles.constant';
import { CookieConstants, LocalStorageConstants } from '../../constants/store.constant';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { AuthService } from '../../services/auth/auth.service';
import userService from '../../services/user/user.service';
import { LocalUtils } from '../../utils/local.utils';
import AdminLayout from './admin/AdminLayout.layout';
import AnonymousLayout from './anonymous/AnonymousLayout.layout';
import AuthLayout from './auth/AuthLayout.layout';
import ChatLayout from './chat/ChatLayout.layout';
import UserLayout from './user/UserLayout.layout';

export default function SetLayout({ children }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [errorRoute, setErrorRoute] = useState<boolean>(false);
  const ref: { current: NodeJS.Timeout | null } = useRef(null);
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const role = cookie.load(CookieConstants.ROLE) ? cookie.load(CookieConstants.ROLE) : RoleConstants.ANONYMOUS;
  const is_first_login = cookie.load(CookieConstants.IS_FIRST_LOGIN) ? cookie.load(CookieConstants.IS_FIRST_LOGIN) : 'false';
  const auth = useAppSelector((state) => state.auth.value);

  const getRefreshToken = useCallback(() => {
    const handle = async () => {
      try {
        const currentSession = await Auth.currentSession();
        const idTokenExpire = currentSession.getIdToken().getExpiration();
        const refreshToken = currentSession.getRefreshToken();
        const currentTimeSeconds = Math.round(+new Date() / 1000);
        //idTokenExpire < currentTimeSeconds
        //auto refresh so dont need condition to refresh
        if (true) {
          const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
          currentAuthenticatedUser.refreshSession(refreshToken, (err: any, data: any) => {
            if (err) {
              handleUnAuthorize();
            } else {
              LocalUtils.storeAuthenticationData(true);
            }
          });
        }
      } catch (error: any) {
        handleUnAuthorize();
      }
    };

    handle();
  }, []);

  useEffect(() => {
    if (router.pathname === '/404') {
      setErrorRoute(true);
    } else {
      setErrorRoute(false);
    }
  }, [router.pathname]);

  useEffect(() => {
    //auto refresh new token after 5 minutes
    if (isLoggedIn) {
      const interval = setInterval(() => getRefreshToken(), 300000);
      ref.current = interval;
      return () => {
        clearInterval(ref.current as NodeJS.Timeout);
      };
    }
  }, [getRefreshToken]);

  const handleUnAuthorize = async () => {
    await AuthService.logout();
    dispatch(logout());
    dispatch(clearUserNotAuth());

    if (typeof window !== 'undefined' && window.location.href.indexOf('/login') === -1) {
      window.location.href = `/login?url=${window.location.pathname}`;
    }
  };

  if (router.pathname === '/_error' || errorRoute) {
    return <>{children}</>;
  } else if (router.pathname === '/login' || router.pathname === '/register' || router.pathname === '/forgot-password') {
    return <AuthLayout>{children}</AuthLayout>;
  } else if (router.pathname.includes('/chats')) {
    return <ChatLayout>{children}</ChatLayout>;
  } else if (router.pathname.includes('/admin')) {
    if (router.pathname === '/admin/login' || router.pathname === '/admin/forgot-password') {
      return <>{children}</>;
    } else {
      return <AdminLayout>{children}</AdminLayout>;
    }
  } else {
    if (isLoggedIn) {
      // if (role === RoleConstants.USER) {
      return (
        <UserLayout curUser={auth} is_first_login={auth === null ? 'true' : 'false'}>
          {children}
        </UserLayout>
      );
      // } else {
      //   if (router.pathname.includes('/admin')) {
      //     return <AdminLayout>{children}</AdminLayout>;
      //   } else {
      //     return <AnonymousLayout>{children}</AnonymousLayout>;
      //   }
    }
    // }
    else {
      return <AnonymousLayout>{children}</AnonymousLayout>;
    }
  }
}
