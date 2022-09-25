import { Container } from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { RoleConstants } from '../../../constants/roles.constant';
import Footer from '../../views/Footer/index.component';
import Navbar from '../../views/Navbar/index.component';

export interface IUserLayoutProps {}

export default function UserLayout({ children }: any) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <>
      <Navbar role={RoleConstants.USER} />
      <main>
        <Container minH='67.8vh' maxW='7xl' centerContent pt='90px' pb='20px'></Container>
      </main>
      <Footer />
    </>
  );
}
