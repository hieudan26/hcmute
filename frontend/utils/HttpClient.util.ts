import { Auth } from 'aws-amplify';
import axios, { AxiosInstance, AxiosResponse, ResponseType } from 'axios';
import HttpStatus from 'http-status-codes';
import qs from 'qs';
import { Dispatch, SetStateAction } from 'react';
import cookie from 'react-cookies';
import { toggleLoading } from '../components/views/Loading/index.component';
import { toggleMessage } from '../components/views/Message/index.component';
import { API_URL } from '../constants/api-path.constant';
import { CookieConstants } from '../constants/store.constant';
import { ResponseMessage } from '../models/common/ResponseMessage.model';
import { AuthService } from '../services/auth/auth.service';
import { LocalUtils } from './local.utils';
import store from '../app/store';
import { logout } from '../app/slices/authSlice';
import { AxiosResponseStatus } from '../constants/global.constant';
import { clearUserNotAuth } from '../app/slices/userNotAuthSlice';
import https from 'https';

// let IS_REFRESHING_TOKEN = false;

export const deleteAsync = (
  url: string,
  successMessage?: string,
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true,
  alternativeErrorMessage?: string,
  setSubmitting?: Dispatch<SetStateAction<boolean>>
): Promise<AxiosResponseStatus> => {
  return axiosInstance(
    handleErrorAutomatic,
    successMessage,
    'application/json',
    'json',
    isShowLoading,
    isShowMessage,
    alternativeErrorMessage,
    setSubmitting
  ).delete(url);
};

export const putAsync = (
  url: string,
  json?: object,
  successMessage?: string,
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true,
  alternativeErrorMessage?: string,
  setSubmitting?: Dispatch<SetStateAction<boolean>>
): Promise<AxiosResponseStatus> => {
  return axiosInstance(
    handleErrorAutomatic,
    successMessage,
    'application/json',
    'json',
    isShowLoading,
    isShowMessage,
    alternativeErrorMessage,
    setSubmitting
  ).put(url, json);
};

export const postAsync = (
  url: string,
  json?: object,
  successMessage?: string,
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true,
  alternativeErrorMessage?: string,
  setSubmitting?: Dispatch<SetStateAction<boolean>>
): Promise<AxiosResponseStatus> => {
  return axiosInstance(
    handleErrorAutomatic,
    successMessage,
    'application/json',
    'json',
    isShowLoading,
    isShowMessage,
    alternativeErrorMessage,
    setSubmitting
  ).post(url, json);
};

export const getAsync = (
  url: string,
  params?: { [key: string]: any },
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true
): Promise<AxiosResponseStatus> => {
  return axiosInstance(handleErrorAutomatic, undefined, 'application/json', 'json', isShowLoading, isShowMessage).get(url, {
    params: params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

const getHeaders = (contentType: string, accessToken: string) => {
  return {
    'ngrok-skip-browser-warning': true,
    'Content-Type': contentType,
    Authorization: `Bearer ${accessToken}`,
  };
};

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false,
});

const axiosInstance = (
  handleErrorAutomatic: boolean,
  successMessage?: string,
  contentType: string = 'application/json',
  responseType: ResponseType = 'json',
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  alternativeErrorMessage?: string,
  setSubmitting?: Dispatch<SetStateAction<boolean>>
): AxiosInstance => {
  if (setSubmitting) setSubmitting(true);
  if (isShowLoading) toggleLoading(true);

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': contentType,
    },
    httpAgent: agent,
    responseType: responseType,
  });

  //#region interceptors REQUEST
  instance.interceptors.request.use(async (config: any) => {
    const token = cookie.load(CookieConstants.ACCESS_TOKEN);
    const auth = token ? `Bearer ${token}` : '';
    if (token) {
      config.headers['Authorization'] = auth;
    }

    try {
      const currentSession = await Auth.currentSession();
      const idTokenExpire = currentSession.getIdToken().getExpiration();
      const refreshToken = currentSession.getRefreshToken();
      const currentTimeSeconds = Math.round(+new Date() / 1000);

      if (idTokenExpire < currentTimeSeconds) {
        const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
        currentAuthenticatedUser.refreshSession(refreshToken, (err: any, data: any) => {
          if (err) {
            handleUnAuthorize();
          } else {
            LocalUtils.storeAuthenticationData(true);
            config.headers = getHeaders(contentType, data.getIdToken().getJwtToken());
            return config;
          }
        });
      } else {
        config.headers = getHeaders(contentType, currentSession.getIdToken().getJwtToken());
        return config;
      }
    } catch (error: any) {
      return config;
    }
  });
  //#endregion

  //#region interceptors RESPONSE
  instance.interceptors.response.use(
    (response) => {
      if (setSubmitting) setSubmitting(false);
      if (isShowLoading) toggleLoading(false);

      const method = response.config.method;

      (method === 'post' || method === 'put' || method === 'delete') &&
        isShowMessage &&
        toggleMessage({
          message: successMessage ? successMessage : 'Request successful',
          type: 'success',
        });
      return response.data;
    },
    async (error) => {
      if (setSubmitting) setSubmitting(false);
      if (isShowLoading) toggleLoading(false);
      let _error: ResponseMessage = {
        type: 'error',
        message: '',
        code: '',
      };

      if (
        error.response &&
        (error.response.status === HttpStatus.UNAUTHORIZED || error.response.status === HttpStatus.FORBIDDEN)
      ) {
        // handleUnAuthorize();
      }

      if (error.error_description) {
        _error.message = error.error_description;
      } else if (error.response?.data?.message) _error.message = error.response.data.message;
      else if (error.message && error.message === 'Network Error') {
        _error.message = 'No internet connection';
        _error.code = 'networkError';
      } else if (error.message && error.message === 'Request failed with status code 500' && alternativeErrorMessage) {
        _error.message = alternativeErrorMessage;
        _error.code = HttpStatus.INTERNAL_SERVER_ERROR;
      } else if (error.message && error.message === 'Request failed with status code 500') {
        _error.message = 'Request failed with status code 500';
        _error.code = HttpStatus.INTERNAL_SERVER_ERROR;
      } else if (error.response && error.response.data && error.response.data.Message) {
        _error.code = error.response.data.status;
        const message = error.response.data.Message; // Get error message from translation file or default
        // when system return code Unauthorized
        if (_error.code === 'Unauthorized') {
          handleUnAuthorize();
        }
        _error.message = message;
      } else if (error.response && error.response.data && error.response.data.errors) {
        try {
          const errors: { [key: string]: string[] } = error.response.data.errors;
          const serverError = Object.values(errors).reduce((prev, curr) => [...prev, ...curr]);
          _error.code = error.response.data.status;
          _error.message = serverError.join('');
        } catch {
          _error.message = error.response.data.errors[0].message;
        }
      } else {
        _error.message = error + ''; // cast to string type
      }

      // show error
      if (handleErrorAutomatic && _error.message !== 'Error: Request failed with status code 401') {
        toggleMessage(_error);
      }

      return Promise.reject(error);
    }
  );
  //#endregion

  return instance;
};

const handleUnAuthorize = async () => {
  await AuthService.logout();
  store.dispatch(logout());
  store.dispatch(clearUserNotAuth());

  if (typeof window !== 'undefined' && window.location.href.indexOf('/login') === -1) {
    window.location.href = `/login?url=${window.location.pathname}`;
  }
};
