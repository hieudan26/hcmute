import { Flex } from '@chakra-ui/react';
import { MutableRefObject } from 'react';
import Message from '../Message/index.component';

export interface IChatMessagesProps {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
}

export default function ChatMessages(props: IChatMessagesProps) {
  const { scrollRef } = props;

  return (
    <Flex grow='1' align='start' direction='column' overflowY='scroll' p='10px'>
      <Message message='nice' userId='1' />
      <Message message='nice' userId='1' />
      <Message message='nice' userId='1' />
      <Message message='nice' userId='86ce8572-3c92-4cca-89e3-060c35e613be' />
      <Message message='nice' userId='1' />
      <Message message='nice' userId='1' />
      <Message message='nice' userId='1' />
      <Message message='nice qq' userId='86ce8572-3c92-4cca-89e3-060c35e613be' />
      <Message message='nice' userId='1' />
      <Message message='nice' userId='1' />
      <Message message='nice' userId='1' />
      <div ref={scrollRef}></div>
    </Flex>
  );
}
