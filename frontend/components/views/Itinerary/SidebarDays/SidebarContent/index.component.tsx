import { Box, BoxProps, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import NavItem from '../NavItem/index.component';
import { MdHome } from 'react-icons/md';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { formatDateddMMYYYYtoDate, getMaxDate, getMinDate, addDaysToDate, formatDate } from '../../../../../utils';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import GroupButtonControl from '../../../Profile/About/GroupButtonControl/index.component';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { SmallAddIcon } from '@chakra-ui/icons';
import { ITripDayResponseModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { setCurrentTrip, setTripDays } from '../../../../../app/slices/currentTripSlice';
import { defaultValueTripDayChoose } from '../index.component';

export interface ISidebarContentProps extends BoxProps {
  trip: ITripsResponseModel | undefined;
  setTripDateChoose: React.Dispatch<React.SetStateAction<ITripDayResponseModel>>;
  tripDateChoose: ITripDayResponseModel;
}

export default function SidebarContent(props: ISidebarContentProps) {
  const { trip, setTripDateChoose, tripDateChoose, ...rest } = props;
  const refScroll = useRef<HTMLDivElement | null>(null);
  const noColorProps = useColorModeValue('black', 'white');
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(getMaxDate());
  // const [tripDays, setTripDays] = useState<ITripDayResponseModel[]>([]);
  const currentTrip = useAppSelector((state) => state.currentTrip.value);

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
    if (currentTrip) {
      let tempDate = currentTrip.startTime.split(' ')[0];
      let dateObject = formatDateddMMYYYYtoDate(tempDate);
      setDate(dateObject);
    }
  }, [currentTrip]);

  const deleteDay = (id: number) => {
    if (currentTrip) {
      let arrTemp = [...currentTrip.tripDays];
      arrTemp = arrTemp.filter((x) => x.id !== id);

      let clone = { ...currentTrip };
      // clone.tripDays = arrTemp;
      clone.tripDays = arrTemp.map((x, index) => {
        let tempTripDay = { ...x };
        tempTripDay.date = `${addDaysToDate(date, index)}`;
        tempTripDay.tripPlaces = tempTripDay.tripPlaces.map((place, index) => {
          let tempTripPlace = { ...place };
          tempTripPlace.startTime = `${addDaysToDate(date, index)} 00:00:00`;
          tempTripPlace.endTime = `${addDaysToDate(date, index)} 00:00:00`;
          return tempTripPlace;
        });
        return tempTripDay;
      });
      clone.startTime = `${formatDate(date)} 00:00:00`;
      clone.endTime = `${addDaysToDate(date, clone.tripDays.length - 1)} 00:00:00`;
      dispatch(setCurrentTrip(clone));
      if (clone.tripDays.length === 0) {
        setTripDateChoose(defaultValueTripDayChoose);
      }
    }
  };

  const addMoreDays = () => {
    if (currentTrip) {
      let lastOrdinal = currentTrip.tripDays.length ? currentTrip.tripDays[currentTrip.tripDays.length - 1].ordinal : 0;
      let tempId = currentTrip.tripDays.length ? currentTrip.tripDays[currentTrip.tripDays.length - 1].id : 0;
      let arrTemp = [...currentTrip.tripDays];
      let temp: ITripDayResponseModel = {
        date: '',
        description: '',
        id: tempId + 1,
        ordinal: lastOrdinal + 1,
        tripId: currentTrip.id,
        tripPlaces: [],
        provinces: [],
      };
      arrTemp.push(temp);
      let clone = { ...currentTrip };
      clone.tripDays = arrTemp;
      dispatch(setCurrentTrip(clone));
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

  const changeStartDate = (date: Date) => {
    if (currentTrip) {
      setDate(date);

      let currentTripUpdate = { ...currentTrip };
      currentTripUpdate.tripDays = currentTripUpdate.tripDays.map((x, index) => {
        let tempTripDay = { ...x };
        tempTripDay.date = `${addDaysToDate(date, index)}`;
        tempTripDay.tripPlaces = tempTripDay.tripPlaces.map((place, index) => {
          let tempTripPlace = { ...place };
          tempTripPlace.startTime = `${addDaysToDate(date, index)} 00:00:00`;
          tempTripPlace.endTime = `${addDaysToDate(date, index)} 00:00:00`;
          return tempTripPlace;
        });
        return tempTripDay;
      });
      currentTripUpdate.startTime = `${formatDate(date)} 00:00:00`;
      currentTripUpdate.endTime = `${addDaysToDate(date, currentTripUpdate.tripDays.length - 1)} 00:00:00`;
      dispatch(setCurrentTrip(currentTripUpdate));
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
          onDateChange={changeStartDate}
        />
      </Box>
      <Flex direction='column' fontSize='sm' color='gray.600' overflowY='auto' h='md' ref={refScroll}>
        {currentTrip &&
          currentTrip.tripDays.map((item: ITripDayResponseModel, index) => (
            <NavItem
              key={index}
              stt={index + 1}
              day={date}
              tripDay={item}
              setTripDateChoose={setTripDateChoose}
              tripDateChoose={tripDateChoose}
              deleteDay={deleteDay}
            />
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
