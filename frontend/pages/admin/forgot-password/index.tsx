import { Box, Flex, Img, VStack, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import LoadingComponent from '../../../components/views/Loading/LoadingComponent.tsx/index.component';
import ScrollToTop from '../../../components/views/ScrollToTop/index.component';
import ForgotPasswordForm from '../../../components/views/Admin/ForgotPasswordForm/index.component';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '../../../services/auth/auth.service';
import { toggleMessage } from '../../../components/views/Message/index.component';
import { IForgotPasswordSetNew } from '../../../models/auth/register.model';
import ForgotPasswordSetNewForm from '../../../components/views/Admin/ForgotPasswordSetNewForm/index.component';
// import LoginForm from '../../../components/views/Admin/LoginForm/index.component';

//#region lazy loading components

//#endregion

export interface IAdminForgotPasswordProps {}

const AdminForgotPassword: NextPage = (props: IAdminForgotPasswordProps) => {
  const bg = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingNewPw, setSubmittingNewPw] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);

  const forgotPassword = async (email: string) => {
    const emailExisted = await AuthService.checkEmailExisted(email, setSubmitting);
    if (emailExisted) {
      const response = await AuthService.forgotPassword(email, setSubmitting);
      setEmail(email);
      setStatus(true);
    } else {
      toggleMessage({
        message: "Email not existed or you haven't confirmed the email",
        type: 'warning',
      });
    }
  };

  const setNewPassword = async (data: IForgotPasswordSetNew) => {
    const response = await AuthService.forgotPasswordSetNew(data, setSubmittingNewPw);
    if (response === 'SUCCESS') {
      router.push('/admin/login');
    }
  };

  return (
    <Box w='full' px='32' bg={bg}>
      {!status ? (
        <ForgotPasswordForm onSubmit={forgotPassword} submitting={submitting} />
      ) : (
        <ForgotPasswordSetNewForm email={email} submitting={submittingNewPw} setNewPassword={setNewPassword} />
      )}
      <ScrollToTop />
    </Box>
  );
};

export default AdminForgotPassword;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
