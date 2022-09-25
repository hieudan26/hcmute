import axios, { AxiosInstance, AxiosResponse, ResponseType } from 'axios';
import cookie from 'react-cookies';
import { API_PATH, API_URL } from '../constants/api-path.constant';
import { CookieConstants, LocalStorageConstants } from '../constants/store.constant';
import HttpStatus from 'http-status-codes';
import { toggleLoading } from '../components/views/Loading/index.component';
import { LocalUtils } from './local.util';
import { toggleMessage } from '../components/views/Message/index.component';
import { ResponseMessage } from '../models/common/ResponseMessage.model';
import qs from 'qs';

let IS_REFRESHING_TOKEN = false;

export const deleteAsync = (
  url: string,
  successMessage?: string,
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true
): Promise<AxiosResponse> => {
  return axiosInstance(handleErrorAutomatic, successMessage, 'application/json', 'json', isShowLoading, isShowMessage).delete(
    url
  );
};

export const putAsync = (
  url: string,
  json?: object,
  successMessage?: string,
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true
): Promise<AxiosResponse> => {
  return axiosInstance(handleErrorAutomatic, successMessage, 'application/json', 'json', isShowLoading, isShowMessage).put(
    url,
    json
  );
};

export const postAsync = (
  url: string,
  json?: object,
  successMessage?: string,
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true,
  alternativeErrorMessage?: string
): Promise<AxiosResponse> => {
  return axiosInstance(
    handleErrorAutomatic,
    successMessage,
    'application/json',
    'json',
    isShowLoading,
    isShowMessage,
    alternativeErrorMessage
  ).post(url, json);
};

export const getAsync = (
  url: string,
  params?: { [key: string]: any },
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  handleErrorAutomatic: boolean = true
): Promise<AxiosResponse> => {
  return axiosInstance(handleErrorAutomatic, undefined, 'application/json', 'json', isShowLoading, isShowMessage).get(url, {
    params: params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

const getHeaders = (contentType: string) => {
  return {
    'Content-Type': contentType,
    Authorization: `Bearer ${cookie.load(CookieConstants.ACCESS_TOKEN)}`,
  };
};

const axiosInstance = (
  handleErrorAutomatic: boolean,
  successMessage?: string,
  contentType: string = 'application/json',
  responseType: ResponseType = 'json',
  isShowLoading: boolean = true,
  isShowMessage: boolean = true,
  alternativeErrorMessage?: string
): AxiosInstance => {
  if (isShowLoading) toggleLoading(true);

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${cookie.load(CookieConstants.ACCESS_TOKEN)}`,
    },
    responseType: responseType,
  });

  //#region interceptors REQUEST
  instance.interceptors.request.use(async (config: any) => {
    if (config.url?.includes(API_PATH.LOGIN)) {
      return config;
    }

    //can check ingore in here
    await checkRefreshTokenFinished(config);

    let accessToken = LocalUtils.getCookie(CookieConstants.ACCESS_TOKEN);

    if (!accessToken) {
      const refreshToken = LocalUtils.get(LocalStorageConstants.REFRESH_TOKEN);
      if (refreshToken && !IS_REFRESHING_TOKEN) {
        try {
          IS_REFRESHING_TOKEN = true;
          // const res = await AuthService.refreshTokenAsync(refreshToken);
          // LocalUtils.storeAuthenticationData(res.data);
        } catch (error) {
          console.log(error);
        }

        IS_REFRESHING_TOKEN = false;
      }
    }

    config.headers = getHeaders(contentType);
    return config;
  });
  //#endregion

  //#region interceptors RESPONSE
  instance.interceptors.response.use(
    (response) => {
      if (isShowLoading) toggleLoading(false);

      const method = response.config.method;

      (method === 'post' || method === 'put' || method === 'delete') &&
        isShowMessage &&
        toggleMessage({
          message: successMessage ? successMessage : 'Request successful',
          type: 'success',
        });
      return response;
    },
    (error) => {
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
        handleUnAuthorize();
      }

      if (error.error_description) {
        _error.message = error.error_description;
      } else if (error.response?.data?.error_description) _error.message = error.response.data.error_description;
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

function handleUnAuthorize() {
  Object.keys(cookie.loadAll()).forEach((item) => {
    cookie.remove(item);
  });

  localStorage.clear();
  sessionStorage.clear();

  // redirect to login page
  window.location.href = '/login';
  // if (window.location.href.indexOf('/login') === -1) {
  //   window.location.href = `/login?url=${window.location.pathname + window.location.search}`;
  // }
}

const checkRefreshTokenFinished = async (config: any): Promise<boolean> => {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (!IS_REFRESHING_TOKEN) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
  });
};
