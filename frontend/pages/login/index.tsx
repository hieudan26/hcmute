import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LoginForm from '../../components/views/Auth/LoginForm/index.component';
import ConfirmModal from '../../components/views/Auth/Modal/ConfirmModal/index.component';
import { ILoginRequest } from '../../models/auth/login.model';
import { AuthService } from '../../services/auth/auth.service';
import { LocalUtils } from '../../utils/local.utils';

export interface ILoginProps {}

const Login: NextPage = (props: ILoginProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkConfirm, setCheckConfirm] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<ILoginRequest>({
    email: '',
    password: '',
  });
  const router = useRouter();

  const _onSubmit = async (data: ILoginRequest) => {
    const user = await AuthService.login(data, setSubmitting);

    console.log('user', user);
    if (!user.isSuccess && user.code === 'UserNotConfirmedException') {
      setUserData({ ...userData, email: data.email, password: data.password });
      setIsOpenConfirmModal(true);
    } else if (user.isSuccess) {
      router.back();
    }
  };

  const relogin = async (data: ILoginRequest) => {
    const user = await AuthService.login(data, setCheckConfirm);
    if (user.isSuccess) {
      router.push('/experiences');
    }
  };

  const resendConfirmEmail = async (email: string) => {
    const response = await AuthService.resendConfirmationEmail(email);
    console.log(response);
  };

  return (
    <>
      <LoginForm _onSubmit={_onSubmit} submitting={submitting} />
      <ConfirmModal
        resendConfirmEmail={resendConfirmEmail}
        checkConfirm={checkConfirm}
        login={relogin}
        isOpen={isOpenConfirmModal}
        userData={userData}
      />
    </>
  );
};

export default Login;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'login', 'confirm_modal'])),
      // Will be passed to the page component as props
    },
  };
}
