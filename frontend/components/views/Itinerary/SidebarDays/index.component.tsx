import {
  Avatar,
  Box,
  Center,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import SidebarContent from './SidebarContent/index.component';
import { FiMenu } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import NavStep from '../NavStep/index.component';

export interface ISidebarDaysProps {
  children: React.ReactNode;
}

export default function SidebarDays(props: ISidebarDaysProps) {
  const { children } = props;
  const sidebar = useDisclosure();

  return (
    <Box>
      <SidebarContent display={{ base: 'none', md: 'unset' }} />
      <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement='left'>
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent />
        </DrawerContent>
      </Drawer>

      <Center ml={{ base: 0, md: 60 }} minH='full'>
        {children}
      </Center>
    </Box>
  );
}
