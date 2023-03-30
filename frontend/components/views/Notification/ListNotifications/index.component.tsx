import { Box, Button, Flex, Heading, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCUDNotification, useNotifications } from '../../../../hooks/queries/notification';
import { INotificationResponse } from '../../../../models/notification/notification.model';
import { ItemContent } from '../../Admin/Navbar/ItemContent/index.component';

export interface IListNotificationsProps {}

export default function ListNotifications(props: IListNotificationsProps) {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const textColor = useColorModeValue('#1B2559', 'white');
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [isAll, setIsAll] = useState<boolean>(true);
  const notificationData = useNotifications(
    { pagination: { pageNumber: 0, pageSize: 5 }, isRead: isAll ? undefined : false },
    true
  );
  const { mutationReadAllNotifications } = useCUDNotification();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      handleReadNotification();
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 20;
      const isBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - threshold;
      if (isBottom && notificationData.hasNextPage) {
        notificationData.fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [notificationData]);

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

  const readAllNotifications = () => {
    mutationReadAllNotifications.mutate({ listNotifications: undefined, status: true });
  };

  return (
    <Box bg={boxBg} p='8' rounded='md'>
      <Flex w='100%' justify='space-between' ml='5px' mb='4'>
        <Heading fontSize='xl' fontWeight='600' color={textColor}>
          Thông báo
        </Heading>
        <Button
          fontWeight='normal'
          _hover={{ background: 'transparent' }}
          fontSize='sm'
          color={textColor}
          bg='transparent'
          onClick={readAllNotifications}
          variant='ghost'
        >
          Đánh dấu đã đọc
        </Button>
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
      <Flex w='3xl' flexDirection='column'>
        {notificationData.data &&
          notificationData.data.pages.map((page) =>
            page.data.content.map((item: INotificationResponse, index: number) => (
              <Flex
                cursor='pointer'
                key={item.id}
                _hover={{ bg: 'gray.50', color: 'black' }}
                _focus={{ bg: 'none' }}
                p='6'
                borderRadius='8px'
                mb='10px'
                onClick={() => {
                  router.push(`/admin/contributions-management/${item.contentId}`);
                }}
              >
                <ItemContent data={item} />
              </Flex>
            ))
          )}
        {notificationData.isFetching && (
          <Text align='center' fontSize='sm'>
            Đang tải
          </Text>
        )}
        {!notificationData.hasNextPage && (
          <Text align='center' fontSize='sm'>
            Không có dữ liệu
          </Text>
        )}
      </Flex>
    </Box>
  );
}
