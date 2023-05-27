import { ArrowBackIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Heading, IconButton, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IMessagesResponse } from '../../../../models/chat/chat.model';
import { useTranslation } from 'next-i18next';

export interface ISingleChatHeaderProps {
  room: any;
  userId: string | undefined;
}

export default function SingleChatHeader(props: ISingleChatHeaderProps) {
  const { t } = useTranslation('chat');
  const { room, userId } = props;
  const [friend, setFriend] = useState<any>(undefined);
  const [type, setType] = useState<string>('SINGLE');
  const { colorMode } = useColorMode();
  const router = useRouter();

  useEffect(() => {
    if (room) {
      if (room.type === 'SINGLE') {
        setType('SINGLE');
        const filtered = room.members.filter((item: any) => {
          return item.userId !== userId;
        })[0];
        setFriend(filtered);
      } else {
        setType('GROUP');
      }
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
      {type === 'SINGLE' &&
        (friend ? (
          <Avatar
            onClick={() => {
              router.push(`/profile/${friend.userId}/about`);
            }}
            title='Go to profile'
            cursor='pointer'
            mr={4}
            src={friend.avatar}
            bg={colorMode === 'light' ? 'teal.600' : 'teal.500'}
          />
        ) : (
          <Avatar mr={4} name={friend ? friend.fullName : 'Loading'} bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />
        ))}

      {type === 'GROUP' && <Avatar mr={4} name={room.name} bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />}
      <Box maxWidth='70%'>
        <Heading size='md' noOfLines={1}>
          {type === 'SINGLE' ? friend && friend.fullName : room.name}
        </Heading>
        <Text>{t('singlechat.activeStatus')} 2h</Text>
      </Box>
    </Flex>
  );
}
