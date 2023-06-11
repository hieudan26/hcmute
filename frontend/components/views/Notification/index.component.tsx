import {
  Box,
  Button,
  Circle,
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
import { UIEvent, useRef, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { CgScreen } from 'react-icons/cg';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { RoleConstants } from '../../../constants/roles.constant';
import { useCUDNotification, useCountNotifications, useNotifications } from '../../../hooks/queries/notification';
import { useAppSelector } from '../../../hooks/redux';
import { INotificationResponse } from '../../../models/notification/notification.model';
import { ItemContent } from '../Admin/Navbar/ItemContent/index.component';

export interface INotificationProps {
  isUser?: boolean;
}

export default function Notification(props: INotificationProps) {
  const { isUser = false } = props;
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const textColor = useColorModeValue('#1B2559', 'white');
  const { colorMode } = useColorMode();
  const router = useRouter();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const auth = useAppSelector((state) => state.auth.value);
  const [isAll, setIsAll] = useState<boolean>(true);
  const notificationData = useNotifications(
    { pagination: { pageNumber: 0, pageSize: 5 }, isRead: isAll ? undefined : false },
    true
  );
  const quantityNotificationData = useCountNotifications(false, undefined, true);
  const { mutationReadAllNotifications } = useCUDNotification();

  const readAllNotifications = () => {
    mutationReadAllNotifications.mutate({ listNotifications: undefined, status: true });
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const element = notificationsRef.current;
    if (element && element.scrollHeight - element.scrollTop - element.clientHeight <= 1 && notificationData.hasNextPage) {
      notificationData.fetchNextPage();
    }
  };

  const handleReadNotification = () => {
    const listId: string[] = [];
    notificationData.data &&
      notificationData.data.pages.map((page) =>
        page.data.content.map((item: INotificationResponse, index: number) => {
          listId.push(item.id.toString());
        })
      );
    mutationReadAllNotifications.mutate({ listNotifications: listId, status: true });
  };

  const changeStatusNotificationDisplay = (type: string) => {
    if (type === 'all') {
      if (!isAll) {
        setIsAll(true);
      }
    } else {
      if (isAll) {
        setIsAll(false);
      }
    }
  };

  const pushToNotifications = () => {
    if (auth?.role === RoleConstants.ADMIN) {
      router.push(`/admin/notifications`);
    } else {
      router.push(`/notifications`);
    }
  };

  const setCloseMenu = () => {
    if (router.pathname.includes('notifications')) {
      return false;
    } else {
      return undefined;
    }
  };

  const handleOnClickNotification = (item: INotificationResponse) => {
    if (auth?.role === RoleConstants.ADMIN) {
      switch (item.type) {
        case 'place_status':
          router.push(`/admin/contributions-management/${item.contentId}`);
          break;
        case 'message':
          break;
        case 'post':
          break;
        case 'react':
          break;
        case 'comment':
          break;
        case 'comment_reply':
          break;
        default:
          break;
      }
    } else {
      switch (item.type) {
        case 'place_status':
          router.push(`/contribute/list-of-previous-contributions/${item.contentId}`);
          break;
        case 'message':
          break;
        case 'post':
          break;
        case 'report_observe':
          router.push(`/detail-post/${item.contentId}`);
          break;
        case 'report_active':
          router.push(`/detail-post/${item.contentId}`);
          break;
        case 'report_banned':
          break;
        case 'react':
          router.push(`/detail-post/${item.contentId}`);
          break;
        case 'comment':
          router.push(`/detail-post/${item.contentId}`);
          break;
        case 'comment_reply':
          router.push(`/detail-post/${item.contentId}`);
          break;
        case 'trip_request_owner':
          router.push(`/itinerary/edit/${item.contentId}`);
          break;
        case 'trip_request_rejected':
          router.push(`/itinerary/detail/${item.contentId}`);
          break;
        case 'trip_request_approved':
          router.push(`/itinerary/detail/${item.contentId}`);
          break;
        default:
          break;
      }
    }
  };

  return (
    <Menu onClose={handleReadNotification} isOpen={setCloseMenu()}>
      <MenuButton p='0px' position='relative' cursor={setCloseMenu() === undefined ? 'pointer' : 'default'}>
        <Icon
          as={MdOutlineNotificationsActive}
          color={setCloseMenu() === undefined ? navbarIcon : '#D0637C'}
          w='18px'
          h='18px'
          me='10px'
        />
        {quantityNotificationData.data && quantityNotificationData.data.data.count > 0 && (
          <Circle position='absolute' top='-1' left='-1.5' bg='red' fontSize='xx-small' size='4'>
            <Text color='white' lineHeight='none'>
              {quantityNotificationData.data.data.count <= 9 ? quantityNotificationData.data.data.count : '9+'}
            </Text>
          </Circle>
        )}
      </MenuButton>
      <MenuList
        boxShadow='2xl'
        pl='10px'
        py='15px'
        bg={colorMode === 'light' ? 'white' : 'black'}
        mt={isUser ? '0' : '30px'}
        minW={{ base: 'unset', md: '400px' }}
        maxW={{ base: '300px', md: '400px' }}
      >
        <Flex w='100%' justify='space-between' mb='2'>
          <Text fontSize='md' fontWeight='600' color={textColor} ml='5px'>
            Thông báo
          </Text>
          <Flex gap='4' align='center' justify='center'>
            <Button
              fontWeight='normal'
              _hover={{ background: 'transparent' }}
              h='0'
              fontSize='sm'
              color={textColor}
              bg='transparent'
              onClick={readAllNotifications}
              variant='ghost'
              p='0'
              m='0'
            >
              Đánh dấu đã đọc
            </Button>
            <Menu>
              <MenuButton mt='-0.5'>
                <Icon as={BiDotsVerticalRounded} color={navbarIcon} w='18px' h='18px' me='10px' />
              </MenuButton>
              <MenuList>
                <MenuItem alignItems='center' gap={4} onClick={pushToNotifications}>
                  <Icon fontSize='xs' as={CgScreen} />
                  Mở thông báo
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        <Box w='100%' mb='2'>
          <Button
            fontWeight='normal'
            fontSize='sm'
            color={textColor}
            bg='transparent'
            onClick={() => changeStatusNotificationDisplay('all')}
            variant='ghost'
            background={isAll ? (colorMode === 'light' ? 'gray.100' : 'gray.700') : 'transparent'}
            mr='2'
          >
            Tất cả
          </Button>
          <Button
            fontWeight='normal'
            fontSize='sm'
            color={textColor}
            bg='transparent'
            onClick={() => changeStatusNotificationDisplay('not-read')}
            variant='ghost'
            background={!isAll ? (colorMode === 'light' ? 'gray.100' : 'gray.700') : 'transparent'}
          >
            Chưa đọc
          </Button>
        </Box>
        <Flex flexDirection='column' maxH='300px' overflowY='scroll' ref={notificationsRef} onScroll={handleScroll}>
          {notificationData.data &&
            notificationData.data.pages.map((page) =>
              page.data.content.map((item: INotificationResponse, index: number) => (
                <MenuItem
                  key={item.id}
                  _hover={{ bg: 'gray.50', color: 'black' }}
                  _focus={{ bg: 'none' }}
                  px='1'
                  borderRadius='8px'
                  mb='10px'
                  onClick={() => handleOnClickNotification(item)}
                >
                  <ItemContent data={item} />
                </MenuItem>
              ))
            )}
          {!notificationData.hasNextPage && (
            <Text align='center' fontSize='xx-small'>
              Không có dữ liệu
            </Text>
          )}
        </Flex>
      </MenuList>
    </Menu>
  );
}
