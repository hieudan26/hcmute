import { Box } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WorkInProgress from '../../components/views/WorkInProgress/index.component';

export interface IItineraryProps {}

const Itinerary: NextPage = (props: IItineraryProps) => {
  return (
    <Box mb='10'>
      <WorkInProgress />
    </Box>
  );
};

export default Itinerary;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
