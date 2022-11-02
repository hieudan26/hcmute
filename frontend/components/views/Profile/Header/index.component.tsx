/* eslint-disable react-hooks/exhaustive-deps */
import { Box, BoxProps, Button, Divider, Flex, Heading, Slide, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import { defaultAvatar, defaultCoverBackground } from '../../../../utils';
import { ChakraNextImageGlobal } from '../../ChakraNextImageGlobal/index.component';
import EditProfilePic from '../Modals/EditProfilePic/index.component';
import TopNavNormal from './TopNavNormal/index.component';
import TopNavSpecial from './TopNavSpecial/index.component';
import cookie from 'react-cookies';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import { LocalUtils } from '../../../../utils/local.utils';

export interface IHeaderProps {
  user: IUserFirstLoginRequest | null;
}

export default function Header(props: IHeaderProps & BoxProps) {
  const { user, ...rest } = props;
  const router = useRouter();
  const currentRoute = router.pathname;
  const [mainCurrentRoute, setMainCurrentRoute] = useState<string>('');
  const [clientWindowHeight, setClientWindowHeight] = useState<number>(0);
  const [avatar, setAvater] = useState<string>(defaultAvatar);
  const [coverBackground, setCoverBackground] = useState<string>(defaultCoverBackground);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditButton, setIsEditButton] = useState<boolean>(false); //def: send friend
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user !== null) {
      var curUserId = undefined; //if loggedin

      if (isLoggedIn) {
        curUserId = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
      }

      if (curUserId) {
        if (curUserId && curUserId === user.id) {
          setIsEditButton(true);
        } else {
          setIsEditButton(false);
        }
      } else {
        setIsEditButton(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      if (user.avatar) setAvater(user.avatar);
      if (user.coverBackground) setCoverBackground(user.coverBackground);
    }
  }, [user]);

  useEffect(() => {
    const arrayRoute = currentRoute.split('/');
    setMainCurrentRoute(arrayRoute[arrayRoute.length - 1]);
  }, []);

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  const pushRoute = (link: string) => {
    if (user !== null) {
      setMainCurrentRoute(link);
    }
  };

  return (
    <Box bg='white' h={'670px'} {...rest}>
      <Box w='6xl' h={'670px'} m={'auto'}>
        <ChakraNextImageGlobal
          // w='5xl' === 1020
          width='1160px'
          height='360px'
          h='360px'
          rounded='10'
          overflow='hidden'
          border='2px solid #ececec'
          src={coverBackground}
          alt='cover-background'
        />

        <Box h={'190px'} mt={'-8'} ml='8'>
          <Flex>
            <ChakraNextImageGlobal
              width='180px'
              height='180px'
              w='180px'
              h='180px'
              rounded='full'
              overflow='hidden'
              border='2px solid #ececec'
              src={avatar}
              alt='avatar'
            />
            <Box p={5} mt={10}>
              <Heading>{user && user.fullName ? user.fullName : `${user?.firstName} ${user?.lastName}`}</Heading>
              <Text color={'grey'}>10 Friends</Text>
            </Box>
            <Spacer />
            <Box hidden={!isLoggedIn}>
              {isEditButton ? (
                <>
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    m={'80px 50px'}
                  >
                    Edit Picture
                  </Button>
                  <EditProfilePic
                    user={user}
                    isOpen={isOpen}
                    onClose={() => {
                      setIsOpen(false);
                    }}
                  />
                </>
              ) : (
                <Button m={'80px 50px'}>Send friend request</Button>
              )}
            </Box>
          </Flex>
        </Box>
        <Divider />

        <TopNavNormal userId={user ? user.id : 'a'} mainCurrentRoute={mainCurrentRoute} pushRoute={pushRoute} />
        <Slide direction='top' in={true}>
          {clientWindowHeight >= 534.4 && (
            <TopNavSpecial
              avatar={avatar}
              user={user}
              userId={user ? user.id : 'a'}
              mainCurrentRoute={mainCurrentRoute}
              pushRoute={pushRoute}
            />
          )}
        </Slide>
      </Box>
    </Box>
  );
  // }
}
