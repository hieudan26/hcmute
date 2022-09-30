import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { CookieSerializeOptions } from 'cookie';
import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';
import { CookieConstants, LocalStorageConstants } from '../constants/store.constant';

export const LocalUtils = {
  async storeAuthenticationData() {
    const data: CognitoUser = await Auth.currentAuthenticatedUser();
    if (data) {
      const idToken = data.getSignInUserSession()?.getIdToken().getJwtToken();
      if (idToken) {
        const decodedHeader = jwt_decode<any>(idToken);

        //store some response data to cookie
        const expire = new Date(decodedHeader.exp * 1000);
        console.log('>>> expire: ', expire);
        cookie.save(CookieConstants.ACCESS_TOKEN, idToken, { expires: expire });

        const refreshToken = data.getSignInUserSession()?.getRefreshToken().getToken();
        if (refreshToken) {
          LocalUtils.setLocalStorage(LocalStorageConstants.REFRESH_TOKEN, refreshToken);
        }

        cookie.save(CookieConstants.EMAIL, decodedHeader.email, { expires: expire });
        cookie.save(CookieConstants.ROLE, decodedHeader['custom:role'], { expires: expire });
        // cookie.save(CookieConstants.LANGUAGE, 'EN', { expires: expire });
        // cookie.save(CookieConstants.THEME, 'LIGHT', { expires: expire });

        // keep login 1 day
        // const loginExpire = moment(expire).add(1, 'd').toDate();
        cookie.save(CookieConstants.IS_LOGGED_IN, 'true', { expires: expire });
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
