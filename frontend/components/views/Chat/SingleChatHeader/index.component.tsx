import { ArrowBackIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Heading, IconButton, Text, useColorMode, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IMessagesResponse } from '../../../../models/chat/chat.model';
import { useTranslation } from 'next-i18next';
import EditGroupChatDrawer from '../Modals/EditGroupChatDrawer/index.component';

export interface ISingleChatHeaderProps {
  room: any;
  userId: string | undefined;
  status: string;
  lockRoom: () => Promise<void>;
}

export default function SingleChatHeader(props: ISingleChatHeaderProps) {
  const { t } = useTranslation('chat');
  const { isOpen: isOpenEditGroupChat, onOpen: onOpenEditGroupChat, onClose: onCloseEditGroupChat } = useDisclosure();
  const { room, userId, status, lockRoom } = props;
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
    <>
      <EditGroupChatDrawer room={room} isOpen={isOpenEditGroupChat} onOpen={onOpenEditGroupChat} onClose={onCloseEditGroupChat} />
      <Flex
        align='center'
        width='100%'
        minH='71px'
        p='10px'
        overflow='hidden'
        borderBottom='1px solid'
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        maxWidth='100%'
        justify='space-between'
      >
        <Flex align='center'>
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
        {type === 'GROUP' ? (
          <Box mr='4'>
            <HamburgerIcon _hover={{ color: '#D0637C' }} cursor='pointer' onClick={onOpenEditGroupChat} />
          </Box>
        ) : (
          <Box mr='4' hidden={status !== 'none'}>
            <Button size='sm' onClick={lockRoom}>
              Chặn người dùng
            </Button>
          </Box>
        )}
      </Flex>
    </>
  );
}
