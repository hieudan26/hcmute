import { Box, Button, Center, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ChatBox from '../../components/views/Chat/ChatBox/index.component';
import ChatMessages from '../../components/views/Chat/ChatMessages/index.component';
import SingleChatHeader from '../../components/views/Chat/SingleChatHeader/index.component';
import { useMessages, useRoom } from '../../hooks/queries/chat';
import chatService from '../../services/chat/chat.service';
import { useAppSelector } from '../../hooks/redux';

export interface IChatsProps {}

const Chats: NextPage<IChatsProps> = (props) => {
  const { t } = useTranslation('chat');
  const bgCantChat = useColorModeValue('gray.200', 'gray.700');
  const textCantChat = useColorModeValue('black', 'white');
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [enableGetRoom, setEnableGetRoom] = useState<boolean>(false);
  const [curUserId, setCurUserId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('none');
  const [friend, setFriend] = useState<any>(undefined);
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth.value);
  const ref = useRef<HTMLDivElement>(null);
  const detailInforRoom = useRoom(roomId as string, enableGetRoom);
  const dataMessages = useMessages(
    { pagination: { pageNumber: 0, pageSize: 20, sortBy: 'time', sortType: 'DESC' }, roomId: roomId ? roomId : '1' },
    roomId !== undefined
  );

  useEffect(() => {
    let room = detailInforRoom.data?.data;
    if (room && auth) {
      if (room.type === 'SINGLE') {
        const filtered = room.members.filter((item: any) => {
          return item.userId !== auth.id;
        })[0];
        setFriend(filtered);
      }
    }
  }, [detailInforRoom.data, auth]);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setRoomId(id as string);
      setEnableGetRoom(true);
    }
  }, [router.query]);

  useEffect(() => {
    const { curUser } = router.query;
    if (curUser) {
      setCurUserId(curUser as string);
    } else {
      setCurUserId(auth?.id);
    }
  }, [auth?.id, router.query]);

  useEffect(() => {
    if (detailInforRoom.data?.data.type === 'SINGLE') {
      const fetchStatus = async () => {
        const response = await chatService.getStatusRoom(detailInforRoom.data?.data.id);
        setStatus(response.data.status);
      };
      fetchStatus();
    }
  }, [detailInforRoom.data]);

  const loadMoreMessage = () => {
    if (dataMessages.hasNextPage) {
      dataMessages.fetchNextPage();
      ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const lockRoom = async () => {
    if (detailInforRoom.data?.data) {
      await chatService.lockRoomSingle(detailInforRoom.data?.data.id);
      setStatus('block');
    }
  };

  const unlockRoom = async () => {
    if (detailInforRoom.data?.data) {
      await chatService.unlockRoomSingle(detailInforRoom.data?.data.id);
      setStatus('none');
    }
  };

  return (
    <Flex direction='column' grow='1' height='100vh' maxWidth='100%'>
      <SingleChatHeader lockRoom={lockRoom} status={status} room={detailInforRoom.data?.data} userId={curUserId} />
      <ChatMessages room={detailInforRoom.data?.data} loadMoreMessage={loadMoreMessage} data={dataMessages} scrollRef={ref} />
      {status === 'none' && <ChatBox scrollRef={ref} userId={curUserId} roomId={roomId} />}
      {status === 'block' && (
        <Box my='1'>
          <Divider />
          <Flex direction='column' justify='center' align='center' my='1'>
            <Text fontWeight='bold'>Bạn đã chặn {friend.fullName}</Text>
            <Text mt='0.5'>
              Bạn không thể nhắn tin hoặc gọi cho họ trong cuộc trò chuyện này và bạn sẽ không nhận được tin nhắn hoặc cuộc gọi
              của họ
            </Text>
          </Flex>
          <Flex justify='center' align='center'>
            <Button w='80%' size='sm' onClick={unlockRoom}>
              Mở chặn
            </Button>
          </Flex>
        </Box>
      )}
      {status === 'blocked' && (
        <Box my='1'>
          <Divider />
          <Flex direction='column' justify='center' align='center' my='1'>
            <Text fontWeight='bold'>Bạn đã bị {friend.fullName} chặn</Text>
            <Text mt='0.5'>
              Bạn không thể nhắn tin hoặc gọi cho họ trong cuộc trò chuyện này và bạn sẽ không nhận được tin nhắn hoặc cuộc gọi
              của họ
            </Text>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default Chats;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'chat'])),
      // Will be passed to the page component as props
    },
  };
};
