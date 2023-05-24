import { Box, Button, Circle, Flex, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { ITripPlaceResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import { addAMPM, distanceTime, formatCurrencyVND, formatNumberToTwoDigits } from '../../../../utils';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter } from '@chakra-ui/card';
import { StarIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

export interface IMainContentDetailProps {
  tripData: undefined | any;
}

export default function MainContentDetail(props: IMainContentDetailProps) {
  const { tripData } = props;
  const router = useRouter();
  const [idDaySelected, setIdDaySelected] = useState<number>(0);
  const [tripPlacesSelected, setTripPlacesSelected] = useState<ITripPlaceResponseModel[]>([]);
  const [trip, setTrip] = useState<undefined | ITripsResponseModel>(undefined);

  useEffect(() => {
    tripData && setTrip(tripData.data);
  }, [tripData]);

  useEffect(() => {
    if (trip && trip.tripDays.length && idDaySelected !== 0) {
      trip.tripDays.map((day) => {
        if (day.id === idDaySelected) {
          setTripPlacesSelected(day.tripPlaces);
        }
      });
    }
  }, [idDaySelected, trip]);

  useEffect(() => {
    if (trip && trip.tripDays.length) {
      setIdDaySelected(trip.tripDays[0].id);
    }
  }, [trip]);

  return (
    <Flex px='28' align='flex-start' gap={16} w='full' mb='10'>
      <Box position='sticky' top={36} left={0} zIndex={4}>
        <VStack spacing={2} align='flex-start' bg='gray.200' p={4}>
          {trip &&
            trip.tripDays.map((day, index) => (
              <Button
                color={idDaySelected === day.id ? '#D0637C' : undefined}
                key={day.id}
                variant='link'
                py='2'
                px='2'
                _hover={{ color: '#D0637C' }}
                onClick={() => {
                  setIdDaySelected(day.id);
                }}
              >
                Ngày {formatNumberToTwoDigits(index + 1)}: {day.date}
              </Button>
            ))}
        </VStack>
      </Box>
      <Flex direction='column' gap='10' mx='4'>
        {tripPlacesSelected.map((place, index) => (
          <Card
            key={place.id}
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='elevated'
            gap='5'
            align='center'
            fontSize='sm'
          >
            <Image
              title={place.place.name}
              cursor='pointer'
              _hover={{
                filter: 'brightness(70%)',
                transition: 'filter 0.2s ease-in-out',
              }}
              objectFit='cover'
              maxW='240px'
              src={place.place.image}
              alt='Caffe Latte'
            />

            <Stack>
              <CardBody>
                <Flex align='center' gap='5'>
                  <Circle size='30px' bg='#D0637C' color='white'>
                    {index + 1}
                  </Circle>
                  <Heading size='md'>{place.place.name}</Heading>
                </Flex>

                <Box my='2'>
                  {Array(5)
                    .fill('')
                    .map((_, i) => (
                      <StarIcon key={i} color={i < 5 ? 'yellow.400' : 'gray.300'} />
                    ))}
                </Box>

                <Text noOfLines={2}>{place.place.description}</Text>
              </CardBody>

              <CardFooter>
                <Box>
                  <Text>
                    <span className='font-bold'>Thời gian tham quan: </span> {addAMPM(place.startTime.split(' ')[1])} -{' '}
                    {addAMPM(place.endTime.split(' ')[1])}
                  </Text>
                  <Flex gap='4'>
                    <Text>
                      <span className='font-bold'>Phương tiện di chuyển: </span> {place.transport}
                    </Text>
                    <Text>
                      <span className='font-bold'>Chi phí dự kiến: </span> {formatCurrencyVND(place.travelPrice)}
                    </Text>
                  </Flex>
                </Box>
              </CardFooter>
            </Stack>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
}
