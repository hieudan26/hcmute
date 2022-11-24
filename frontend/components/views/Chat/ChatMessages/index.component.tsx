import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { IMessage, IMessagesResponse } from '../../../../models/chat/chat.model';
import { IPaginationRequest } from '../../../../models/common/ResponseMessage.model';
import ScrollToTop from '../../ScrollToTop/index.component';
import Message from '../Message/index.component';

export interface IChatMessagesProps {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  data: IMessagesResponse;
  loadMoreMessage: () => void;
}

export default function ChatMessages(props: IChatMessagesProps) {
  const { scrollRef, data, loadMoreMessage } = props;
  const [dataMessages, setDataMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setDataMessages([...data.content].reverse());
  }, [data]);

  return (
    <>
      {data && data.content.length === 0 && <Center>No conversation</Center>}
      <Center p='10px' hidden={!data.pageable.hasNext}>
        <Button bg='transparent' variant='link' onClick={loadMoreMessage}>
          Load history chats
        </Button>
      </Center>
      <Flex ref={scrollRef} grow='1' align='start' direction='column' overflowY='scroll' p='10px'>
        {dataMessages.map((item: IMessage, index) => (
          <Message message={item.content} userId={item.sender} key={index} />
        ))}
      </Flex>
      {/* <Flex id='test' grow='1' align='start' direction='column' overflow='auto'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMoreMessage}
          isReverse={true}
          hasMore={data.pageable.hasNext}
          loader={<h4>Loading...</h4>}
          target='test'
          height='100vh'
        >
          <Flex ref={scrollRef} grow='1' align='start' direction='column' overflowY='scroll' p='10px'>
            {dataMessages.map((item: IMessage, index) => (
              <Message message={item.content} userId={item.sender} key={index} />
            ))}
          </Flex>
        </InfiniteScroll>
      </Flex> */}
    </>
  );
}
