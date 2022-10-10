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
  Tooltip,
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
import { MdLanguage, MdLightMode } from 'react-icons/md';
import { RiProfileLine } from 'react-icons/ri';
import { logout } from '../../../../app/slices/authSlice';
import { setThemeMode } from '../../../../app/themeSlice';
import { RoleConstants } from '../../../../constants/roles.constant';
import { LangConstants, ThemeConstants } from '../../../../constants/settings.constant';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { AuthService } from '../../../../services/auth/auth.service';
import { toggleMessage } from '../../Message/index.component';
import MenuItem from '../MenuItem/index.component';

export interface IMenuLinksProps {
  isOpen: boolean;
  role: string;
}

export default function MenuLinks(props: IMenuLinksProps) {
  const { isOpen, role } = props;
  const [redirectPath, setRedirectPath] = useState<string>('');
  const [fullNameUser, setFullNameUser] = useState<string | null>(null);
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
    if (userInfor !== null && userInfor.fullName) {
      setFullNameUser(userInfor.fullName);
    }
  }, [userInfor]);

  useEffect(() => {
    setRedirectPath(router.pathname);
  }, [router.pathname]);

  const changeLanguage = (): void => {
    if (router.locale === LangConstants.VI) {
      router.push(router.route, router.asPath, {
        locale: LangConstants.EN,
      });
    } else {
      router.push(router.route, router.asPath, {
        locale: LangConstants.VI,
      });
    }
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
          <MenuItem to='/'>{t('navbar.navlink04')}</MenuItem>
          {statusMenu ? (
            <Menu closeOnBlur={true}>
              <MenuButton ml='10px'>
                <Icon color={iconAccount} fontSize={'30px'} as={FaUserCircle} marginBottom='5px' />
              </MenuButton>
              <MenuList bg={bgMenu} color={colorMenu}>
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
                    <Link href='profile'>
                      <MenuItm fontFamily='titleFont' icon={<Icon fontSize='20px' as={RiProfileLine} />} fontSize='14px'>
                        {t('menuUser.profile')}
                      </MenuItm>
                    </Link>
                    <MenuItm
                      onClick={handleLogout}
                      fontFamily='titleFont'
                      icon={<Icon fontSize='20px' as={GoSignOut} />}
                      fontSize='14px'
                    >
                      Logout
                    </MenuItm>
                  </>
                ) : (
                  <Link href={`login?url=${redirectPath}`}>
                    <MenuItm fontFamily='titleFont' icon={<Icon fontSize='20px' as={IoIosLogIn} />} fontSize='14px'>
                      {t('menuAnonymous.auth')}
                    </MenuItm>
                  </Link>
                )}
                <MenuDivider />
                <Tooltip label={`This feature still has problems. So be careful when using`}>
                  <MenuItm
                    onClick={changeLanguage}
                    fontFamily='titleFont'
                    icon={<Icon fontSize='20px' as={MdLanguage} />}
                    fontSize='14px'
                  >
                    {t('menuBase.language')}{' '}
                    {router.locale === LangConstants.EN ? t('menuBase.languages.vi') : t('menuBase.languages.en')}
                  </MenuItm>
                </Tooltip>
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
            <MenuItem to='/signup'>
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
