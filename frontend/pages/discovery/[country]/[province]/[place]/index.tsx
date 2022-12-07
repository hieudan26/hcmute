import { Box, Center, Divider } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProvincePlaceProps {}

const ProvincePlace: NextPage = (props: IProvincePlaceProps) => {
  return <Box w='100%'>Hồ hoàn kiếm</Box>;
};

export default ProvincePlace;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
