import { Avatar, AvatarGroup, Badge, Flex, Button, Icon, Image, Text, DarkMode, useColorModeValue, Box } from '@chakra-ui/react';
import { MdPeople } from 'react-icons/md';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { BsCalendarDayFill, BsFillPinMapFill } from 'react-icons/bs';

export interface ICardProps {}

export default function Card(props: ICardProps) {
  let boxBg = useColorModeValue('white', 'backgroundBox.primary_darkMode');
  let mainText = useColorModeValue('gray.800', 'white');

  return (
    <Flex shadow='lg' rounded='md' bg={boxBg} h='370px' w='345px' alignItems='center' direction='column'>
      <Flex px='20px' py='15px' w='100%'>
        <Text my='auto' fontWeight='600' color={mainText} fontSize='xl' me='auto' noOfLines={1}>
          Hà Giang kí sự
        </Text>
        <Flex gap='3'>
          <Flex gap='2' align='center'>
            <Icon as={BsFillPinMapFill} />
            <Text>4</Text>
          </Flex>
          {' - '}
          <Flex gap='2' align='center'>
            <Icon as={BsCalendarDayFill} />
            <Text>8</Text>
          </Flex>
        </Flex>
      </Flex>
      <Image
        cursor='pointer'
        w='120%'
        alt='test'
        src='https://owa.bestprice.vn/images/destinations/uploads/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg'
        mb='10px'
        maxH='44'
      />
      <Text px='20px' color={mainText} fontSize='sm' w='100%' noOfLines={1}>
        - D1: Bảo tàng chứng tích chiến tranh - Thảo Cầm
      </Text>
      <Text px='20px' color={mainText} fontSize='sm' w='100%' noOfLines={1}>
        - D2: Phố cổ Đồng Văn - Cột cờ Lũng Cú - Đèo Mã
      </Text>
      <Text px='20px' color={mainText} fontSize='sm' w='100%' noOfLines={1}>
        - D3: Thuỷ cung SEA (SEA Aquarium) - Trường quay
      </Text>
      <Flex w='100%' px='20px' py='8px' gap='4'>
        <Avatar size='sm' name='Dan Abrahmov' />
        <Text my='auto' fontWeight='600' color={mainText} textAlign='center' fontSize='sm' me='auto' noOfLines={1}>
          Dương Đức Thắng
        </Text>
      </Flex>
    </Flex>
  );
}
