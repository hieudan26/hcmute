import { Avatar, Box, Divider, Flex, Icon, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { BsCalendarDayFill, BsFillPinMapFill } from 'react-icons/bs';
import { ITripsResponseModel } from '../../../../models/trip/trip.model';
import { useEffect, useState } from 'react';
import placeService from '../../../../services/place/place.service';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import userService from '../../../../services/user/user.service';

export interface ICardProps {
  data: ITripsResponseModel;
}

export default function Card(props: ICardProps) {
  const { data } = props;
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
    let id: number[] = [];
    let flag = false;
    for (let i = 0; i < data.tripDays.length; i++) {
      for (let j = 0; j < data.tripDays[i].tripPlaces.length; j++) {
        id.push(data.tripDays[i].tripPlaces[j].placeId);
        if (id.length === 3) {
          flag = true;
          break;
        }
      }
      if (flag === true) {
        break;
      }
    }

    const fnFetchPlace = async () => {
      let valuePlace;
      for (let i = 0; i < id.length; i++) {
        const resp = await placeService.getPlaceById(id[i].toString());
        if (i === 0) {
          valuePlace = resp;
        }
        let temp = `- D${i++}: ${resp.data.name}`;
        shortIti.push(temp);
      }
      if (id.length < 3) {
        for (let i = 0; i < 3 - id.length; i++) {
          shortIti.push('. . .');
        }
      }
      if (valuePlace && valuePlace.data.image) {
        setBg(valuePlace.data.image);
      }
      setShortItinerary(shortIti);
    };

    fnFetchPlace();
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
