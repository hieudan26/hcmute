import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { CookieSerializeOptions } from 'cookie';
import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';
import { LogOut } from '.';
import { CookieConstants, LocalStorageConstants } from '../constants/store.constant';
import { IUserFirstLoginRequest } from '../models/user/user.model';

export const LocalUtils = {
  resetAdditionalData() {
    LocalUtils.removeLocalStorage(LocalStorageConstants.FIRST_NAME);
    LocalUtils.removeLocalStorage(LocalStorageConstants.LAST_NAME);
    LocalUtils.removeLocalStorage(LocalStorageConstants.FULL_NAME);
    LocalUtils.removeLocalStorage(LocalStorageConstants.AVATAR);
    LocalUtils.removeLocalStorage(LocalStorageConstants.COVER_BACKGROUND);
  },

  storeAdditionalData(data: IUserFirstLoginRequest) {
    LocalUtils.setLocalStorage(LocalStorageConstants.FIRST_NAME, data.firstName ? data.firstName : 'first name');
    LocalUtils.setLocalStorage(LocalStorageConstants.LAST_NAME, data.lastName ? data.lastName : 'last name');
    LocalUtils.setLocalStorage(
      LocalStorageConstants.FULL_NAME,
      data.lastName && data.lastName ? `${data.firstName} ${data.lastName}` : 'full name'
    );
    LocalUtils.setLocalStorage(LocalStorageConstants.AVATAR, data.avatar ? data.avatar : 'null');
    LocalUtils.setLocalStorage(LocalStorageConstants.COVER_BACKGROUND, data.coverBackground ? data.coverBackground : 'null');
  },

  async storeAuthenticationData(isRefresh: boolean = false) {
    let data: CognitoUser | null = null;
    if (isRefresh) {
      data = await Auth.currentAuthenticatedUser({ bypassCache: true });
    } else {
      data = await Auth.currentAuthenticatedUser();
    }

    if (data) {
      const idToken = data.getSignInUserSession()?.getIdToken().getJwtToken();
      if (idToken) {
        const decodedHeader = jwt_decode<any>(idToken);

        //store some response data to cookie
        const expire = new Date(decodedHeader.exp * 1000);
        cookie.save(CookieConstants.ACCESS_TOKEN, idToken, { expires: expire, sameSite: 'strict' });

        const refreshToken = data.getSignInUserSession()?.getRefreshToken().getToken();
        if (refreshToken) {
          LocalUtils.setLocalStorage(LocalStorageConstants.REFRESH_TOKEN, refreshToken);
        }

        LocalUtils.setLocalStorage(LocalStorageConstants.USER_ID, decodedHeader['sub']);
        cookie.save(CookieConstants.EMAIL, decodedHeader.email, { expires: expire, sameSite: 'strict' });
        cookie.save(CookieConstants.ROLE, decodedHeader['custom:role'], { expires: expire, sameSite: 'strict' });
        cookie.save(CookieConstants.IS_FIRST_LOGIN, decodedHeader['custom:is_first_login'], {
          expires: expire,
          sameSite: 'strict',
        });
        // cookie.save(CookieConstants.LANGUAGE, 'EN', { expires: expire });
        // cookie.save(CookieConstants.THEME, 'LIGHT', { expires: expire });

        // keep login 1 day
        // const loginExpire = moment(expire).add(1, 'd').toDate();
        cookie.save(CookieConstants.IS_LOGGED_IN, 'true', { expires: expire, sameSite: 'strict' });
      }
    }
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
  getLocalStorage(key: string) {
    return localStorage.getItem(key);
  },

  setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  },

  removeLocalStorage(key: string) {
    return localStorage.removeItem(key);
  },
  //#endregion
};
