import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { IoMenuOutline } from 'react-icons/io5';
import { IRoute } from '../../../../types/navigation';
import { isWindowAvailable } from '../../../../utils/navigation';
import { renderThumb, renderTrack, renderView } from '../Scrollbar/index.component';
import Content from './Content/index.component';

interface SidebarResponsiveProps {
  routes: IRoute[];
}

interface SidebarProps extends SidebarResponsiveProps {
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const { routes } = props;

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
  let sidebarBg = useColorModeValue('white', 'black');
  let sidebarMargins = '0px';

  return (
    <Box display={{ sm: 'none', xl: 'block' }} position='fixed' minH='100%'>
      <Box
        bg={sidebarBg}
        transition={variantChange}
        minW='305px'
        h='100vh'
        m={sidebarMargins}
        minH='100%'
        overflowX='hidden'
        boxShadow={shadow}
      >
        <Scrollbars autoHide renderTrackVertical={renderTrack} renderThumbVertical={renderThumb} renderView={renderView}>
          <Content routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

export function SidebarResponsive(props: SidebarResponsiveProps) {
  const { routes } = props;
  let sidebarBackgroundColor = useColorModeValue('white', 'black');
  let menuColor = useColorModeValue('gray.400', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<null | HTMLDivElement>(null);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems='center'>
      <Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
        <Icon as={IoMenuOutline} color={menuColor} my='auto' w='20px' h='20px' me='10px' _hover={{ cursor: 'pointer' }} />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={isWindowAvailable() && window.document.documentElement.dir === 'rtl' ? 'right' : 'left'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
          <DrawerCloseButton zIndex='3' onClick={onClose} _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
          <DrawerBody maxW='285px' px='0rem' pb='0'>
            <Scrollbars autoHide renderTrackVertical={renderTrack} renderThumbVertical={renderThumb} renderView={renderView}>
              <Content routes={routes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

export default Sidebar;
