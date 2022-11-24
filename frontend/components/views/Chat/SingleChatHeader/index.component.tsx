import { ArrowBackIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Heading, IconButton, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IMessagesResponse } from '../../../../models/chat/chat.model';

export interface ISingleChatHeaderProps {
  room: any;
  userId: string | undefined;
}

export default function SingleChatHeader(props: ISingleChatHeaderProps) {
  const { room, userId } = props;
  const [friend, setFriend] = useState<any>(undefined);
  const { colorMode } = useColorMode();
  const router = useRouter();

  useEffect(() => {
    if (room) {
      const filtered = room.members.filter((item: any) => {
        return item.userId !== userId;
      })[0];
      setFriend(filtered);
    }
  }, [room, userId]);

  return (
    <Flex
      align='center'
      width='100%'
      minH='71px'
      p='10px'
      overflow='hidden'
      borderBottom='1px solid'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      maxWidth='100%'
    >
      <IconButton
        aria-label='Go Back'
        icon={<ArrowBackIcon />}
        mr='10px'
        size='md'
        onClick={() => router.push('/chats')}
        isRound
      />
      {friend ? (
        <Avatar mr={4} src={friend.avatar} bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />
      ) : (
        <Avatar mr={4} name={friend ? friend.fullName : 'Loading'} bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />
      )}
      <Box maxWidth='70%'>
        <Heading size='md' noOfLines={1}>
          {friend && friend.fullName}
        </Heading>
        <Text>Last Active: 2h</Text>
      </Box>
    </Flex>
  );
}
