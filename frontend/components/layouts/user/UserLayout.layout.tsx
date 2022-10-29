import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RoleConstants } from '../../../constants/roles.constant';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import Footer from '../../views/Footer/index.component';
import FirstLoginModal from '../../views/Modals/FirstLoginModal/index.component';
import Navbar from '../../views/Navbar/index.component';
import Header from '../../views/Profile/Header/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';
import Sidebar from '../../views/Settings/Sidebar/index.component';

export interface IUserLayoutProps {
  children: any;
  is_first_login: string;
  user: IUserFirstLoginRequest | null;
}

export default function UserLayout(props: IUserLayoutProps) {
  const { children, is_first_login, user } = props;
  const [isSettingRoute, setIsSettingRoute] = useState<boolean>(false);
  const isOpen = is_first_login === 'true' ? true : false;
  const router = useRouter();
  const bgMain = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const colorMain = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');

  useEffect(() => {
    if (router.pathname.includes('/settings')) {
      setIsSettingRoute(true);
    } else {
      setIsSettingRoute(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingRoute, children]);

  useEffect(() => {
    if (!router.pathname.includes('/profile')) {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const renderContainerLayout = () => {
    if (isSettingRoute) {
      return <Sidebar>{children}</Sidebar>;
    } else {
      return (
        <Container minH='67.8vh' maxW='7xl' centerContent pt='90px' pb='20px'>
          <FirstLoginModal isOpen={isOpen} />
          {children}
        </Container>
      );
    }
  };

  return (
    <>
      <Navbar role={RoleConstants.USER} />
      <Box bg={bgMain} color={colorMain}>
        {router.pathname.includes('/profile') && <Header user={user} pt='90px' />}
        {renderContainerLayout()}
      </Box>
      <ScrollToTop />
      <Footer />
    </>
  );
}
