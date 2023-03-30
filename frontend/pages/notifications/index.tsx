import { Box, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ListNotifications from '../../components/views/Notification/ListNotifications/index.component';

export interface INotificationsPageProps {}

const NotificationsPage: NextPage = (props: INotificationsPageProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');

  return (
    <Box shadow='lg' bg={boxBg} rounded='md'>
      <ListNotifications />
    </Box>
  );
};

export default NotificationsPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
