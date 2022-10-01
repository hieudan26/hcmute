import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConfirmModal from '../../components/views/Auth/Modal/ConfirmModal/index.component';
import RegisterForm from '../../components/views/Auth/RegisterForm/index.component';
import { ILoginRequest } from '../../models/auth/login.model';
import { IRegisterRequest } from '../../models/auth/register.model';
import { AuthService } from '../../services/auth/auth.service';
import { LocalUtils } from '../../utils/local.utils';

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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'register', 'confirm_modal'])),
      // Will be passed to the page component as props
    },
  };
}
