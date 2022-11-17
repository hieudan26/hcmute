import { Box } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IAdminDashboardProps {}

const AdminDashboard: NextPage = (props: IAdminDashboardProps) => {
  return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>Admin dashboard</Box>;
};

export default AdminDashboard;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
