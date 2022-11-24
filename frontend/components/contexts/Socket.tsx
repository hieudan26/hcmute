import * as StompJS from '@stomp/stompjs';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import { Auth } from 'aws-amplify';
import { createContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { CookieConstants } from '../../constants/store.constant';
import cookie from 'react-cookies';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { isConnected } from '../../app/slices/socketSlice';
import { useSocketSubscribe } from '../../hooks/socket/useSocketSubcribe';
import { sendMessage } from '../../app/slices/singleChatsSlice';

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

  useEffect(() => {
    if (isLoggedIn && stompClient === null) {
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

      return () => disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, accessToken, stompClient]);

  const connect = () => {
    var stompConfig: StompConfig = {
      // brokerURL: 'wss://api.hcmute.me/v1/ws',
      webSocketFactory: () => {
        return new SockJS('https://api.hcmute.me/v1/ws');
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log('SocketIO: Connected and authenticated');
        dispatch(isConnected(true));
        // handle subcribe
        stompClient.subscribe(`/topic/${auth?.id}`, onMessageReceived);
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
    dispatch(sendMessage(JSON.parse(body)));
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
