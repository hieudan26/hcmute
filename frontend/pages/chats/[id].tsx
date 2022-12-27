import { Flex } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { resetMessage, setMessages } from '../../app/slices/singleChatsSlice';
import ChatBox from '../../components/views/Chat/ChatBox/index.component';
import ChatMessages from '../../components/views/Chat/ChatMessages/index.component';
import SingleChatHeader from '../../components/views/Chat/SingleChatHeader/index.component';
import { useRoom } from '../../hooks/queries/chat';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import useChatScroll from '../../hooks/useChatScroll';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import chatService from '../../services/chat/chat.service';

export interface IChatsProps {}

const Chats: NextPage<IChatsProps> = (props) => {
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [enableGetRoom, setEnableGetRoom] = useState<boolean>(false);
  const [curUserId, setCurUserId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const dataChat = useAppSelector((state) => state.singleChats.value);
  const lastMessage = useChatScroll(dataChat.content);
  const [pageable, setPageable] = useState<IPaginationRequest>({ pageNumber: 0, pageSize: 20, sortBy: 'time', sortType: 'DESC' });
  const detailInforRoom = useRoom(roomId as string, enableGetRoom);

  useEffect(() => {
    if (roomId) {
      const fetchMessage = async () => {
        const response = await chatService.getMessages(pageable, roomId);
        dispatch(setMessages(response.data));
      };
      fetchMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageable, roomId]);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setRoomId(id as string);
      setEnableGetRoom(true);
    }

    if (roomId && id !== roomId) {
      dispatch(resetMessage());
      setPageable({ pageNumber: 0, pageSize: 20, sortBy: 'time', sortType: 'DESC' });
    }
  }, [router.query]);

  useEffect(() => {
    const { curUser } = router.query;
    if (curUser) {
      setCurUserId(curUser as string);
    }
  }, [router.query]);

  const loadMoreMessage = () => {
    if (dataChat.pageable.hasNext) {
      const newPage: IPaginationRequest = { ...pageable };
      if (newPage.pageNumber !== undefined && newPage.pageNumber >= 0) {
        newPage.pageNumber = newPage.pageNumber + 1;
        setPageable(newPage);
      }
    }
  };

  return (
    <Flex direction='column' grow='1' height='100vh' maxWidth='100%'>
      <SingleChatHeader room={detailInforRoom.data?.data} userId={curUserId} />
      <ChatMessages loadMoreMessage={loadMoreMessage} data={dataChat} scrollRef={lastMessage} />
      <ChatBox scrollRef={lastMessage} userId={curUserId} roomId={roomId} />
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
