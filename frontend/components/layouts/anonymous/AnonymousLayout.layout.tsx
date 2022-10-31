import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RoleConstants } from '../../../constants/roles.constant';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import userService from '../../../services/user/user.service';
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

  useEffect(() => {
    if (!router.pathname.includes('/profile')) {
      window.scrollTo(0, 0);
    }
  }, [children, router.pathname]);

  useEffect(() => {
    if (router.pathname.includes('/profile')) {
      const { userId } = router.query;
      setUserIdState(userId as string);
      if (userIdState) {
        console.log(userIdState);
        const getUser = async () => {
          const response = await userService.getUserInformationById(userIdState); //res.data
          if (response.isSuccess !== undefined) {
            setUser(response.data);
          } else {
            router.push('/404');
          }
        };
        getUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, userIdState]);

  return (
    <>
      <Navbar role={RoleConstants.ANONYMOUS} />
      <Box bg={bgMain} color={colorMain}>
        {router.pathname.includes('/profile') && <Header user={user} pt='90px' />}
        <Container minH='67.8vh' maxW='7xl' centerContent pt='90px' pb='20px'>
          {children}
        </Container>
      </Box>
      <ScrollToTop />
      <Footer />
    </>
  );
}
