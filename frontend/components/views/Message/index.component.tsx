/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ResponseMessage } from '../../../models/common/ResponseMessage.model';

export interface IMessageProps {}

const handleMessageSubject = new BehaviorSubject<ResponseMessage | null>(null);

export const toggleMessage = (value: ResponseMessage) => {
  handleMessageSubject.next(value);
};

export default function Message(props: IMessageProps) {
  const toast = useToast();

  useEffect(() => {
    const subscribe = handleMessageSubject.subscribe((msg) => {
      if (msg) {
        toast({
          title: msg.type,
          description: msg.message,
          id: msg.code,
          duration: msg.type === 'error' ? 3000 : 1500,
          status: msg.type,
          variant: 'left-accent',
          isClosable: true,
          position: 'top-right',
        });
      }
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  return <></>;
}
