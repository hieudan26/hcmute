import { Box, Center, Divider } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IPlaceImagesProps {}

const PlaceImages: NextPage = (props: IPlaceImagesProps) => {
  return <Box w='100%'>Discovery - country - province - place - images</Box>;
};

export default PlaceImages;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
