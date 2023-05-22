import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PlacesList from '../../../../components/views/Itinerary/Places/List/index.component';
import OptionBox from '../../../../components/views/Itinerary/OptionBox/index.component';
import ChooseBox from '../../../../components/views/Itinerary/ChooseBox/index.component';
import dynamic from 'next/dynamic';
import { useAppSelector } from '../../../../hooks/redux';
import { useTripById } from '../../../../hooks/queries/trip';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ITripDayResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import { useGetPlaceById } from '../../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { isEquivalent } from '../../../../utils';
import { useBeforeUnload } from 'react-use';
import { toggleMessage } from '../../../../components/views/Message/index.component';
const CreateMap = dynamic(() => import('../../../../components/views/Itinerary/Maps/CreateMap/index.component'), {
  ssr: false,
});

export interface IItineraryEditPageProps {
  trip: ITripsResponseModel | undefined;
  tripDayChoose: ITripDayResponseModel;
}

const ItineraryEditPage: NextPage<IItineraryEditPageProps> = (props: IItineraryEditPageProps) => {
  const { trip, tripDayChoose } = props;
  const router = useRouter();
  const bg = useColorModeValue('gray.100', 'header.primary_darkMode');
  const isItineraryMap = useAppSelector((state) => state.itineraryMap.value);
  const currentTrip = useAppSelector((state) => state.currentTrip.value);
  const auth = useAppSelector((state) => state.auth.value);
  const [countryData, setCountryData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const country = useGetPlaceById(trip ? trip.startingPlace.toString() : '1', trip !== undefined);

  useEffect(() => {
    if (auth && currentTrip && auth.id !== currentTrip.ownerId) {
      router.push('/itinerary');
      toggleMessage({
        type: 'warning',
        message: 'Bạn không có quyền này',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, currentTrip]);

  useEffect(() => {
    country.data && setCountryData(country.data.data);
  }, [country.data]);

  if (auth && currentTrip && auth.id === currentTrip.ownerId) {
    return (
      <Flex direction='row' w='full' bg={bg} minH='86.6vh'>
        <Box w='40%'>
          <ChooseBox trip={trip} tripDayChoose={tripDayChoose} countryData={countryData} />
        </Box>
        <Box w='54%'>
          {isItineraryMap ? (
            <CreateMap trip={trip} tripDayChoose={tripDayChoose} />
          ) : (
            <PlacesList tripDayChoose={tripDayChoose} trip={trip} countryData={countryData} />
          )}
        </Box>
        <Box w='6%'>
          <OptionBox trip={trip} />
        </Box>
      </Flex>
    );
  } else {
    return <></>;
  }
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
