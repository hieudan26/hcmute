import { Button, Center, Flex } from '@chakra-ui/react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { RefObject, useEffect, useState } from 'react';
import { AxiosResponseStatus } from '../../../../constants/global.constant';
import { IMessage } from '../../../../models/chat/chat.model';
import Message from '../Message/index.component';

export interface IChatMessagesProps {
  scrollRef: RefObject<HTMLDivElement>;
  loadMoreMessage: () => void;
  data: UseInfiniteQueryResult<AxiosResponseStatus<any, any>, unknown>;
}

export default function ChatMessages(props: IChatMessagesProps) {
  const { scrollRef, data, loadMoreMessage } = props;
  const [dataMessages, setDataMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const newDataMessages: IMessage[] = [];
    data?.data?.pages.map((page) => page.data.content.map((item: IMessage, index: number) => newDataMessages.push(item)));
    setDataMessages(newDataMessages.reverse());
  }, [data]);

  return (
    <>
      {data && data.data?.pages.length === 0 && <Center>No conversation</Center>}
      {data.hasNextPage && (
        <Center p='10px'>
          <Button bg='transparent' variant='link' onClick={loadMoreMessage}>
            Load history chats
          </Button>
        </Center>
      )}
      <Flex ref={scrollRef} grow='1' align='start' direction='column' overflowY='scroll' p='10px'>
        {dataMessages.map((item: IMessage, index) => (
          <Message message={item.content} userId={item.sender} key={index} />
        ))}
      </Flex>
    </>
  );
}
