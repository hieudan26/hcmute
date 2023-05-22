import { Flex, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { ITripDayResponseModel } from '../../../../models/trip/trip.model';
import { formatNumberToTwoDigits } from '../../../../utils';
import { useEffect, useState } from 'react';

export interface IDayListDetailProps {
  day: ITripDayResponseModel;
  index: number;
}

export default function DayListDetail(props: IDayListDetailProps) {
  const { day, index } = props;

  return (
    <List spacing={3} minW='fit-content'>
      <Text px='2'>
        Ngày {formatNumberToTwoDigits(index)}: {day.date}
      </Text>
      {day.tripPlaces.map((place, index) => (
        <ListItem key={place.id} as={Flex} flexDirection='row' alignItems='center'>
          <Text mx='2'>{place.startTime.split(' ')[1].slice(0, 5)}</Text>
          <ListIcon as={MdCheckCircle} color='green.500' />
          {place.place.name}
        </ListItem>
      ))}
    </List>
  );
}
