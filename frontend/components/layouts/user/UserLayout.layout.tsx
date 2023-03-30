import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { setUserNotAuth } from '../../../app/slices/userNotAuthSlice';
import { RoleConstants } from '../../../constants/roles.constant';
import { useAppDispatch } from '../../../hooks/redux';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import userService from '../../../services/user/user.service';
import HeroContribute from '../../views/Contribute/Hero/index.component';
import HeroDiscovery from '../../views/Discovery/Hero/index.component';
import Footer from '../../views/Footer/index.component';
import FirstLoginModal from '../../views/Modals/FirstLoginModal/index.component';
import Navbar from '../../views/Navbar/index.component';
import Header from '../../views/Profile/Header/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';
import Sidebar from '../../views/Settings/Sidebar/index.component';

export interface IUserLayoutProps {
  children: any;
  is_first_login: string;
  curUser: IUserFirstLoginRequest | null;
}

export default function UserLayout(props: IUserLayoutProps) {
  const { children, is_first_login, curUser } = props;
  const [isSettingRoute, setIsSettingRoute] = useState<boolean>(false);
  const [userIdState, setUserIdState] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<IUserFirstLoginRequest | null>(null);
  const isOpen = is_first_login === 'true' ? true : false;
  const router = useRouter();
  const bgMain = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const colorMain = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  const [isProfilePage, setIsProfilePage] = useState<boolean>(false);
  const [isDiscoveryPage, setIsDiscoveryPage] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (router.pathname.includes('/discovery')) {
      setIsDiscoveryPage(true);
    } else {
      setIsDiscoveryPage(false);
    }

    if (router.pathname.includes('/profile')) {
      setIsProfilePage(true);
    } else {
      setIsProfilePage(false);
    }
  }, [children, router.pathname]);

  useEffect(() => {
    if (router.pathname.includes('/settings')) {
      setIsSettingRoute(true);
    } else {
      setIsSettingRoute(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingRoute, children]);

  useEffect(() => {
    if (!isProfilePage && !isDiscoveryPage) {
      window.scrollTo(0, 0);
    }
  }, [children, isProfilePage, isDiscoveryPage]);

  useEffect(() => {
    if (router.pathname.includes('/profile')) {
      const { userId } = router.query;
      setUserIdState(userId as string);

      if (userIdState && userIdState !== user?.id) {
        if (userIdState !== curUser?.id) {
          const getUser = async () => {
            const response = await userService.getUserInformationById(userIdState); //res.data
            if (response.isSuccess === true) {
              dispatch(setUserNotAuth(response.data));
              setUser(response.data);
            } else {
              router.push('/404');
            }
          };
          getUser();
        } else {
          setUser(curUser);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, userIdState, router.query]);

  const renderContainerLayout = () => {
    if (isSettingRoute) {
      return <Sidebar>{children}</Sidebar>;
    } else {
      return (
        <Container minH='67.8vh' maxW='6xl' centerContent pt={isProfilePage ? '4' : '90px'} pb='20px'>
          <FirstLoginModal isOpen={isOpen} />
          {children}
        </Container>
      );
    }
  };

  return (
    <Box>
      <Navbar role={curUser ? curUser.role : RoleConstants.USER} />
      <Box bg={bgMain} color={colorMain}>
        {router.pathname.includes('/profile') && <Header user={userIdState !== curUser?.id ? user : curUser} pt='90px' />}
        {router.pathname === '/discovery' && <HeroDiscovery />}
        {(router.pathname === '/contribute' || router.pathname.includes('list-of-previous-contributions')) && <HeroContribute />}
        {renderContainerLayout()}
      </Box>
      <ScrollToTop />
      <Footer />
    </Box>
  );
}
