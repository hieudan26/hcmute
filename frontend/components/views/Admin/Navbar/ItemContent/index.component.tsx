import { Icon, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { MdUpgrade } from 'react-icons/md';
import { INotificationResponse } from '../../../../../models/notification/notification.model';
import { FcAdvertising } from 'react-icons/fc';
import { GoDash, GoPrimitiveDot } from 'react-icons/go';

export interface IItemContentProps {
  data: INotificationResponse;
}

export function ItemContent(props: IItemContentProps) {
  const { data } = props;

  const generateContent = () => {
    switch (data.type) {
      case 'place_status':
        return 'đã đóng góp một địa điểm du lịch mới cho hệ thống';
      default:
        return 'không có ý kiến';
    }
  };

  return (
    <>
      <Flex justify='center' align='center' me='2'>
        <Icon as={GoDash} fontSize='md' color='gray.600' />
      </Flex>
      <Flex flexDirection='column' mt='-1'>
        <Text mb='1' fontWeight='bold' lineHeight='5' fontSize={{ base: 'small', md: 'small' }}>
          {data.fullName}{' '}
          <Text as='span' fontWeight='normal'>
            {generateContent()}
          </Text>
        </Text>
        <Flex alignItems='center'>
          <Text fontSize={{ base: 'xs', md: 'xs' }} lineHeight='100%' color={data.status === false ? '#D0637C' : 'gray.400'}>
            {data.creationDate}
          </Text>
        </Flex>
      </Flex>
      <Icon display={data.status === true ? 'none' : 'block'} as={GoPrimitiveDot} fontSize='md' color='#D0637C' ml='2' mr='1' />
    </>
  );
}
