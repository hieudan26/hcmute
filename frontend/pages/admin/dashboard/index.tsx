import { AspectRatio, Box, Center, Button } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IAdminDashboardProps {}

const AdminDashboard: NextPage = (props: IAdminDashboardProps) => {
  const openGrafana = () => {
    const newWindow = window.open(
      'https://lumiere.grafana.net/d/fvuRtcFVz/lumiere?orgId=1&from=1670078065727&to=1670078365727',
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Box w='full'>
      <Center mb='8'>
        <Button w='50%' onClick={openGrafana}>
          Click to view detail
        </Button>
      </Center>
      <AspectRatio maxW='full' ratio={1}>
        <iframe
          src='https://lumiere.grafana.net/d/fvuRtcFVz/lumiere?orgId=1&from=1670078268205&to=1670078303627'
          allowFullScreen
          // frameborder='0'
        />
      </AspectRatio>
    </Box>
  );
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
