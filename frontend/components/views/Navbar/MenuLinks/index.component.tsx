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
  Stack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosLogIn } from 'react-icons/io';
import { MdLanguage, MdLightMode } from 'react-icons/md';
import { RiProfileLine } from 'react-icons/ri';
import { RoleConstants } from '../../../../constants/roles.constant';
import { LangConstants } from '../../../../constants/settings.constant';
import { darkColor } from '../../../../utils/ColorMode/dark';
import { lightColor } from '../../../../utils/ColorMode/light';
import MenuItem from '../MenuItem/index.component';

export interface IMenuLinksProps {
  isOpen: boolean;
  role: string;
}

export default function MenuLinks(props: IMenuLinksProps) {
  const { isOpen, role } = props;
  const router = useRouter();
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

  const changeLanguage = () => {
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

  return (
    <Box zIndex='999' display={{ base: isOpen ? 'block' : 'none', lg: 'block' }} flexBasis={{ base: '100%', lg: 'auto' }}>
      <Flex
        align='center'
        justify={['center', 'center', 'center', 'flex-end', 'flex-end']}
        direction={['column', 'column', 'column', 'row', 'row']}
        pt={[4, 4, 4, 0, 0]}
      >
        <MenuItem to='/'>{t('navbar.navlink01')}</MenuItem>
        <MenuItem to='/'>{t('navbar.navlink02')}</MenuItem>
        <MenuItem to='/'>{t('navbar.navlink03')}</MenuItem>
        <MenuItem to='/'>{t('navbar.navlink04')}</MenuItem>
        {statusMenu ? (
          <Menu closeOnBlur={true}>
            <MenuButton>
              <Icon color={iconAccount} fontSize={'30px'} as={FaUserCircle} marginBottom='5px' />
            </MenuButton>
            <MenuList bg={bgMenu} color={colorMenu}>
              {role !== RoleConstants.ANONYMOUS ? (
                <Link href='profile'>
                  <MenuItm fontFamily='titleFont' icon={<Icon fontSize='20px' as={RiProfileLine} />} fontSize='14px'>
                    {t('menuUser.profile')}
                  </MenuItm>
                </Link>
              ) : (
                <Link href='login'>
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
                {router.locale === LangConstants.VI ? t('menuBase.languages.vi') : t('menuBase.languages.en')}
              </MenuItm>
              <MenuItm
                onClick={() => {
                  toggleColorMode();
                }}
                fontFamily='titleFont'
                icon={<Icon fontSize='20px' as={MdLightMode} />}
                fontSize='14px'
              >
                {t('menuBase.theme.dark')}
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
  );
}
