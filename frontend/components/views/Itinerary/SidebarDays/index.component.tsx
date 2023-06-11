import { Box, Center, Drawer, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { setCurrentTrip } from '../../../../app/slices/currentTripSlice';
import { setValueStatusItinerary } from '../../../../app/slices/statusItinararySlice';
import { useTripById } from '../../../../hooks/queries/trip';
import { useAppDispatch } from '../../../../hooks/redux';
import { ITripDayResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import SidebarContent from './SidebarContent/index.component';

export interface ISidebarDaysProps {
  children: React.ReactNode;
}

export const defaultValueTripDayChoose: ITripDayResponseModel = {
  date: '',
  description: '',
  id: 0,
  ordinal: 0,
  tripId: 0,
  tripPlaces: [],
  provinces: [],
};

export default function SidebarDays(props: ISidebarDaysProps) {
  const { children } = props;
  const sidebar = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [idTrip, setIdTrip] = useState<string>('');
  const [data, setData] = useState<ITripsResponseModel | undefined>(undefined);
  const [tripDayChoose, setTripDateChoose] = useState<ITripDayResponseModel>(defaultValueTripDayChoose);
  const trip = useTripById(idTrip, undefined, idTrip !== '');

  useEffect(() => {
    queryClient.invalidateQueries(['trip_by_id']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trip.data) {
      let temp = trip.data.data as ITripsResponseModel;
      temp.tripDays.length > 0 && setTripDateChoose(temp.tripDays[0]);
    }
  }, [trip.data]);

  useEffect(() => {
    const { id } = router.query;
    if (trip.data && id) {
      let temp = trip.data.data as ITripsResponseModel;
      setData(temp);
      dispatch(setCurrentTrip(temp));
      dispatch(setValueStatusItinerary(temp.status as 'Private' | 'Public'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.data, router.query]);

  useEffect(() => {
    const { id } = router.query;
    setIdTrip(id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <Box>
      <SidebarContent
        display={{ base: 'none', md: 'unset' }}
        trip={data}
        tripDateChoose={tripDayChoose}
        setTripDateChoose={setTripDateChoose}
      />
      <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement='left'>
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent trip={data} tripDateChoose={tripDayChoose} setTripDateChoose={setTripDateChoose} />
        </DrawerContent>
      </Drawer>

      <Center ml={{ base: 0, md: 60 }} minH='full'>
        {/* {React.cloneElement(children as React.ReactElement, { test: trip.data })} */}
        {/* {children} */}
        {React.Children.map(children, (child) =>
          React.cloneElement(child as React.ReactElement, {
            trip: data,
            tripDayChoose: tripDayChoose,
            setTripDayChoose: setTripDateChoose,
          })
        )}
      </Center>
    </Box>
  );
}
