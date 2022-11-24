import * as StompJS from '@stomp/stompjs';
import { Stomp } from '@stomp/stompjs';
import { Auth } from 'aws-amplify';
import { createContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { CookieConstants } from '../../constants/store.constant';
import cookie from 'react-cookies';

export const SocketContext = createContext<{ stompClient: StompJS.CompatClient | null }>({ stompClient: null });

export interface ISocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<ISocketProviderProps> = (props) => {
  const { children } = props;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const stompClient = useRef<null | StompJS.CompatClient>(null);
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;

  useEffect(() => {
    if (isLoggedIn && stompClient.current === null) {
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
        const Sock = new SockJS('https://api.hcmute.me/v1/ws');
        stompClient.current = Stomp.over(Sock);
        connect();
      }
    }

    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, accessToken, stompClient]);

  const connect = () => {
    stompClient.current?.configure({
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log('SocketIO: Connected and authenticated');
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onStompError: (frame) => {
        console.error(frame);
      },
      // beforeConnect: (stompClient: any):Promise<void> => {
      //     return new Promise<void>((resolve, _) => {
      //       stompClient.connectHeaders = {
      //         Authorization: `Bearer eyJraWQiOiJ0eUtxeE9LV3VuSVwvYUJhaXY1S2lCdlwvS1ZxRVJyOEltRXJlZEtzdWczK1U9IiwiYWxnIjoiUlMyNTYifQ.eyJjdXN0b206aXNfZmlyc3RfbG9naW4iOiJmYWxzZSIsInN1YiI6Ijg2Y2U4NTcyLTNjOTItNGNjYS04OWUzLTA2MGMzNWU2MTNiZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfQkxFT1ZTd1pjIiwiY29nbml0bzp1c2VybmFtZSI6Ijg2Y2U4NTcyLTNjOTItNGNjYS04OWUzLTA2MGMzNWU2MTNiZSIsIm9yaWdpbl9qdGkiOiI0Y2VhZjMyZS0wZTVmLTQ3Y2MtYTg2Ni1iM2M3Y2EzZWJiMDciLCJhdWQiOiI2OHNnbnF0N2U4b2sxZW1kMGxsMnA4MHE0NCIsImV2ZW50X2lkIjoiMzdmYjNiNzgtYTc4NS00NWI3LWIwNDItYjM0ZmVhNGFjMjRjIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjkwMDEzNDUsImV4cCI6MTY2OTAyMTc0MywiY3VzdG9tOnJvbGUiOiJVU0VSIiwiaWF0IjoxNjY5MDE4MTQzLCJqdGkiOiIxOGQ4ZjFjNi0wYjlkLTRiYjYtYTU2OC04NDhiOWIzODI5MTgiLCJlbWFpbCI6InRoYW5nZHVjLmR1b25nMTRAZ21haWwuY29tIn0.ZnHRv-qLZGkL3ULeTJUvFqVXqg5QUyeEj0T_cTfyYCz7GHZCZabgW_OWxCSbOf9DVzu08YGuLgbS5Wf_mDJdfeJcZPtvq9yjE0wg-lbJ7XuqngRd_QPg257QQrODZ1ktavyOGgbPE_Vy5LGfsVAWLJ-xV_UltVd9c_O6GVpLCbe1gojtrhuy7pm31L--hhzQcZ8-5Jvf76MXlY0qccmgGp0zNrdRLurJZ3NtnbpLB7jSGNvEqhuGLJ9viJsm-zIO7S4XQZP0W1iDvSNAFjC4nForbuT8bDSiPhdF4fArpasA_LN-dYD8uWF-p5ZOP-j1kGvNyG5_CSrkwH4U5_0Qmw`
      //       }
      //       resolve()
      //     })
      // },
    });

    stompClient.current?.activate();
  };

  const disconnect = () => {
    if (stompClient && stompClient.current) {
      stompClient.current?.deactivate();
    }
  };

  return <SocketContext.Provider value={{ stompClient: stompClient.current }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
