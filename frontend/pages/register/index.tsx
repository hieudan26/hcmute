import { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConfirmModal from '../../components/views/Auth/Modal/ConfirmModal/index.component';
import RegisterForm from '../../components/views/Auth/RegisterForm/index.component';
import { useAppDispatch } from '../../hooks/redux';
import { ILoginRequest } from '../../models/auth/login.model';
import { IRegisterRequest } from '../../models/auth/register.model';
import { AuthService } from '../../services/auth/auth.service';
import userService from '../../services/user/user.service';
import { login as loginSlice, logout } from '../../app/slices/authSlice';

export interface IRegisterProps {}

const Register: NextPage = (props: IRegisterProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkConfirm, setCheckConfirm] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<ILoginRequest>({
    email: '',
    password: '',
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const _onSubmit = async (data: IRegisterRequest) => {
    const response = await AuthService.register(data, setSubmitting);
    if (response && response.user) {
      setUserData({ ...userData, email: response.user.getUsername(), password: data.password });
      setIsOpenConfirmModal(true);
    }
  };

  const login = async (data: ILoginRequest) => {
    const user = await AuthService.login(data, setCheckConfirm);
    if (user.isSuccess) {
      if (user.attributes['custom:is_first_login'] === 'false') {
        const id = user.attributes.sub;
        const response = await userService.getUserById(id);
        dispatch(loginSlice(response?.data));
      } else {
        //This case does not occur but is still processed
        //To make sure redux-persit for auth slice is null
        dispatch(logout());
      }
      router.push('/experiences');
    }
  };

  const resendConfirmEmail = async (email: string) => {
    const response = await AuthService.resendConfirmationEmail(email);
    console.log(response);
  };

  return (
    <>
      <RegisterForm _onSubmit={_onSubmit} submitting={submitting} />
      <ConfirmModal
        resendConfirmEmail={resendConfirmEmail}
        checkConfirm={checkConfirm}
        login={login}
        isOpen={isOpenConfirmModal}
        userData={userData}
      />
      {/* <button onClick={() => AuthService.loginWithGoogle()}>Open Google</button> */}
    </>
  );
};

export default Register;

export const getStaticProps: GetStaticProps = async ({ locale }: any) =>{
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'register', 'confirm_modal'])),
      // Will be passed to the page component as props
    },
  };
}
