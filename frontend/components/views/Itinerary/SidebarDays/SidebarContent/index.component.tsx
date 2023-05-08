import { Box, BoxProps, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import NavItem from '../NavItem/index.component';
import { MdHome } from 'react-icons/md';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { formatDateddMMYYYYtoDate, getMaxDate, getMinDate, addDaysToDate } from '../../../../../utils';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import GroupButtonControl from '../../../Profile/About/GroupButtonControl/index.component';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { SmallAddIcon } from '@chakra-ui/icons';
import { ITripDayResponseModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';

export interface ISidebarContentProps extends BoxProps {
  trip: ITripsResponseModel | undefined;
}

export default function SidebarContent(props: ISidebarContentProps) {
  const { trip, ...rest } = props;
  const refScroll = useRef<HTMLDivElement | null>(null);
  const noColorProps = useColorModeValue('black', 'white');
  const [date, setDate] = useState<Date>(getMaxDate());
  const [tripDays, setTripDays] = useState<ITripDayResponseModel[]>([]);

  const propsConfigs: PropsConfigs = {
    dateNavBtnProps: {
      color: noColorProps,
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        color: noColorProps,
      },
      selectedBtnProps: {
        background: '#D0637C',
        color: '#f6f6f6',
      },
    },
  };

  useEffect(() => {
    if (trip) {
      setTripDays(trip.tripDays);
      let tempDate = trip.startTime.split(' ')[0];
      var dateObject = formatDateddMMYYYYtoDate(tempDate);
      setDate(dateObject);
    }
  }, [trip]);

  const addMoreDays = () => {
    if (trip) {
      let lastOrdinal = tripDays[tripDays.length - 1].ordinal;
      let arrTemp = [...tripDays];
      let temp: ITripDayResponseModel = {
        date: '',
        description: '',
        id: 2,
        ordinal: lastOrdinal + 1,
        tripId: trip.id,
        tripPlaces: [],
      };
      arrTemp.push(temp);
      setTripDays(arrTemp);
      const timer = setTimeout(() => {
        if (refScroll.current) {
          const scrollHeight = refScroll.current.scrollHeight;
          const clientHeight = refScroll.current.clientHeight;
          const maxScrollTop = scrollHeight - clientHeight;
          refScroll.current.scrollTo({
            top: maxScrollTop,
            behavior: 'smooth',
          });
        }
      }, 200);
    }
  };

  return (
    <Box
      shadow='md'
      bg={useColorModeValue('white', 'blackAlpha.200')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Box pl='4' py='3' color='red' _dark={{ color: 'gray.400' }} role='group' transition='.15s ease' fontSize='small'>
        *Chọn ngày bắt đầu
      </Box>
      <Box px='4' pb='2'>
        <SingleDatepicker
          propsConfigs={propsConfigs}
          name='date-input'
          date={date}
          minDate={trip && trip.type === 'Plan' ? getMinDate() : undefined}
          maxDate={trip && trip.type === 'Plan' ? undefined : new Date()}
          onDateChange={setDate}
        />
      </Box>
      <Flex direction='column' fontSize='sm' color='gray.600' overflowY='auto' h='md' ref={refScroll}>
        {tripDays.map((item, index) => (
          <NavItem key={index} stt={index + 1} day={date} />
        ))}
      </Flex>
      <Box px='6' pt='4'>
        <Button leftIcon={<SmallAddIcon />} width='full' onClick={addMoreDays}>
          Thêm ngày
        </Button>
      </Box>
    </Box>
  );
}
