import { Box, Center, Divider } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CountriesList from '../../components/views/Discovery/CountriesList/index.component';
import ProvincesList from '../../components/views/Discovery/ProvincesList/index.component';

export interface IDiscoveryProps {}

const Discovery: NextPage = (props: IDiscoveryProps) => {
  return (
    <Box w='100%'>
      <CountriesList />
      <Center mx='36'>
        <Divider orientation='horizontal' my='14' borderColor='gray.500' />
      </Center>
      <ProvincesList />
      <Center mx='36'>
        <Divider orientation='horizontal' my='8' borderColor='transparent' />
      </Center>
    </Box>
  );
};

export default Discovery;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
