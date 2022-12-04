import { AspectRatio, Box } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IAdminDashboardProps {}

const AdminDashboard: NextPage = (props: IAdminDashboardProps) => {
  return (
    <Box w='full'>
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
