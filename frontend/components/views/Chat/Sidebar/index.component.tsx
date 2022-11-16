import {
  Avatar,
  Box,
  Button,
  Center,
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IoHome, IoLogOut, IoMoon, IoSearchSharp, IoSunny } from 'react-icons/io5';
import { FriendStatus } from '../../../../constants/global.constant';
import { useFriends } from '../../../../hooks/queries/friend';
import { IFriendResponse, IUserFirstLoginRequest } from '../../../../models/user/user.model';
import SingleChat from '../SingleChat/index.component';

export interface ISidebarProps {
  user: IUserFirstLoginRequest | null;
  fullWidth?: boolean;
}

export default function Sidebar(props: ISidebarProps) {
  const { fullWidth, user } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const friends = useFriends(
    {
      status: FriendStatus.FRIEND,
      userId: user ? user.id : '86ce8572-3c92-4cca-89e3-060c35e613be',
      pageNumber: 0,
      pageSize: 10,
      sortBy: 'time',
      sortType: 'DESC',
    },
    true
  );

  return (
    <Flex
      height='100vh'
      // maxWidth={fullWidth ? '25%' : '30vw'}
      // width={fullWidth ? '25%' : ''}
      minW='25%'
      maxW='25%'
      direction='column'
      borderRight='1px solid'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
    >
      <Flex w='full' flexWrap='wrap' direction='column' position='sticky' top='0'>
        <Flex w='full' justify='space-between' height='71px' align='center' p='10px'>
          <Avatar src={user?.avatar} name={user?.fullName} />
          <Stack maxWidth='30vw' direction='row' align='center'>
            <IconButton
              aria-label='Home'
              icon={<Icon as={IoHome} />}
              onClick={() => {
                router.push('/');
              }}
              isRound
            />
            <IconButton
              aria-label='Sign Out'
              icon={<Icon as={IoLogOut} />}
              // onClick={handleLogOut}
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
          <Button w='full'>Create Group Chat</Button>
        </Stack>
        <Stack direction='row' align='center' p='10px'>
          <Flex w='full'>
            <Input w='full' placeholder='Search chat name, group chat, etc.' />
            <IconButton aria-label='search' icon={<Icon as={IoSearchSharp} />} />
          </Flex>
        </Stack>
      </Flex>
      <Stack w='full' p='10px' direction='column' overflow='scroll'>
        <Tabs isFitted colorScheme='pink' height='100vh'>
          <TabList>
            <Tab fontSize='xs'>All Friends</Tab>
            <Tab fontSize='xs'>Single Chats</Tab>
            <Tab fontSize='xs'>Group Chats</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box>
                {friends.data?.pages[0].data.content.length === 0 ? (
                  <Text py='2'>Không có bạn bè nào</Text>
                ) : (
                  friends.data?.pages.map((page) =>
                    page.data.content.map((item: IFriendResponse, index: number) => <SingleChat data={item} key={index} />)
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
                  Load more
                </Button>
              </Center>
            </TabPanel>
            <TabPanel>No conversation</TabPanel>
            <TabPanel>
              <p>This functionality is not currently available</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Flex>
  );
}
