import { Box } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IAdminUsersManagementPageProps {}

const AdminUsersManagementPage: NextPage = (props: IAdminUsersManagementPageProps) => {
  return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>AdminUsersManagementPage</Box>;
};

export default AdminUsersManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
