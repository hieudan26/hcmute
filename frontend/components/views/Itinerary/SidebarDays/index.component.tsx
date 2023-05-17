import {
  Avatar,
  Box,
  Center,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import SidebarContent from './SidebarContent/index.component';
import { FiMenu } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import NavStep from '../NavStep/index.component';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTripById } from '../../../../hooks/queries/trip';
import { ITripDayResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import { useAppDispatch } from '../../../../hooks/redux';
import { setValueStatusItinerary } from '../../../../app/slices/statusItinararySlice';
import { setCurrentTrip } from '../../../../app/slices/currentTripSlice';

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
  const [idTrip, setIdTrip] = useState<string>('');
  const [data, setData] = useState<ITripsResponseModel | undefined>(undefined);
  const [tripDayChoose, setTripDateChoose] = useState<ITripDayResponseModel>(defaultValueTripDayChoose);
  const trip = useTripById(idTrip, undefined, idTrip !== '');

  useEffect(() => {
    if (trip.data) {
      let temp = trip.data.data as ITripsResponseModel;
      temp.tripDays.length > 0 && setTripDateChoose(temp.tripDays[0]);
    }
  }, [trip.data]);

  useEffect(() => {
    if (trip.data) {
      let temp = trip.data.data as ITripsResponseModel;
      setData(temp);
      dispatch(setCurrentTrip(temp));
      dispatch(setValueStatusItinerary(temp.status as 'Private' | 'Public'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.data]);

  useEffect(() => {
    const { id } = router.query;
    setIdTrip(id as string);
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
