/* eslint-disable react-hooks/exhaustive-deps */
import { Flex } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRef } from 'react';
import ChatBox from '../../components/views/Chat/ChatBox/index.component';
import ChatMessages from '../../components/views/Chat/ChatMessages/index.component';
import SingleChatHeader from '../../components/views/Chat/SingleChatHeader/index.component';

export interface IChatsProps {}

const Chats: NextPage = (props: IChatsProps) => {
  const lastMessage = useRef<null | HTMLDivElement>(null);

  return (
    <Flex direction='column' grow='1' height='100vh' maxWidth='100%'>
      <SingleChatHeader />
      <ChatMessages scrollRef={lastMessage} />
      <ChatBox scrollRef={lastMessage} />
      {/* {values && <SingleChatHeader chatData={values} user={user} />} */}
      {/* <ChatMessages scrollRef={lastMessage} chatType="chats" id={id.toString()} />
  <Chatbox scrollRef={lastMessage} id={id.toString()} chatType="chats" /> */}
    </Flex>
  );
};

export default Chats;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
