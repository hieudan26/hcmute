import { useColorModeValue } from '@chakra-ui/react';
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { sidebarContext } from '../../../app/contexts/sidebarContext';
import { getActiveNavbar, getActiveNavbarText, getActiveRoute, isWindowAvailable } from '../../../utils/navigation';
import Footer from '../../views/Admin/Footer/index.component';
import Navbar from '../../views/Admin/Navbar/index.component';
import routes from '../../views/Admin/Routes/Routes';
import Sidebar from '../../views/Admin/Sidebar/index.component';

export interface IAdminLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

export default function AdminLayout(props: IAdminLayoutProps) {
  const { children, ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const bgChildren = useColorModeValue('white', 'backgroundPage.primary_darkMode');
  const { onOpen } = useDisclosure();

  return (
    <Box>
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
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
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

          <Box mx={{ base: 'auto', md: '4' }} p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
            {children}
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </sidebarContext.Provider>
    </Box>
  );
}
