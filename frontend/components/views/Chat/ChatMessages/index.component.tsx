import { Box, Button, Center, Divider, Flex, Text } from '@chakra-ui/react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { RefObject, useEffect, useRef, useState } from 'react';
import { AxiosResponseStatus } from '../../../../constants/global.constant';
import { IMessage } from '../../../../models/chat/chat.model';
import Message from '../Message/index.component';

export interface IChatMessagesProps {
  scrollRef: RefObject<HTMLDivElement>;
  loadMoreMessage: () => void;
  data: UseInfiniteQueryResult<AxiosResponseStatus<any, any>, unknown>;
  room: any;
}

export default function ChatMessages(props: IChatMessagesProps) {
  const { scrollRef, data, loadMoreMessage, room } = props;
  const [dataMessages, setDataMessages] = useState<IMessage[]>([]);
  const previousTimeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const newDataMessages: IMessage[] = [];
    data?.data?.pages.map((page) => page.data.content.map((item: IMessage, index: number) => newDataMessages.push(item)));
    setDataMessages(newDataMessages.reverse());
  }, [data]);

  function compareDates(input1: string, input2: string): boolean {
    const date1 = input1.split(' ')[0];
    const [d1, m1, y1] = date1.split('/');
    const date2 = input2.split(' ')[0];
    const [d2, m2, y2] = date2.split('/');
    const parsedDate1 = new Date(Number(y1), Number(m1) - 1, Number(d1));
    const parsedDate2 = new Date(Number(y2), Number(m2) - 1, Number(d2));

    const day1 = parsedDate1.getDate();
    const month1 = parsedDate1.getMonth();
    const year1 = parsedDate1.getFullYear();

    const day2 = parsedDate2.getDate();
    const month2 = parsedDate2.getMonth();
    const year2 = parsedDate2.getFullYear();

    if (day1 === day2 && month1 === month2 && year1 === year2) {
      return true;
    }

    return false;
  }

  function compareDates_Time(input1: string, input2: string): boolean {
    const date1 = input1.split(' ')[0];
    const time1 = input1.split(' ')[1];
    const [d1, m1, y1] = date1.split('/');
    const [h1, mn1, s1] = time1.split(':');
    const date2 = input2.split(' ')[0];
    const time2 = input2.split(' ')[1];
    const [d2, m2, y2] = date2.split('/');
    const [h2, mn2, s2] = time2.split(':');
    const parsedDate1 = new Date(Number(y1), Number(m1) - 1, Number(d1), Number(h1), Number(mn1));
    const parsedDate2 = new Date(Number(y2), Number(m2) - 1, Number(d2), Number(h2), Number(mn2));

    const day1 = parsedDate1.getDate();
    const month1 = parsedDate1.getMonth();
    const year1 = parsedDate1.getFullYear();
    const hour1 = parsedDate1.getHours();
    const minute1 = parsedDate1.getMinutes();

    const day2 = parsedDate2.getDate();
    const month2 = parsedDate2.getMonth();
    const year2 = parsedDate2.getFullYear();
    const hour2 = parsedDate2.getHours();
    const minute2 = parsedDate2.getMinutes();

    if (year1 === year2 && month1 === month2 && day1 === day2 && hour1 === hour2 && minute1 === minute2) {
      return true;
    } else {
      return false;
    }
  }

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
        {dataMessages.map((item: IMessage, index) => {
          if (previousTimeRef.current !== undefined && !compareDates(item.time, previousTimeRef.current)) {
            previousTimeRef.current = item.time;
            return (
              <>
                <Flex justify='center' align='center' gap='6' w='full' my='4'>
                  <Divider my={2} hidden={index === 0} />
                  <Text fontSize='x-small'>{item.time.split(' ')[0]}</Text>
                  <Divider my={2} hidden={index === 0} />
                </Flex>
                <Message type={room && room.type} data={item} message={item.content} userId={item.sender} />
              </>
            );
          } else {
            if (index === 0) {
              previousTimeRef.current = item.time;
            }
            return <Message type={room && room.type} data={item} message={item.content} userId={item.sender} key={index} />;
          }
        })}
      </Flex>
    </>
  );
}
