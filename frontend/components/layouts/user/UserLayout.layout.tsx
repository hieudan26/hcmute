import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { RoleConstants } from '../../../constants/roles.constant';
import Footer from '../../views/Footer/index.component';
import FirstLoginModal from '../../views/Modals/FirstLoginModal/index.component';
import Navbar from '../../views/Navbar/index.component';
import Header from '../../views/Profile/Header/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';

export interface IUserLayoutProps {
  children: any;
  is_first_login: string;
}

export default function UserLayout(props: IUserLayoutProps) {
  const { children, is_first_login } = props;
  const isOpen = is_first_login === 'true' ? true : false;
  const router = useRouter();
  const bgMain = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const colorMain = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <>
      <Navbar role={RoleConstants.USER} />
      <Box bg={bgMain} color={colorMain}>
        {router.pathname === '/profile' && <Header pt='90px' />}
        <Container minH='67.8vh' maxW='7xl' centerContent pt='90px' pb='20px'>
          <FirstLoginModal isOpen={isOpen} />
          {children}
        </Container>
      </Box>
      <ScrollToTop />
      <Footer />
    </>
  );
}
