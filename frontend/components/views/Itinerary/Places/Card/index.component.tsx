import { AddIcon, StarIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Icon, IconButton, Image, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { BsCalendarDayFill, BsFillPinMapFill } from 'react-icons/bs';
import { RiFlagFill } from 'react-icons/ri';
import { IPlaceCountryResponse } from '../../../../../models/place/place.model';
import { ITripPlaceResponseModel } from '../../../../../models/trip/trip.model';

export interface IPlaceCardProps {
  place: IPlaceCountryResponse;
  selectPlace: (item: IPlaceCountryResponse) => void;
}

export default function PlaceCard(props: IPlaceCardProps) {
  const { place, selectPlace } = props;
  let boxBg = useColorModeValue('white', 'backgroundBox.primary_darkMode');
  let mainText = useColorModeValue('gray.800', 'white');
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <Flex
      shadow='md'
      rounded='md'
      bg={boxBg}
      h='190px'
      w='220px'
      direction='column'
      position='relative'
      onMouseMove={() => {
        setIsHover(true);
      }}
      onMouseOut={() => {
        setIsHover(false);
      }}
      onClick={() => {
        selectPlace(place);
      }}
    >
      {/* 'https://owa.bestprice.vn/images/destinations/uploads/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg' */}
      <Image
        filter={isHover ? 'brightness(0.4) grayscale(1)' : undefined}
        transition='transform .5s'
        transform='auto-gpu'
        fit='cover'
        objectPosition='center'
        roundedTop='md'
        cursor='pointer'
        w='full'
        alt='test'
        src={place.image}
        minH='36'
        maxH='36'
      />
      <Flex mx='3' mt='3' align='center' justify='space-between'>
        <Text fontWeight='semibold' color={mainText} fontSize='md' noOfLines={1}>
          {place.name}
        </Text>
        <Icon as={RiFlagFill} color='yellow.300' />
      </Flex>
      {isHover && (
        <Box position='absolute' top='40%' left='50%' transform='translate(-50%, -50%)'>
          <Tooltip label='Thêm địa điểm'>
            <IconButton aria-label='Thêm địa điểm vào hành trình' icon={<AddIcon />} size='sm' />
          </Tooltip>
        </Box>
      )}
    </Flex>
  );
}
