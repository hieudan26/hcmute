/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, useMediaQuery } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../../hooks/redux';
import ContainerChat from '../../views/Chat/ContainerChat/index.component';
import Sidebar from '../../views/Chat/Sidebar/index.component';
import cookie from 'react-cookies';
import { CookieConstants } from '../../../constants/store.constant';
import { useEffect, useState } from 'react';

export interface IChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout(props: IChatLayoutProps) {
  const { children } = props;
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const auth = useAppSelector((state) => state.auth.value);
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const { id } = router.query; //chatId
    if (id) {
      setIsInRoom(true);
    } else {
      setIsInRoom(false);
    }
  }, [router.query, children]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/404');
    }
  }, [isLoggedIn]);

  const renderSidebar = () => {
    if (isMobile) {
      if (isInRoom) {
        return <></>;
      } else {
        return <Sidebar user={auth} fullWidth />;
      }
    } else {
      return <Sidebar user={auth} />;
    }
  };

  return (
    <ContainerChat>
      {renderSidebar()}
      {children}
    </ContainerChat>
  );
}
