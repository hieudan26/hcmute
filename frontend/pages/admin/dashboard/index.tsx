import { AspectRatio, useColorMode } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IAdminDashboardProps {}

const AdminDashboard: NextPage = (props: IAdminDashboardProps) => {
  const { colorMode } = useColorMode();

  return (
    <AspectRatio w='full' maxW='full' ratio={1}>
      <iframe
        src={`http://18.142.192.152:3000/d/fvuRtcFVz/lumiere?orgId=1&from=1678604695432&to=1678604995432&theme=${colorMode}&kiosk=tv`} //=tv
        // src={`http://18.142.192.152:3000/d/fvuRtcFVz/lumiere?orgId=1&from=1678604695432&to=1678604995432&theme=${colorMode}&kiosk`}
        allowFullScreen
      />
    </AspectRatio>
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
