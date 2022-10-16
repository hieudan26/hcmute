import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ForgotPasswordForm from '../../components/views/Auth/ForgotPasswordForm/index.component';
import ForgotPasswordSetNewForm from '../../components/views/Auth/ForgotPasswordSetNewForm/index.component';
import { toggleMessage } from '../../components/views/Message/index.component';
import { IForgotPasswordSetNew } from '../../models/auth/register.model';
import { AuthService } from '../../services/auth/auth.service';
import { useRouter } from 'next/router';
import { toggleMessage } from '../../components/views/Message/index.component';

export interface IForgotPasswordProps {}

const ForgotPassword: NextPage = (props: IForgotPasswordProps) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingNewPw, setSubmittingNewPw] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);

  const forgotPassword = async (email: string) => {
    const emailExisted = await AuthService.checkEmailExisted(email, setSubmitting);
    const emailExisted = await AuthService.checkEmailExisted(email);
    if (emailExisted) {
      const response = await AuthService.forgotPassword(email, setSubmitting);
      setEmail(email);
      setStatus(true);
    } else {
      toggleMessage({
        message: 'Email not existed in our system',
        type: 'warning',
      });
    }
  };

  const setNewPassword = async (data: IForgotPasswordSetNew) => {
    const response = await AuthService.forgotPasswordSetNew(data, setSubmittingNewPw);
    if (response === 'SUCCESS') {
      router.push('login');
    }
  };

  return (
    <>
      {!status ? (
        <ForgotPasswordForm submitting={submitting} onSubmit={forgotPassword} />
      ) : (
        <ForgotPasswordSetNewForm email={email} submitting={submittingNewPw} setNewPassword={setNewPassword} />
      )}
    </>
  );
};

export default ForgotPassword;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'forgot_password', 'forgot_password_set_new'])),
      // Will be passed to the page component as props
    },
  };
}
