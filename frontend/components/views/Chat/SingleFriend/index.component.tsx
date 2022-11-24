import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  useDisclosure,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IFriendResponse, IUserFirstLoginRequest } from '../../../../models/user/user.model';
import { AddIcon } from '@chakra-ui/icons';
import chatService from '../../../../services/chat/chat.service';
import { useRef, useState } from 'react';
import { formatTimePost } from '../../../../utils';
import { useQueryClient } from '@tanstack/react-query';

export interface ISingleFriendProps {
  data: IFriendResponse;
  curUser: IUserFirstLoginRequest | null;
}

export default function SingleFriend(props: ISingleFriendProps) {
  const { data, curUser } = props;
  const [alertConfirm, setAlertConfirm] = useState<boolean>(false);
  const cancelRef = useRef<any>(null);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const queryClient = useQueryClient();

  const goToChat = async () => {
    const response = await chatService.isInRoom(data.userId);
    const isInRoom = response.data.isInChatRoom;
    if (isInRoom) {
      const idRoom = response.data.roomId;
      router.push({ pathname: `/chats/${idRoom}`, query: { curUser: curUser?.id } }, `/chats/${idRoom}`);
    } else {
      setAlertConfirm(true);
    }
  };

  const createNewRoom = async () => {
    const response = await chatService.createRooms({
      friends: [data.userId],
      time: formatTimePost(new Date()),
    });
    setAlertConfirm(false);
    queryClient.invalidateQueries(['chats']);
    const idRoom = response.data.id;
    router.push({ pathname: `/chats/${idRoom}`, query: { curUser: curUser?.id } }, `/chats/${idRoom}`);
  };

  return (
    <>
      <AlertDialog isCentered isOpen={alertConfirm} leastDestructiveRef={cancelRef} onClose={() => setAlertConfirm(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Create new room chat
            </AlertDialogHeader>

            <AlertDialogBody>
              You have never texted with this person before, do you want to create a new chat room?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAlertConfirm(false)}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={createNewRoom} ml={3}>
                Start chat
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex
        bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
        align='center'
        p='2'
        _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
        my='3'
        rounded='md'
        justify='space-between'
      >
        <Flex align='center'>
          <Avatar size='sm' mr='4' name={data.fullName} src={data.avatar} bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />
          <Text>{data.fullName}</Text>
        </Flex>
        <Button mr='2' size='xs' bg='gray.600' _hover={{ bg: 'gray.500' }}>
          <AddIcon w={3} h={3} cursor='pointer' onClick={goToChat} />
        </Button>
      </Flex>
    </>
  );
}
