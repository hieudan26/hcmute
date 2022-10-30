import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem as MenuItm,
  MenuList,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsFillMoonFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import { GoSignOut } from 'react-icons/go';
import { HiOutlineLink } from 'react-icons/hi';
import { IoIosLogIn } from 'react-icons/io';
import { MdLanguage, MdLightMode, MdOutlineNotificationsActive } from 'react-icons/md';
import { RiProfileLine, RiSettings4Fill } from 'react-icons/ri';
import { logout } from '../../../../app/slices/authSlice';
import { setThemeMode } from '../../../../app/themeSlice';
import { RoleConstants } from '../../../../constants/roles.constant';
import { LangConstants, ThemeConstants } from '../../../../constants/settings.constant';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { AuthService } from '../../../../services/auth/auth.service';
import MenuItem from '../MenuItem/index.component';

export interface IMenuLinksProps {
  isOpen: boolean;
  role: string;
}

export default function MenuLinks(props: IMenuLinksProps) {
  const { isOpen, role } = props;
  const [redirectPath, setRedirectPath] = useState<string>('');
  const [fullNameUser, setFullNameUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const userInfor = useAppSelector((state) => state.auth.value);
  const router = useRouter();
  const toast = useToast();
  const currentTheme = useAppSelector((state) => state.theme);
  const { t } = useTranslation('header');
  const { colorMode, toggleColorMode } = useColorMode();
  const iconAccount = useColorModeValue('blackAlpha.600', 'white');
  const bgMenu = useColorModeValue('white', 'header.primary_darkMode');
  const colorMenu = useColorModeValue('textColor.black', 'textColor.white');
  const statusMenu = useBreakpointValue(
    {
      base: false,
      lg: true,
    },
    {
      fallback: 'base',
    }
  );

  useEffect(() => {
    if (userInfor !== null && userInfor.id) {
      setUserId(userInfor.id);
    }
  }, [userInfor]);

  useEffect(() => {
    if (userInfor !== null && userInfor.fullName) {
      setFullNameUser(userInfor.fullName);
    }
  }, [userInfor]);

  useEffect(() => {
    console.log(router.pathname);
    if (router.pathname === '/experiences' || router.pathname === '/faq' || router.pathname === '/itinerary') {
      setRedirectPath(router.pathname);
    } else {
      setRedirectPath('/experiences');
    }
  }, [router.pathname]);

  const changeLanguage = (): void => {
    const { pathname, asPath, query, locale } = router;
    if (locale === LangConstants.VI) {
      router.push({ pathname, query }, asPath, {
        locale: LangConstants.EN,
      });
    } else {
      router.push({ pathname, query }, asPath, {
        locale: LangConstants.VI,
      });
    }

    // trigger reload after push locale to refresh toast(if any) before
    router.events.on('routeChangeComplete', () => {
      router.reload();
    });
  };

  const changeTheme = (): void => {
    toggleColorMode();
    if (currentTheme.currentTheme === ThemeConstants.LIGHT) {
      dispatch(setThemeMode(ThemeConstants.DARK));
    } else {
      dispatch(setThemeMode(ThemeConstants.LIGHT));
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    dispatch(logout());
    router.push('/experiences');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullNameUser ? fullNameUser : 'Hello world');
    toast({
      description: 'Copy to clipboard successfully!',
      status: 'info',
      duration: 1000,
      isClosable: true,
      variant: 'solid',
      position: 'top-right',
    });
  };

  return (
    <>
      <Box zIndex='999' display={{ base: isOpen ? 'block' : 'none', lg: 'block' }} flexBasis={{ base: '100%', lg: 'auto' }}>
        <Flex
          align='center'
          justify={['center', 'center', 'center', 'flex-end', 'flex-end']}
          direction={['column', 'column', 'column', 'row', 'row']}
          pt={[4, 4, 4, 0, 0]}
        >
          <MenuItem to='/experiences'>{t('navbar.navlink01')}</MenuItem>
          <MenuItem to='/faq'>{t('navbar.navlink02')}</MenuItem>
          <MenuItem to='/itinerary'>{t('navbar.navlink03')}</MenuItem>
          <MenuItem to='/discovery'>{t('navbar.navlink04')}</MenuItem>
          {role !== RoleConstants.ANONYMOUS && (
            <Menu closeOnBlur={true}>
              <MenuButton ml='10px' mr='5px'>
                <Icon color={iconAccount} fontSize={'20px'} as={MdOutlineNotificationsActive} marginBottom='5px' />
              </MenuButton>

              <MenuList>
                <MenuItm fontFamily='titleFont' fontSize='14px'>
                  Nothing here
                </MenuItm>
              </MenuList>
            </Menu>
          )}
          {statusMenu ? (
            <Menu closeOnBlur={true}>
              <MenuButton ml='10px'>
                <Icon color={iconAccount} fontSize={'30px'} as={FaUserCircle} marginBottom='5px' />
              </MenuButton>
              <MenuList bg={bgMenu} color={colorMenu} zIndex={10000}>
                {role !== RoleConstants.ANONYMOUS ? (
                  <>
                    {fullNameUser !== null && (
                      <MenuItm
                        onClick={copyToClipboard}
                        fontFamily='titleFont'
                        icon={<Icon fontSize='20px' as={HiOutlineLink} />}
                        fontSize='14px'
                      >
                        {t('menuUser.welcome')}: {fullNameUser}
                      </MenuItm>
                    )}
                    <Link href={userId ? `profile/${userId}/posts` : 'profile'} replace>
                      <MenuItm fontFamily='titleFont' icon={<Icon fontSize='20px' as={RiProfileLine} />} fontSize='14px'>
                        {t('menuUser.profile')}
                      </MenuItm>
                    </Link>
                    <Link href='/settings?tab=account' replace>
                      <MenuItm fontFamily='titleFont' icon={<Icon fontSize='20px' as={RiSettings4Fill} />} fontSize='14px'>
                        Privacy & Security settings
                      </MenuItm>
                    </Link>
                    <MenuItm
                      onClick={handleLogout}
                      fontFamily='titleFont'
                      icon={<Icon paddingLeft='3px' fontSize='20px' as={GoSignOut} />}
                      fontSize='14px'
                    >
                      Logout
                    </MenuItm>
                  </>
                ) : (
                  <Link href={`login?url=${redirectPath}`} replace>
                    <MenuItm fontFamily='titleFont' icon={<Icon fontSize='20px' as={IoIosLogIn} />} fontSize='14px'>
                      {t('menuAnonymous.auth')}
                    </MenuItm>
                  </Link>
                )}
                <MenuDivider />
                <MenuItm
                  onClick={changeLanguage}
                  fontFamily='titleFont'
                  icon={<Icon fontSize='20px' as={MdLanguage} />}
                  fontSize='14px'
                >
                  {t('menuBase.language')}{' '}
                  {router.locale === LangConstants.EN ? t('menuBase.languages.vi') : t('menuBase.languages.en')}
                </MenuItm>
                <MenuItm
                  onClick={changeTheme}
                  fontFamily='titleFont'
                  icon={
                    <Icon fontSize='20px' as={currentTheme.currentTheme === ThemeConstants.DARK ? MdLightMode : BsFillMoonFill} />
                  }
                  fontSize='14px'
                >
                  {currentTheme.currentTheme === ThemeConstants.DARK ? t('menuBase.theme.light') : t('menuBase.theme.dark')}
                </MenuItm>
              </MenuList>
            </Menu>
          ) : (
            <MenuItem to={`login?url=${redirectPath}`}>
              <Button
                size='md'
                color={'textColor.white'}
                bg={'backgroundButton.primary'}
                _hover={{
                  bg: 'backgroundButton.secondary',
                  color: 'textColor.black',
                }}
              >
                {t('menuBase.mobile')}
              </Button>
            </MenuItem>
          )}
        </Flex>
      </Box>
    </>
  );
}
