import cookie from 'react-cookies';
import { LoginResponse } from '../models/auth/login.model';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import { CookieConstants, LocalStorageConstants } from '../constants/store.constant';
import { CookieSerializeOptions } from 'cookie';

export const LocalUtils = {
  storeAuthenticationData(data: LoginResponse) {
    const decodedHeader = jwt_decode<any>(data.access_token);

    //store some response data to cookie
    const expire = moment().add(data.expires_in, 's').toDate();
    cookie.save(CookieConstants.ACCESS_TOKEN, data.access_token, { expires: expire });

    if (data.refresh_token) {
      localStorage.setItem(LocalStorageConstants.REFRESH_TOKEN, data.refresh_token);
    }

    cookie.save(CookieConstants.EMAIL, decodedHeader.email, { expires: expire });
    cookie.save(CookieConstants.ROLE, decodedHeader.role, { expires: expire });
    cookie.save(CookieConstants.LANGUAGE, 'EN', { expires: expire });
    cookie.save(CookieConstants.THEME, 'LIGHT', { expires: expire });
    // cookie.save(CookieConstants.USER_NAME, decodedHeader.name, { expires: expire });
    // cookie.save(CookieConstants.PERMISSION, decodedHeader.Permission, { expires: expire });

    // keep login 1 day
    const loginExpire = moment(expire).add(1, 'd').toDate();
    cookie.save(CookieConstants.IS_LOGGED_IN, 'true', { expires: loginExpire });
  },

  //#region cookie
  getCookie(key: string) {
    return cookie.load(key);
  },

  setCookie(key: string, value: string, opt: CookieSerializeOptions) {
    cookie.save(key, value, opt);
  },

  removeCookie(key: string, opt: CookieSerializeOptions | undefined) {
    cookie.remove(key, opt);
  },
  //#endregion

  //#region LocalStorage
  get(key: string) {
    return localStorage.getItem(key);
  },

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  },

  remove(key: string) {
    return localStorage.removeItem(key);
  },
  //#endregion
};
