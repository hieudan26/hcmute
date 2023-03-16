import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { setUserNotAuth } from '../../../app/slices/userNotAuthSlice';
import { RoleConstants } from '../../../constants/roles.constant';
import { useAppDispatch } from '../../../hooks/redux';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import userService from '../../../services/user/user.service';
import HeroDiscovery from '../../views/Discovery/Hero/index.component';
import Footer from '../../views/Footer/index.component';
import Navbar from '../../views/Navbar/index.component';
import Header from '../../views/Profile/Header/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';

export default function AnonymousLayout({ children }: any) {
  const bgMain = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const colorMain = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  const router = useRouter();
  const [userIdState, setUserIdState] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<IUserFirstLoginRequest | null>(null);
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
    if (!isProfilePage && !isDiscoveryPage) {
      window.scrollTo(0, 0);
    }
  }, [children, isProfilePage, isDiscoveryPage]);

  useEffect(() => {
    if (router.pathname.includes('/profile')) {
      const { userId } = router.query;
      setUserIdState(userId as string);
      if (userIdState && userIdState !== user?.id) {
        const getUser = async () => {
          const response = await userService.getUserInformationById(userIdState); //res.data
          if (response.isSuccess !== undefined) {
            dispatch(setUserNotAuth(response.data));
            setUser(response.data);
          } else {
            router.push('/404');
          }
        };
        getUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, userIdState, router.query]);

  return (
    <>
      <Navbar role={RoleConstants.ANONYMOUS} />
      <Box bg={bgMain} color={colorMain}>
        {router.pathname.includes('/profile') && <Header user={user} pt='90px' />}
        {router.pathname === '/discovery' && <HeroDiscovery />}
        <Container minH='67.8vh' maxW='6xl' centerContent pt={isProfilePage ? '4' : '90px'} pb='20px'>
          {children}
        </Container>
      </Box>
      <ScrollToTop />
      <Footer />
    </>
  );
}
