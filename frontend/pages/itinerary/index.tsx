import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IItineraryProps {}

const Itinerary: NextPage = (props: IItineraryProps) => {
  return <Box>Itinerary</Box>;
};

export default Itinerary;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer'])),
      // Will be passed to the page component as props
    },
  };
}
