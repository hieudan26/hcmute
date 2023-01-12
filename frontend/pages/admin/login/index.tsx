import { Box, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import LoadingComponent from '../../../components/views/Loading/LoadingComponent.tsx/index.component';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ILoginRequest } from '../../../models/auth/login.model';
import { AuthService } from '../../../services/auth/auth.service';
import userService from '../../../services/user/user.service';
import { useAppDispatch } from '../../../hooks/redux';
import { login, logout } from '../../../app/slices/authSlice';
import { RoleConstants } from '../../../constants/roles.constant';
import { toggleMessage } from '../../../components/views/Message/index.component';
import { LocalUtils } from '../../../utils/local.utils';
// import LoginForm from '../../../components/views/Admin/LoginForm/index.component';

//#region lazy loading components
const LoginForm = dynamic(() => import('../../../components/views/Admin/LoginForm/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IAdminLoginProps {}

const AdminLogin: NextPage = (props: IAdminLoginProps) => {
  const bg = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const _onSubmit = async (data: ILoginRequest) => {
    const user = await AuthService.adminLogin(data, setSubmitting);
    var response = undefined;
    if (user.isSuccess) {
      // console.log(user.attributes['custom:role']);
      if (user.attributes['custom:role'] !== RoleConstants.ADMIN) {
        toggleMessage({
          type: 'warning',
          message: 'Login as administrator',
          title: 'Authentication / authorization',
        });
        AuthService.adminLoginFail();
      } else {
        await LocalUtils.storeAuthenticationData();
        if (user.attributes['custom:is_first_login'] === 'false') {
          const id = user.attributes.sub;
          response = await userService.getUserById(id);
          dispatch(login(response?.data));
        } else {
          //This case does not occur but is still processed
          //To make sure redux-persit for auth slice is null
          dispatch(logout());
        }

        if (response?.data.role === RoleConstants.ADMIN) {
          router.push('/admin/dashboard');
        } else {
          dispatch(logout());
          router.push('/admin/login');
        }
      }
    }
  };

  return (
    <Box w='full' px='32' bg={bg}>
      <LoginForm _onSubmit={_onSubmit} submitting={submitting} />
    </Box>
  );
};

export default AdminLogin;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
