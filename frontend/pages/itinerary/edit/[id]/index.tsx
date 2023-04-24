import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlacesList from '../../../../components/views/Itinerary/Places/List/index.component';
import OptionBox from '../../../../components/views/Itinerary/OptionBox/index.component';
import ChooseBox from '../../../../components/views/Itinerary/ChooseBox/index.component';
import dynamic from 'next/dynamic';
import { useAppSelector } from '../../../../hooks/redux';
const CreateMap = dynamic(() => import('../../../../components/views/Itinerary/Maps/CreateMap/index.component'), {
  ssr: false,
});

export interface IItineraryEditPageProps {}

const ItineraryEditPage: NextPage = (props: IItineraryEditPageProps) => {
  const isItineraryMap = useAppSelector((state) => state.itineraryMap.value);

  return (
    <Flex direction='row' w='full' bg={useColorModeValue('gray.100', 'header.primary_darkMode')} minH='86.6vh'>
      <Box w='40%'>
        <ChooseBox />
      </Box>
      <Box w='54%'>{isItineraryMap ? <CreateMap /> : <PlacesList />}</Box>
      <Box w='6%'>
        <OptionBox />
      </Box>
    </Flex>
  );
};

export default ItineraryEditPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
