/* eslint-disable react-hooks/exhaustive-deps */
import { ToastId, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ResponseMessage } from '../../../models/common/ResponseMessage.model';
import { uppercaseFirstLetter } from '../../../utils';
import { v4 as uuidv4 } from 'uuid';

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
        const id: ToastId = msg.code ? msg.code : uuidv4();
        if (!toast.isActive(id)) {
          toast({
            title: msg.title ? msg.title : uppercaseFirstLetter(msg.type),
            description: msg.message,
            id: id,
            duration: msg.type === 'error' ? 4000 : 3000,
            status: msg.type,
            variant: 'left-accent',
            isClosable: true,
            position: 'top-right',
          });
        }
      }
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  return <></>;
}
