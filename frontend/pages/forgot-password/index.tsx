import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import ForgotPasswordForm from '../../components/views/Auth/ForgotPasswordForm/index.component';
import { AuthService } from '../../services/auth/auth.service';
import { CodeDeliveryDetails } from 'amazon-cognito-identity-js';
import ForgotPasswordSetNewForm from '../../components/views/Auth/ForgotPasswordSetNewForm/index.component';
import { IForgotPasswordSetNew } from '../../models/auth/register.model';
import { useRouter } from 'next/router';

export interface IForgotPasswordProps {}

const ForgotPassword: NextPage = (props: IForgotPasswordProps) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingNewPw, setSubmittingNewPw] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);

  const forgotPassword = async (email: string) => {
    const response = await AuthService.forgotPassword(email, setSubmitting);
    setEmail(email);
    setStatus(true);
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
      ...(await serverSideTranslations(locale, ['header', 'footer'])),
      // Will be passed to the page component as props
    },
  };
}
