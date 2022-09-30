import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { RoleConstants } from '../../../constants/roles.constant';
import Footer from '../../views/Footer/index.component';
import Navbar from '../../views/Navbar/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';

export default function AnonymousLayout({ children }: any) {
  const bgMain = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const colorMain = useColorModeValue('textColor.primary_lightMode', 'textColor.primary_darkMode');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <>
      <Navbar role={RoleConstants.ANONYMOUS} />
      <Box bg={bgMain} color={colorMain}>
        <Container minH='67.8vh' maxW='7xl' centerContent pt='90px' pb='20px'>
          {children}
        </Container>
      </Box>
      <ScrollToTop />
      <Footer />
    </>
  );
}
