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
import { ITripsResponseModel } from '../../../../models/trip/trip.model';
import { useAppDispatch } from '../../../../hooks/redux';
import { setValueStatusItinerary } from '../../../../app/slices/statusItinararySlice';

export interface ISidebarDaysProps {
  children: React.ReactNode;
}

export default function SidebarDays(props: ISidebarDaysProps) {
  const { children } = props;
  const sidebar = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [idTrip, setIdTrip] = useState<string>('');
  const [data, setData] = useState<ITripsResponseModel | undefined>(undefined);
  const trip = useTripById(idTrip, undefined, idTrip !== '');

  useEffect(() => {
    if (trip.data) {
      let temp = trip.data.data as ITripsResponseModel;
      setData(temp);
      dispatch(setValueStatusItinerary(temp.status as 'Private' | 'Public'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  useEffect(() => {
    const { id } = router.query;
    setIdTrip(id as string);
  }, [router.query]);

  return (
    <Box>
      <SidebarContent display={{ base: 'none', md: 'unset' }} trip={data} />
      <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement='left'>
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent trip={data} />
        </DrawerContent>
      </Drawer>

      <Center ml={{ base: 0, md: 60 }} minH='full'>
        {/* {React.cloneElement(children as React.ReactElement, { test: trip.data })} */}
        {/* {children} */}
        {React.Children.map(children, (child) => React.cloneElement(child as React.ReactElement, { trip: data }))}
      </Center>
    </Box>
  );
}
