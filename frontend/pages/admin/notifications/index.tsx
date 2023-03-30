import { Box, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ListNotifications from '../../../components/views/Notification/ListNotifications/index.component';

export interface IAdminNotificationsPageProps {}

const AdminNotificationsPage: NextPage = (props: IAdminNotificationsPageProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');

  return (
    <Box mb='10' shadow='lg' bg={boxBg}>
      <ListNotifications />
    </Box>
  );
};

export default AdminNotificationsPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
