import * as StompJS from '@stomp/stompjs';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from 'aws-amplify';
import { createContext, useEffect, useState } from 'react';
import cookie from 'react-cookies';
import SockJS from 'sockjs-client';
import { isReceivedNewMessage } from '../../app/slices/receivedMessSlice';
import { isConnected } from '../../app/slices/socketSlice';
import { RoleConstants } from '../../constants/roles.constant';
import { CookieConstants } from '../../constants/store.constant';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ISocketResponse } from '../../models/socket.model';

// export const SocketContext = createContext<{ stompClient: StompJS.CompatClient | null }>({ stompClient: null });
export const SocketContext = createContext<{ stompClient: StompJS.Client | null }>({ stompClient: null });

export interface ISocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<ISocketProviderProps> = (props) => {
  const { children } = props;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const auth = useAppSelector((state) => state.auth.value);
  const [stompClient, setStompClient] = useState<null | StompJS.Client>(null);
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    // console.log(isLoggedIn, stompClient?.connected);
    if (isLoggedIn && (stompClient === null || (stompClient && !stompClient.connected))) {
      let idToken = null;
      const getIdToken = async () => {
        try {
          const currentSession = await Auth.currentSession();
          idToken = currentSession.getIdToken().getJwtToken();
          setAccessToken(idToken);
        } catch (err: any) {
          console.error('Something wrong...', err);
        }
      };
      getIdToken();
      if (accessToken && accessToken !== idToken) {
        connect();
      }
    }

    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, accessToken, stompClient]);

  const connect = () => {
    var stompConfig: StompConfig = {
      // brokerURL: 'wss://api.hcmute.me/v1/ws',
      webSocketFactory: () => {
        return new SockJS('https://api.hcmute.me/v1/ws');
        // return new SockJS('https://b5e3-2405-4802-9192-9010-cd4b-9224-4667-4461.ngrok-free.app/v1/ws');
        // return new SockJS('http://localhost:8080/v1/ws');
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log('SocketIO: Connected and authenticated');
        dispatch(isConnected(true));
        // handle subcribe
        if (auth?.role === RoleConstants.USER) {
          stompClient.subscribe(`/topic/${auth?.id}`, onMessageReceived);
        } else {
          stompClient.subscribe(`/topic/admin`, onMessageReceived);
        }
        //
        setStompClient(stompClient);
      },
      debug: function (str: any) {
        console.log(str);
      },
      reconnectDelay: 200,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onStompError: (frame: any) => {
        console.error(frame);
      },
    };
    const stompClient = new Client(stompConfig);
    stompClient.activate();
  };

  const onMessageReceived = (message: IMessage) => {
    const { body } = message;
    const response: ISocketResponse = JSON.parse(body);
    if (auth?.role === RoleConstants.USER) {
      if (response.type === 'MESSAGE') {
        // dispatch(sendMessage(response.content));
        dispatch(isReceivedNewMessage());
        queryClient.invalidateQueries(['messages']);
      } else {
        //notification
        queryClient.invalidateQueries(['count_notifications']);
        queryClient.invalidateQueries(['notifications']);
      }
    } else {
      queryClient.invalidateQueries(['count_notifications']);
      queryClient.invalidateQueries(['notifications']);
    }
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.deactivate();
      dispatch(isConnected(false));
    }
  };

  return <SocketContext.Provider value={{ stompClient: stompClient }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
