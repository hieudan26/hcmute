import {
  Avatar,
  Box,
  Button,
  Center,
  Circle,
  Flex,
  Icon,
  IconButton,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IoHome, IoMoon, IoNotifications, IoSearchSharp, IoSunny } from 'react-icons/io5';
import { FriendStatus } from '../../../../constants/global.constant';
import { useChats } from '../../../../hooks/queries/chat';
import { useFriends } from '../../../../hooks/queries/friend';
import { IFriendResponse, IUserFirstLoginRequest } from '../../../../models/user/user.model';
import SingleChat from '../SingleChat/index.component';
import SingleFriend from '../SingleFriend/index.component';
import { useTranslation } from 'next-i18next';
import CreateChatModal from '../Modals/CreateChatModal/index.component';
import { useState } from 'react';

export interface ISidebarProps {
  user: IUserFirstLoginRequest | null;
  fullWidth?: boolean;
}

export default function Sidebar(props: ISidebarProps) {
  const { fullWidth, user } = props;
  const { t } = useTranslation('chat');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { isOpen: isOpenCreateChat, onOpen: onOpenCreateChat, onClose: onCloseCreateChat } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const friends = useFriends(
    {
      key: undefined,
      status: FriendStatus.FRIEND,
      userId: user ? user.id : '86ce8572-3c92-4cca-89e3-060c35e613be',
      pageNumber: 0,
      pageSize: 10,
      sortBy: 'time',
      sortType: 'DESC',
    },
    true
  );
  const singleChats = useChats(
    {
      params: { pageNumber: 0, pageSize: 20, sortBy: 'time', sortType: 'DESC' },
      type: 'SINGLE',
    },
    tabIndex === 1 ? true : false
  );

  const groupChats = useChats(
    {
      params: { pageNumber: 0, pageSize: 20, sortBy: 'time', sortType: 'DESC' },
      type: 'GROUP',
    },
    tabIndex === 2 ? true : false
  );

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Flex
      height='100vh'
      maxWidth={!fullWidth ? '25%' : 'full'}
      minWidth={!fullWidth ? '25%' : 'full'}
      // minW='25%'
      // maxW='25%'
      direction='column'
      borderRight='1px solid'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
    >
      <CreateChatModal isOpen={isOpenCreateChat} onOpen={onOpenCreateChat} onClose={onCloseCreateChat} />
      <Flex w='full' flexWrap='wrap' direction='column' position='sticky' top='0'>
        <Flex w='full' justify='space-between' height='71px' align='center' p='10px'>
          <Avatar
            src={user?.avatar}
            name={user?.fullName}
            cursor='pointer'
            onClick={() => {
              router.push(`/profile/${user?.id}/about`);
            }}
          />
          <Stack maxWidth={!fullWidth ? '30vw' : 'full'} direction='row' align='center'>
            <IconButton aria-label='Notification' icon={<Icon as={IoNotifications} />} isRound />
            <IconButton
              aria-label='Home'
              icon={<Icon as={IoHome} />}
              onClick={() => {
                router.push('/');
              }}
              isRound
            />
            <IconButton
              aria-label='Toggle Dark Mode'
              icon={colorMode === 'light' ? <Icon as={IoMoon} /> : <Icon as={IoSunny} />}
              onClick={toggleColorMode}
              isRound
            />
          </Stack>
        </Flex>
        <Stack direction='row' align='center' p='10px'>
          <Button w='full' onClick={onOpenCreateChat}>
            Tạo phòng trò chuyện
          </Button>
        </Stack>
        <Stack direction='row' align='center' p='10px'>
          <Flex w='full'>
            <Input w='full' placeholder={t('input_search')} />
            <IconButton aria-label='search' icon={<Icon as={IoSearchSharp} />} />
          </Flex>
        </Stack>
      </Flex>
      <Stack w='full' p='10px' direction='column' overflow='scroll'>
        <Tabs isFitted colorScheme='pink' height='100vh' index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            <Tab fontSize='xs'>{t('all_friends')}</Tab>
            <Tab fontSize='xs'>
              <Flex position='relative' align='center'>
                <Text>{t('single_chats')}</Text>
                <Circle position='absolute' top='-2.5' right='-4' bg='red' fontSize='2xs' size='4'>
                  <Text color='white' lineHeight='none'>
                    1
                  </Text>
                </Circle>
              </Flex>
            </Tab>
            <Tab fontSize='xs'>
              <Flex position='relative' align='center'>
                <Text>{t('group_chats')}</Text>
                <Circle position='absolute' top='-2.5' right='-4' bg='red' fontSize='2xs' size='4'>
                  <Text color='white' lineHeight='none'>
                    20
                  </Text>
                </Circle>
              </Flex>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box>
                {friends.data?.pages[0].data.content.length === 0 ? (
                  <Text py='2'>{t('nodata')}</Text>
                ) : (
                  friends.data?.pages.map((page) =>
                    page.data.content.map((item: IFriendResponse, index: number) => (
                      <SingleFriend curUser={user} data={item} key={index} />
                    ))
                  )
                )}
              </Box>
              <Center mt='10' hidden={!friends.hasNextPage}>
                <Button
                  bg='transparent'
                  variant='link'
                  onClick={() => {
                    friends.fetchNextPage();
                  }}
                >
                  {t('loadmore')}
                </Button>
              </Center>
            </TabPanel>
            <TabPanel>
              <Box>
                {singleChats.data?.pages[0].data.content.length === 0 ? (
                  <Text py='2'>{t('nodata')}</Text>
                ) : (
                  singleChats.data?.pages.map((page) =>
                    page.data.content.map((item: any, index: number) => <SingleChat curUser={user} data={item} key={index} />)
                  )
                )}
              </Box>
              <Center mt='10' hidden={!singleChats.hasNextPage}>
                <Button
                  bg='transparent'
                  variant='link'
                  onClick={() => {
                    singleChats.fetchNextPage();
                  }}
                >
                  {t('loadmore')}
                </Button>
              </Center>
            </TabPanel>
            <TabPanel>
              <Box>
                {groupChats.data?.pages[0].data.content.length === 0 ? (
                  <Text py='2'>{t('nodata')}</Text>
                ) : (
                  groupChats.data?.pages.map((page) =>
                    page.data.content.map((item: any, index: number) => (
                      <SingleChat curUser={user} data={item} key={index} isGroup />
                    ))
                  )
                )}
              </Box>
              <Center mt='10' hidden={!groupChats.hasNextPage}>
                <Button
                  bg='transparent'
                  variant='link'
                  onClick={() => {
                    groupChats.fetchNextPage();
                  }}
                >
                  {t('loadmore')}
                </Button>
              </Center>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Flex>
  );
}
