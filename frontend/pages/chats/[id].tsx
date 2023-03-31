import { Center, Flex, useColorModeValue } from '@chakra-ui/react';
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
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth.value);
  const ref = useRef<HTMLDivElement>(null);
  const detailInforRoom = useRoom(roomId as string, enableGetRoom);
  const dataMessages = useMessages(
    { pagination: { pageNumber: 0, pageSize: 20, sortBy: 'time', sortType: 'DESC' }, roomId: roomId ? roomId : '1' },
    roomId !== undefined
  );

  useEffect(() => {
    if (detailInforRoom.data) {
      const fetchStatusInRoom = async () => {
        const filtered = detailInforRoom.data.data.members.filter((item: any) => {
          return item.userId !== curUserId;
        })[0];
        const response = await chatService.isInRoom(filtered.userId);
        const isInRoom_response = response.data.isInChatRoom;
        setIsInRoom(isInRoom_response);
      };
      fetchStatusInRoom();
    }
  }, [curUserId, detailInforRoom.data]);

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

  const loadMoreMessage = () => {
    if (dataMessages.hasNextPage) {
      dataMessages.fetchNextPage();
      ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Flex direction='column' grow='1' height='100vh' maxWidth='100%'>
      <SingleChatHeader room={detailInforRoom.data?.data} userId={curUserId} />
      <ChatMessages loadMoreMessage={loadMoreMessage} data={dataMessages} scrollRef={ref} />
      {isInRoom ? (
        <ChatBox scrollRef={ref} userId={curUserId} roomId={roomId} />
      ) : (
        <Center minH='10' bg={bgCantChat} color={textCantChat}>
          {t('cant_chat')}
        </Center>
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
