import { Box, Center, Divider } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface ICountryProvinceProps {}

const CountryProvince: NextPage = (props: ICountryProvinceProps) => {
  return <Box w='100%'>Hà nội</Box>;
};

export default CountryProvince;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
