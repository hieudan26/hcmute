/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  Heading,
  Slide,
  Spacer,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  useDisclosure,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import { defaultAvatar, defaultCoverBackground, formatTimePost } from '../../../../utils';
import { ChakraNextImageGlobal } from '../../ChakraNextImageGlobal/index.component';
import EditProfilePic from '../Modals/EditProfilePic/index.component';
import TopNavNormal from './TopNavNormal/index.component';
import TopNavSpecial from './TopNavSpecial/index.component';
import cookie from 'react-cookies';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import { LocalUtils } from '../../../../utils/local.utils';
import userService from '../../../../services/user/user.service';
import { FriendStatus } from '../../../../constants/global.constant';
import { useCUDFriends } from '../../../../hooks/queries/friend';
import { useColorModeValue } from '@chakra-ui/react';
import chatService from '../../../../services/chat/chat.service';
import { useQueryClient } from '@tanstack/react-query';
import { RoleConstants } from '../../../../constants/roles.constant';
import { useAppSelector } from '../../../../hooks/redux';
import { useTranslation } from 'next-i18next';

export interface IHeaderProps {
  user: IUserFirstLoginRequest | null;
}

export default function Header(props: IHeaderProps & BoxProps) {
  const { user, ...rest } = props;
  const { t } = useTranslation('profile');
  const router = useRouter();
  const currentRoute = router.pathname;
  const [mainCurrentRoute, setMainCurrentRoute] = useState<string>('');
  const [clientWindowHeight, setClientWindowHeight] = useState<number>(0);
  const [avatar, setAvater] = useState<string>(defaultAvatar);
  const [coverBackground, setCoverBackground] = useState<string>(defaultCoverBackground);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditButton, setIsEditButton] = useState<boolean>(false); //def: send friend
  const [statusFriend, setStatusFriend] = useState<string>('none');
  const [isHiddenAccept, setIsHiddenAccept] = useState<boolean>(false);
  const [isHiddenCancel, setIsHiddenCancel] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('86ce8572-3c92-4cca-89e3-060c35e613be');
  const [textStatusCancel, setTextStatusCancel] = useState<string>('');
  const [textStatusAccept, setTextStatusAccept] = useState<string>('');
  const [alertConfirm, setAlertConfirm] = useState<boolean>(false);
  const [friendNumber, setFriendNumber] = useState<number>(0);
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const { mutationUpdateStatusFriends } = useCUDFriends();
  const bgHeader = useColorModeValue('white', 'header.primary_darkMode');
  const cancelRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth.value);

  useEffect(() => {
    if (user) {
      const fetchFriendNumber = async () => {
        const response = await userService.getUserFriends(user.id, 'friend', undefined);
        setFriendNumber(response.data.pageable.totalItems as number);
      };

      fetchFriendNumber();
    }
  }, [user]);

  useEffect(() => {
    if (statusFriend === FriendStatus.FRIEND) {
      setTextStatusCancel(t('navbar.friendstatus.unfriend'));
    } else if (statusFriend === FriendStatus.PENDING) {
      setTextStatusCancel(t('navbar.friendstatus.declinefriendrequest'));
    } else if (statusFriend === FriendStatus.INVITED) {
      setTextStatusCancel(t('navbar.friendstatus.retractfriendrequest'));
    }

    if (statusFriend === FriendStatus.NO_FRIEND) {
      setTextStatusAccept(t('navbar.friendstatus.sendfriendrequest'));
    } else if (statusFriend === FriendStatus.PENDING) {
      setTextStatusAccept(t('navbar.friendstatus.acceptfriendrequest'));
    }
  }, [statusFriend]);

  useEffect(() => {
    if (isLoggedIn && !isEditButton && auth?.role === RoleConstants.USER) {
      var curUserId: string | undefined | null = undefined; //if loggedin

      if (isLoggedIn) {
        curUserId = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
      }

      if (curUserId && user) {
        const temp = curUserId;
        const test = async () => {
          const response = await userService.getUserFriendStatus(temp, user.id);
          setStatusFriend(response.data.status);
          if (response.data.status === FriendStatus.FRIEND || response.data.status === FriendStatus.INVITED) {
            setIsHiddenAccept(true);
          } else if (response.data.status === FriendStatus.NO_FRIEND) {
            setIsHiddenCancel(true);
          }
        };
        test();
      }
    }
  }, [user, router.query]);

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
        setCurrentUserId(curUserId);
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
  }, [router.pathname]);

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  const pushRoute = (link: string) => {
    if (user !== null) {
      setMainCurrentRoute(link);
    }
  };

  const handleChangeStatus = (type: string) => {
    if (user) {
      if (type === 'cancel') {
        setIsHiddenCancel(true);
        setIsHiddenAccept(false);
        setStatusFriend(FriendStatus.NO_FRIEND);
        mutationUpdateStatusFriends.mutate({
          friendId: user.id,
          status: 'remove',
          time: formatTimePost(new Date()),
          userId: currentUserId,
        });
      } else {
        setIsHiddenAccept(true);
        setIsHiddenCancel(false);
        if (statusFriend === FriendStatus.PENDING) {
          setStatusFriend(FriendStatus.FRIEND);
        } else if (statusFriend === FriendStatus.NO_FRIEND) {
          setStatusFriend(FriendStatus.INVITED);
        }
        mutationUpdateStatusFriends.mutate({
          friendId: user.id,
          status: 'add',
          time: formatTimePost(new Date()),
          userId: currentUserId,
        });
      }
    }
  };

  const goToChat = async () => {
    if (user) {
      const response = await chatService.isInRoom(user.id);
      const isInRoom = response.data.isInChatRoom;
      if (isInRoom) {
        const idRoom = response.data.roomId;
        router.push({ pathname: `/chats/${idRoom}`, query: { curUser: user.id } }, `/chats/${idRoom}`);
      } else {
        setAlertConfirm(true);
      }
    }
  };

  const createNewRoom = async () => {
    if (user) {
      const response = await chatService.createRooms({
        friends: [user.id],
        time: formatTimePost(new Date()),
      });
      setAlertConfirm(false);
      queryClient.invalidateQueries(['chats']);
      const idRoom = response.data.id;
      router.push({ pathname: `/chats/${idRoom}`, query: { curUser: user.id } }, `/chats/${idRoom}`);
    }
  };

  return (
    <Box bg={bgHeader} h={'670px'} {...rest}>
      <Box w='6xl' h={'670px'} m={'auto'} zIndex='5' position='relative'>
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
              <Text color={'grey'}>
                {friendNumber} {t('navbar.friends')}
              </Text>
            </Box>
            <Spacer />
            {isLoggedIn && auth?.role !== RoleConstants.ADMIN && !isEditButton && (
              <>
                <Button onClick={goToChat} my={'80px'} mx='5'>
                  {t('navbar.message')}
                </Button>
                <AlertDialog
                  isCentered
                  isOpen={alertConfirm}
                  leastDestructiveRef={cancelRef}
                  onClose={() => setAlertConfirm(false)}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {t('navbar.roomchat.header')}
                      </AlertDialogHeader>

                      <AlertDialogBody>{t('navbar.roomchat.body')}</AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={() => setAlertConfirm(false)}>
                          {t('navbar.roomchat.footer_cancel')}
                        </Button>
                        <Button colorScheme='red' onClick={createNewRoom} ml={3}>
                          {t('navbar.roomchat.footer_start')}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            )}

            <Box hidden={!isLoggedIn || auth?.role === RoleConstants.ADMIN}>
              {isEditButton && (
                <>
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    m={'80px 50px'}
                  >
                    {t('navbar.edit_picture')}
                  </Button>
                  <EditProfilePic
                    user={user}
                    isOpen={isOpen}
                    onClose={() => {
                      setIsOpen(false);
                    }}
                  />
                </>
              )}

              {!isEditButton && (
                <Box mt={'80px'}>
                  <Button
                    onClick={() => {
                      handleChangeStatus('cancel');
                    }}
                    hidden={isHiddenCancel}
                    background='gray.600'
                    _hover={{ bg: 'black' }}
                  >
                    {textStatusCancel}
                  </Button>
                  <Button
                    onClick={() => {
                      handleChangeStatus('accept');
                    }}
                    hidden={isHiddenAccept}
                    ml={!isHiddenAccept ? '20px' : '0px'}
                  >
                    {textStatusAccept}
                  </Button>
                </Box>
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
