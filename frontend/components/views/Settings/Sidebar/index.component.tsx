import { useDisclosure, useColorModeValue, Box, Drawer, DrawerContent, Center } from '@chakra-ui/react';
import { ReactNode } from 'react';
import MobileNav from './MobileNav/index.component';
import SidebarContent from './SidebarContent/index.component';

export interface ISidebarProps {
  children: ReactNode;
}

export default function Sidebar(props: ISidebarProps) {
  const { children } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box pt='70px' minH='67.8vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Center ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Center>
    </Box>
  );
}
