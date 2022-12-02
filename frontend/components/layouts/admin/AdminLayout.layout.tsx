import { Center, Flex, useColorModeValue } from '@chakra-ui/react';
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { sidebarContext } from '../../../app/contexts/sidebarContext';
import { getActiveNavbar, getActiveNavbarText, getActiveRoute, isWindowAvailable } from '../../../utils/navigation';
import Footer from '../../views/Admin/Footer/index.component';
import Navbar from '../../views/Admin/Navbar/index.component';
import routes from '../../views/Admin/Routes/Routes';
import Sidebar from '../../views/Admin/Sidebar/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';

export interface IAdminLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

export default function AdminLayout(props: IAdminLayoutProps) {
  const { children, ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const bgChildren = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const { onOpen } = useDisclosure();

  return (
    <Box w='full'>
      <sidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display='none' {...rest} />
        <Box
          bg={bgChildren}
          float='right'
          minHeight='100vh'
          height='100%'
          overflow='auto'
          position='relative'
          maxHeight='100%'
          w={{ base: '100%', xl: 'calc( 100% - 305px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 305px )' }}
          transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
          transitionDuration='.2s, .2s, .35s'
          transitionProperty='top, bottom, width'
          transitionTimingFunction='linear, linear, ease'
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard PRO'}
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          <Flex justify='center' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' mt='24'>
            {children}
          </Flex>
          <Box>
            <Footer />
          </Box>
          <ScrollToTop spaceRight />
        </Box>
      </sidebarContext.Provider>
    </Box>
  );
}
