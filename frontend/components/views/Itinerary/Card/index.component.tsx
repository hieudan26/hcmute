import { Avatar, Box, Divider, Flex, Icon, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { BsCalendarDayFill, BsFillPinMapFill } from 'react-icons/bs';
import { ITripsResponseModel } from '../../../../models/trip/trip.model';
import { useEffect, useState } from 'react';
import placeService from '../../../../services/place/place.service';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import userService from '../../../../services/user/user.service';
import { useRouter } from 'next/router';

export interface ICardProps {
  data: ITripsResponseModel;
}

export default function Card(props: ICardProps) {
  const { data } = props;
  const router = useRouter();
  const [totalDay, setTotalDay] = useState<number>(0);
  const [totalPlaces, setTotalPlaces] = useState<number>(0);
  const [shortItinerary, setShortItinerary] = useState<string[]>([]);
  const [user, setUser] = useState<IUserFirstLoginRequest | null>(null);
  const [bg, setBg] = useState<string>(
    'https://owa.bestprice.vn/images/destinations/uploads/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg'
  );
  let boxBg = useColorModeValue('white', 'backgroundBox.primary_darkMode');
  let mainText = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const FnFetchUser = async () => {
      const resp = await userService.getUserById(data.ownerId);
      setUser(resp.data);
    };
    FnFetchUser();
  }, [data]);

  useEffect(() => {
    let shortIti: string[] = [];
    let i = 0;
    if (data.tripDays.length <= 0) {
      shortIti.push('...');
      shortIti.push('...');
      shortIti.push('...');
    } else {
      if (data.tripDays[0].tripPlaces.length <= 0) {
        shortIti.push('...');
        shortIti.push('...');
        shortIti.push('...');
      } else if (data.tripDays[0].tripPlaces.length === 1) {
        shortIti.push(`- D${i++}: ${data.tripDays[0].tripPlaces[0].place.name}`);
        shortIti.push('...');
        shortIti.push('...');
      } else if (data.tripDays[0].tripPlaces.length === 2) {
        shortIti.push(`- D${i++}: ${data.tripDays[0].tripPlaces[0].place.name}`);
        shortIti.push(`- D${i++}: ${data.tripDays[0].tripPlaces[1].place.name}`);
        shortIti.push('...');
      } else {
        shortIti.push(`- D${i++}: ${data.tripDays[0].tripPlaces[0].place.name}`);
        shortIti.push(`- D${i++}: ${data.tripDays[0].tripPlaces[1].place.name}`);
        shortIti.push(`- D${i++}: ${data.tripDays[0].tripPlaces[2].place.name}`);
      }
    }

    setShortItinerary(shortIti);
  }, [data]);

  useEffect(() => {
    let countPlaces = 0;
    data.tripDays.map((item) => {
      countPlaces += item.tripPlaces.length;
    });
    setTotalDay(data.tripDays.length);
    setTotalPlaces(countPlaces);
  }, [data]);

  return (
    <Flex shadow='lg' rounded='md' bg={boxBg} h='370px' w='345px' alignItems='center' direction='column'>
      <Text fontSize='2xs' fontWeight='600' py='5px' noOfLines={1}>
        {data.status}
      </Text>
      <Divider />
      <Flex px='20px' py='6px' w='100%'>
        <Text fontWeight='600' fontSize='xl' noOfLines={1} my='auto' me='auto' color={mainText}>
          {data.title}
        </Text>
        <Flex gap='3'>
          <Flex gap='2' align='center'>
            <Icon as={BsFillPinMapFill} />
            <Text>{totalPlaces}</Text>
          </Flex>
          {' - '}
          <Flex gap='2' align='center'>
            <Icon as={BsCalendarDayFill} />
            <Text>{totalDay}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Image
        onClick={() => {
          router.push(`/itinerary/edit/${data.id}`);
        }}
        cursor='pointer'
        w='120%'
        alt='test'
        src={bg}
        mb='10px'
        maxH='44'
        _hover={{
          filter: 'brightness(70%)',
          transition: 'filter 0.2s ease-in-out',
        }}
      />
      {shortItinerary.length &&
        shortItinerary.map((item, index) => (
          <Text key={index} px='20px' color={mainText} fontSize='sm' w='100%' noOfLines={1}>
            {item}
          </Text>
        ))}
      <Flex w='100%' px='20px' py='8px' gap='4'>
        <Avatar size='sm' src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} />
        <Text my='auto' fontWeight='600' color={mainText} textAlign='center' fontSize='sm' me='auto' noOfLines={1}>
          {`${user?.firstName} ${user?.lastName}`}
        </Text>
      </Flex>
    </Flex>
  );
}
