import { Avatar, Flex, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IFriendResponse, IUserFirstLoginRequest } from '../../../../models/user/user.model';

export interface ISingleChatProps {
  data: any;
  curUser: IUserFirstLoginRequest | null;
}

export default function SingleChat(props: ISingleChatProps) {
  const { data, curUser } = props;
  const [userChat, setUserChat] = useState<any>(null);
  const [roomIdQuery, setRoomIdQuery] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  const router = useRouter();

  useEffect(() => {
    const members = data.members;
    members.forEach((member: any) => {
      if (curUser?.id !== member.userId) {
        setUserChat(member);
      }
    });
  }, [curUser, data]);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setRoomIdQuery(id as string);
    } else {
      setRoomIdQuery(null);
    }
  }, [router.query]);

  const onOpenChat = () => {
    router.push({ pathname: `/chats/${data.id}`, query: { curUser: curUser?.id } }, `/chats/${data.id}`);
  };

  return (
    <Flex
      bg={colorMode === 'light' ? (data.id.toString() === roomIdQuery ? 'gray.300' : 'gray.100') : 'gray.800'}
      align='center'
      p='2'
      cursor='pointer'
      _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
      onClick={onOpenChat}
      my='3'
      rounded='md'
    >
      <Avatar
        size='sm'
        mr='4'
        name={userChat?.fullName}
        src={userChat?.avatar}
        bg={colorMode === 'light' ? 'teal.600' : 'teal.500'}
      />
      <Text>{userChat?.fullName}</Text>
    </Flex>
  );
}
