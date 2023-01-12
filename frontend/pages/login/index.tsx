import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { login, logout } from '../../app/slices/authSlice';
import LoginForm from '../../components/views/Auth/LoginForm/index.component';
import ConfirmModal from '../../components/views/Auth/Modal/ConfirmModal/index.component';
import { RoleConstants } from '../../constants/roles.constant';
import { useAppDispatch } from '../../hooks/redux';
import { ILoginRequest } from '../../models/auth/login.model';
import { AuthService } from '../../services/auth/auth.service';
import userService from '../../services/user/user.service';
import { useQueryClient } from '@tanstack/react-query';
import { toggleMessage } from '../../components/views/Message/index.component';

export interface ILoginProps {}

const Login: NextPage = (props: ILoginProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkConfirm, setCheckConfirm] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string>('');
  const [userData, setUserData] = useState<ILoginRequest>({
    email: '',
    password: '',
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { url } = router.query;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!url) setRedirectPath('');
    else setRedirectPath(url as string);
  }, [url]);

  const _onSubmit = async (data: ILoginRequest) => {
    const user = await AuthService.login(data, setSubmitting);
    var response = undefined;

    if (!user.isSuccess && user.code === 'UserNotConfirmedException') {
      setUserData({ ...userData, email: data.email, password: data.password });
      setIsOpenConfirmModal(true);
    } else if (user.isSuccess) {
      if (user.attributes['custom:is_first_login'] === 'false') {
        const id = user.attributes.sub;
        response = await userService.getUserById(id);
        dispatch(login(response?.data));
      } else {
        //This case does not occur but is still processed
        //To make sure redux-persit for auth slice is null
        dispatch(logout());
      }

      if (response?.data.role === RoleConstants.USER) {
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
        queryClient.invalidateQueries(['post_by_Id']);
        queryClient.invalidateQueries(['posts_by_type_userId']);
        queryClient.invalidateQueries(['posts_by_type']);
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push('/experiences');
        }
      } else if (response?.data.role === RoleConstants.ADMIN) {
        AuthService.adminLoginFail();
        toggleMessage({
          message: 'Incorrect account and password',
          type: 'error',
          title: 'Login',
        });
      } else {
        AuthService.adminLoginFail();
        router.push('/register');
      }
    }
  };

  const relogin = async (data: ILoginRequest) => {
    const user = await AuthService.login(data, setCheckConfirm);
    if (user.isSuccess) {
      if (user.attributes['custom:is_first_login'] === 'false') {
        const id = user.attributes.sub;
        const response = await userService.getUserById(id);
        dispatch(login(response?.data));
      } else {
        //This case does not occur but is still processed
        //To make sure redux-persit for auth slice is null
        dispatch(logout());
      }

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push('/experiences');
      }
    }
  };

  const resendConfirmEmail = async (email: string) => {
    const response = await AuthService.resendConfirmationEmail(email);
  };

  const loginWithGG = async () => {
    const response = await AuthService.loginWithGoogle();
  };

  return (
    <>
      <LoginForm loginWithGG={loginWithGG} _onSubmit={_onSubmit} submitting={submitting} />
      <ConfirmModal
        resendConfirmEmail={resendConfirmEmail}
        checkConfirm={checkConfirm}
        login={relogin}
        isOpen={isOpenConfirmModal}
        userData={userData}
        close={() => {
          setIsOpenConfirmModal(false);
        }}
      />
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'login', 'confirm_modal'])),
      // Will be passed to the page component as props
    },
  };
};
