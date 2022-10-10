/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import cookie from 'react-cookies';
import { login } from '../../app/slices/authSlice';
import { RoleConstants } from '../../constants/roles.constant';
import { CookieConstants, LocalStorageConstants } from '../../constants/store.constant';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import userService from '../../services/user/user.service';
import { LocalUtils } from '../../utils/local.utils';
import AnonymousLayout from './anonymous/AnonymousLayout.layout';
import AuthLayout from './auth/AuthLayout.layout';
import UserLayout from './user/UserLayout.layout';

export default function SetLayout({ children }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const role = cookie.load(CookieConstants.ROLE) ? cookie.load(CookieConstants.ROLE) : RoleConstants.ANONYMOUS;
  const is_first_login = cookie.load(CookieConstants.IS_FIRST_LOGIN) ? cookie.load(CookieConstants.IS_FIRST_LOGIN) : 'false';
  const auth = useAppSelector((state) => state.auth.value);

  useEffect(() => {
    // const userId = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
    // const getInformationUser = async () => {
    //   if (auth === null && userId) {
    //     const response = await userService.getUserById(userId);
    //     dispatch(login(response?.data));
    //   }
    // };
    // getInformationUser();
  }, []);

  if (router.pathname === '/_error') {
    return <>{children}</>;
  } else if (router.pathname === '/login' || router.pathname === '/register' || router.pathname === '/forgot-password') {
    return <AuthLayout>{children}</AuthLayout>;
  } else {
    if (isLoggedIn) {
      // if (role === RoleConstants.USER) {
      //   return <UserLayout>{children}</UserLayout>;
      // }
      return <UserLayout is_first_login={auth === null ? 'true' : 'false'}>{children}</UserLayout>;
    } else {
      return <AnonymousLayout>{children}</AnonymousLayout>;
    }
  }
}
