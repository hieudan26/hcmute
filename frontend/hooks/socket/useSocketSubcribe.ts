import { messageCallbackType, StompHeaders } from '@stomp/stompjs';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../../components/contexts/Socket';
import { useAppSelector } from '../redux';

export const useSocketSubscribe = (eventName: string, eventHandler: messageCallbackType, headers?: StompHeaders | undefined) => {
  // Get the socket instance
  const context = useContext(SocketContext);
  const { stompClient } = context;
  const isConnected = useAppSelector((state) => state.socket.value);

  // add a listener.
  useEffect(() => {
    console.log(stompClient);
    if (isConnected && stompClient) {
      console.log('SocketIO: adding listener', eventName);
      const eventSubcribed = stompClient?.subscribe(eventName, eventHandler, headers);
      console.log(stompClient);

      // Remove when it unmounts
      return () => {
        console.log('SocketIO: removing listener', eventName);
        eventSubcribed?.unsubscribe();
      };
    }
  }, [eventHandler, eventName, headers, isConnected, stompClient]);
};
