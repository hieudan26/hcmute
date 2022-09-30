import { Auth, Hub, Logger } from 'aws-amplify';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toggleMessage } from '../../components/views/Message/index.component';
import { ILoginRequest } from '../../models/auth/login.model';
import { IForgotPasswordSetNew, IRegisterRequest } from '../../models/auth/register.model';
import cookie from 'react-cookies';
import { LocalUtils } from '../../utils/local.utils';
import { LogOut } from '../../utils';

const logger = new Logger('AuthService');

export class AuthService {
  static CHANNEL = 'auth_channel';

  static AUTH_EVENTS = {
    REGISTER: 'register',
    LOGIN: 'login',
  };

  // static refreshToken = async () => {
  //   try {
  //     const cognitoUser = await Auth.currentAuthenticatedUser();
  //     const currentSession = await Auth.currentSession();
  //     cognitoUser.refreshSession(currentSession.getRefreshToken(), (err: any, session: any) => {
  //       console.log('session', err, session);
  //       const { idToken, refreshToken, accessToken } = session;
  //       // do whatever you want to do now :)
  //     });
  //   } catch (error) {
  //     toggleMessage({
  //       code: uuidv4(),
  //       type: 'warning',
  //       message: 'Your sign-in session is over, sign in again to continue.',
  //     });
  //   }
  // };

  static logout = async () => {
    try {
      const result = await Auth.signOut();
      LogOut();
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

  static forgotPasswordSetNew = async (data: IForgotPasswordSetNew, setSubmitting: Dispatch<SetStateAction<boolean>>) => {
    setSubmitting(true);
    const { email, code, password } = data;
    try {
      const result = await Auth.forgotPasswordSubmit(email, code, password);

      logger.info('Changed password: ' + data);

      toggleMessage({
        code: uuidv4(),
        type: 'success',
        message: 'Password has been successfully changed, log in with the new password',
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
        message: 'Please check your email to get code',
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
        message: 'Email verify was sent, please check your email.',
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

      LocalUtils.storeAuthenticationData();
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
