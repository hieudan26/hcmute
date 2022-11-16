import { Avatar, Flex, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IFriendResponse } from '../../../../models/user/user.model';

export interface ISingleChatProps {
  data: IFriendResponse;
}

export default function SingleChat(props: ISingleChatProps) {
  const { data } = props;
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Flex
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
      align='center'
      p='2'
      cursor='pointer'
      _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
      // onClick={handleClick}
      my='3'
      rounded='md'
    >
      <Avatar size='sm' mr='4' name={data.fullName} src={data.avatar} bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />
      <Text>{data.fullName}</Text>
    </Flex>
  );
}
