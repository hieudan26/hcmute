import { ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { HiOutlineMenuAlt4, HiTrash } from 'react-icons/hi';
import { IPlaceCountryResponse } from '../../../../../models/place/place.model';
import { ITripDayResponseModel } from '../../../../../models/trip/trip.model';
import { addDaysToDate } from '../../../../../utils';

export interface INavItemProps {
  stt: number;
  day: Date;
  tripDay: ITripDayResponseModel;
  setTripDateChoose: React.Dispatch<React.SetStateAction<ITripDayResponseModel>>;
  tripDateChoose: ITripDayResponseModel;
  deleteDay: (id: number) => void;
}

export default function NavItem(props: INavItemProps) {
  const { stt, day, tripDay, setTripDateChoose, tripDateChoose, deleteDay, ...rest } = props;
  const [dayFormat, setDayFormat] = useState<string>('06/05/2023');

  useEffect(() => {
    setDayFormat(addDaysToDate(day, stt - 1));
  }, [stt, day]);

  return (
    <Flex
      bg={tripDateChoose.id === tripDay.id ? 'gray.100' : 'transparent'}
      px='4'
      pl='4'
      py='3'
      color='inherit'
      _dark={{ color: 'gray.400' }}
      _hover={{
        bg: 'gray.100',
        _dark: { bg: 'gray.900' },
        color: 'gray.900',
      }}
      role='group'
      transition='.15s ease'
      direction='column'
      {...rest}
    >
      <Flex my='2' align='center' justify='space-between'>
        <Icon
          onClick={() => {
            setTripDateChoose(tripDay);
          }}
          cursor='pointer'
          borderBottom='2px'
          borderColor='transparent'
          as={HiOutlineMenuAlt4}
          fontSize='sm'
          lineHeight='10'
          _hover={{
            color: '#D0637C',
          }}
        />
        <Flex w='fit-content' gap='2'>
          <Text fontWeight='semibold' borderBottom='2px' borderColor='#D0637C'>
            Ngày {stt}
          </Text>
          <Text>-</Text>
          <Text>{dayFormat}</Text>
        </Flex>
        <Icon
          onClick={() => {
            deleteDay(tripDay.id);
          }}
          cursor='pointer'
          borderBottom='2px'
          borderColor='transparent'
          as={HiTrash}
          fontSize='sm'
          lineHeight='10'
          _hover={{
            color: '#D0637C',
          }}
        />
      </Flex>
      <Flex align='center' fontSize='small' flexWrap='wrap'>
        {tripDay.provinces.map((item: IPlaceCountryResponse, index) => (
          <React.Fragment key={index}>
            <Text>{item.name}</Text>
            {index !== tripDay.provinces.length - 1 && <ChevronRightIcon />}
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  );
}
