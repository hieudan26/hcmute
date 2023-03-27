import { Auth, Hub, Logger } from 'aws-amplify';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toggleMessage } from '../../components/views/Message/index.component';
import { API_PATH } from '../../constants/api-path.constant';
import { ILoginRequest } from '../../models/auth/login.model';
import { IForgotPasswordSetNew, IRegisterRequest } from '../../models/auth/register.model';
import { LogOut } from '../../utils';
import { postAsync } from '../../utils/HttpClient.util';
import { LocalUtils } from '../../utils/local.utils';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { async } from 'rxjs';
import { IChangePassword } from '../../models/auth/changePassword.model';

const logger = new Logger('AuthService');

export class AuthService {
  static CHANNEL = 'auth_channel';

  static AUTH_EVENTS = {
    REGISTER: 'register',
    LOGIN: 'login',
  };

  static adminLogin = async (data: ILoginRequest, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    try {
      const { email, password } = data;
      const result = await Auth.signIn(email, password);

      logger.info('login user ' + JSON.stringify(result));

      // await LocalUtils.storeAuthenticationData();
      return { ...result, isSuccess: true };
    } catch (error: any) {
      const { __type, message } = error;

      logger.warn("Couldn't login: ", error);

      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });

      return { ...error, isSuccess: false };
    } finally {
      setSubmitting(false);
    }
  };

  static adminLoginFail = async () => {
    try {
      await Auth.signOut();
      LogOut();
    } catch (error: any) {
      const { __type, message } = error;
      logger.error("Couldn't logout: ", error);
      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    } finally {
    }
  };

  static changePassword = async (data: IChangePassword, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    try {
      const current_user = await Auth.currentAuthenticatedUser();
      console.log(current_user);
      const result = await Auth.changePassword(current_user, data.current_password, data.new_password);
      toggleMessage({
        code: uuidv4(),
        type: 'success',
        message: `Đổi mật khẩu: ${current_user.attributes.email} thành công`,
      });
      return result;
    } catch (error: any) {
      const { __type, message } = error;
      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  static loginWithGoogle = async () => {
    try {
      const result = await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
      await LocalUtils.storeAuthenticationData();
      return result;
    } catch (error: any) {
      const { __type, message } = error;
      logger.error("Couldn't logout: ", error);
      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    }
  };

  static checkEmailExisted = async (
    email: string,
    setSubmitting: Dispatch<SetStateAction<boolean>>
  ): Promise<AxiosResponse<any>> => {
    var url = API_PATH.CHECK_EMAIL_EXISTED;
    const result = await postAsync(url, { email: email }, undefined, false, false, false, undefined, setSubmitting);
    const isExisted = result.data.isExisted;
    return isExisted;
  };

  static logout = async () => {
    toggleMessage({
      title: 'Quá sớm để nói lời tạm biệt 😿',
      code: uuidv4(),
      type: 'info',
      message: 'Bạn đã đăng xuất, hẹn gặp lại lần sau',
    });
    try {
      await Auth.signOut();
      LogOut();
      // toggleMessage({
      //   title: 'Too soon too say goodbye 😿',
      //   // code: uuidv4(),
      //   type: 'info',
      //   message: 'You are logged out, see you next time',
      // });
    } catch (error: any) {
      const { __type, message } = error;
      logger.error("Couldn't logout: ", error);
      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    } finally {
      // toggleLogout(true);
      // const timer = setTimeout(() => {
      //   toggleLogout(false);
      // }, 2000);
    }
  };

  static forgotPasswordSetNew = async (data: IForgotPasswordSetNew, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    const { email, code, password } = data;
    try {
      const result = await Auth.forgotPasswordSubmit(email, code, password);

      logger.info('Changed password: ' + data);

      toggleMessage({
        code: uuidv4(),
        type: 'success',
        message: 'Mật khẩu đã được thay đổi thành công, đăng nhập bằng mật khẩu mới',
      });

      return result;
    } catch (error: any) {
      const { __type, message } = error;
      logger.error("Couldn't change password: ", error);
      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  static forgotPassword = async (email: string, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    try {
      const result = await Auth.forgotPassword(email);
      logger.info('Password reset: ' + result);

      toggleMessage({
        code: uuidv4(),
        type: 'success',
        message: 'Vui lòng kiểm tra email của bạn để nhận mã',
      });

      return result;
    } catch (error: any) {
      const { __type, message } = error;

      logger.error(error);

      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  static resendConfirmationEmail = async (email: string) => {
    try {
      const result = await Auth.resendSignUp(email);

      logger.info('code resent successfully');

      toggleMessage({
        code: uuidv4(),
        type: 'success',
        message: 'Email xác minh đã được gửi, vui lòng kiểm tra email của bạn.',
      });
      return result;
    } catch (error: any) {
      const { __type, message } = error;
      logger.error(error);

      toggleMessage({
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    }
  };

  static login = async (data: ILoginRequest, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    try {
      const { email, password } = data;
      const result = await Auth.signIn(email, password);

      logger.info('login user ' + JSON.stringify(result));

      Hub.dispatch(
        AuthService.CHANNEL,
        {
          event: AuthService.AUTH_EVENTS.LOGIN,
          message: 'You are successfully logged in',
          data: result,
        },
        AuthService.CHANNEL
      );

      await LocalUtils.storeAuthenticationData();
      return { ...result, isSuccess: true };
    } catch (error: any) {
      const { __type, message } = error;

      logger.warn("Couldn't login: ", error);

      Hub.dispatch(
        AuthService.CHANNEL,
        {
          event: AuthService.AUTH_EVENTS.LOGIN,
          message: message,
          data: error,
        },
        AuthService.CHANNEL
      );

      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });

      return { ...error, isSuccess: false };
    } finally {
      setSubmitting(false);
    }
  };

  static register = async (data: IRegisterRequest, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    try {
      const { email: username, password, is_first_login, role } = data;
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          'custom:is_first_login': is_first_login,
          'custom:role': role,
        },
      });

      logger.info('registering ' + username);

      Hub.dispatch(
        AuthService.CHANNEL,
        {
          event: AuthService.AUTH_EVENTS.REGISTER,
          message: 'You are successfully logged in',
          data: result,
        },
        AuthService.CHANNEL
      );

      return { ...result, isSuccess: true };
    } catch (error: any) {
      const { __type, message } = error;

      logger.warn("Couldn't login: ", error);

      Hub.dispatch(
        AuthService.CHANNEL,
        {
          event: AuthService.AUTH_EVENTS.REGISTER,
          message: message,
          data: error,
        },
        AuthService.CHANNEL
      );

      toggleMessage({
        title: __type,
        code: uuidv4(),
        type: 'error',
        message: message,
      });
    } finally {
      setSubmitting(false);
    }
  };
}
