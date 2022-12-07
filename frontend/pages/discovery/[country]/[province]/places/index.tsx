import { Box } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProvincePlacesProps {}

const ProvincePlaces: NextPage = (props: IProvincePlacesProps) => {
  return <Box mb='10'>Discovery - country - province - places</Box>;
};

export default ProvincePlaces;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
