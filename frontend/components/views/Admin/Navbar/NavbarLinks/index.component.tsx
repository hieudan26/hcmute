import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { logout } from '../../../../../app/slices/authSlice';
import { isConnected } from '../../../../../app/slices/socketSlice';
import { clearUserNotAuth } from '../../../../../app/slices/userNotAuthSlice';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { AuthService } from '../../../../../services/auth/auth.service';
import { SocketContext } from '../../../../contexts/Socket';
import Notification from '../../../Notification/index.component';
import routes from '../../Routes/Routes';
import { SidebarResponsive } from '../../Sidebar/index.component';

export default function NavbarLinks(props: { secondary: boolean | undefined }) {
  const { secondary } = props;
  const { stompClient } = useContext(SocketContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const menuBg = useColorModeValue('backgroundPage.primary_lightMode', 'backgroundPage.primary_darkMode');
  const textColor = useColorModeValue('#1B2559', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = 'none';
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.value);
  const router = useRouter();

  const handleLogout = async () => {
    await AuthService.logout();
    dispatch(clearUserNotAuth());
    dispatch(logout());
    if (stompClient) {
      stompClient.deactivate();
      dispatch(isConnected(false));
    }
    router.push('/admin/login');
  };

  const goToSocial = () => {
    router.push('/experiences');
  };

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems='center'
      flexDirection='row'
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p='8px'
      borderRadius='30px'
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />
      <Notification />

      {/* <Button variant='no-hover' bg='transparent' p='0px' minW='unset' minH='unset' h='18px' w='max-content' onClick={goToSocial}>
        <Icon me='10px' h='18px' w='18px' color={navbarIcon} as={MdOutlineScreenShare} />
      </Button> */}
      <Button
        variant='no-hover'
        bg='transparent'
        p='0px'
        minW='unset'
        minH='unset'
        h='18px'
        w='max-content'
        onClick={toggleColorMode}
      >
        <Icon me='10px' h='18px' w='18px' color={navbarIcon} as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
      </Button>
      <Menu>
        <MenuButton p='0px'>
          <Avatar _hover={{ cursor: 'pointer' }} color='white' name={auth?.fullName} bg='#11047A' size='sm' w='40px' h='40px' />
        </MenuButton>
        <MenuList
          zIndex='popover'
          boxShadow={shadow}
          p='0px'
          mt='10px'
          borderRadius='20px'
          bg={colorMode === 'light' ? 'white' : 'black'}
          border='none'
        >
          <Flex w='100%' mb='0px'>
            <Text
              ps='20px'
              pt='16px'
              pb='10px'
              w='100%'
              borderBottom='1px solid'
              borderColor={borderColor}
              fontSize='sm'
              fontWeight='700'
              color={textColor}
            >
              👋&nbsp; Chào, {auth?.fullName}
            </Text>
          </Flex>
          <Flex flexDirection='column' p='10px'>
            <MenuItem
              onClick={() => {
                router.push('/admin/profile');
              }}
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius='8px'
              px='14px'
            >
              <Text fontSize='sm'>Cài đặt hồ sơ</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color='red.400'
              borderRadius='8px'
              px='14px'
              onClick={handleLogout}
            >
              <Text fontSize='sm'>Đăng xuất</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
