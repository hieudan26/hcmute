import { IPublishParams } from '@stomp/stompjs';
import { useContext } from 'react';
import { SocketContext } from '../../components/contexts/Socket';

export const useSocketAction = () => {
  // Get the socket instance
  const { stompClient } = useContext(SocketContext);

  const eventPublish = (params: IPublishParams) => {
    console.log('SocketIO: publish');
    stompClient?.publish(params);
  };

  const eventSend = (destination: string, headers?: { [key: string]: any } | undefined, body?: string | undefined) => {
    console.log('SocketIO: send');
    console.log(stompClient);
    if (stompClient) {
      stompClient.publish({
        destination: destination,
        headers: headers,
        body: body,
      });
    }
  };

  return { eventPublish, eventSend };
};
