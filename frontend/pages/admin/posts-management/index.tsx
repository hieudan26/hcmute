import { Box } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IAdminPostsManagementPageProps {}

const AdminPostsManagementPage: NextPage = (props: IAdminPostsManagementPageProps) => {
  return <Box>AdminPostsManagementPage</Box>;
};

export default AdminPostsManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
