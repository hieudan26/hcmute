import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Highlight,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import { defaultAvatar } from '../../../../utils';
import { LocalUtils } from '../../../../utils/local.utils';
import AboutPost from './AboutPost/index.component';
import CreatePost from './CreatePost/index.component';
import CreateNewPost from './Modals/CreateNewPost/index.component';

export interface IPostsProps {}

export default function Posts(props: IPostsProps) {
  const [typePost, setTypePost] = useState<'experience' | 'faq'>('experience');
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [fullname, setFullname] = useState<string>('username');
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      const { userId: userIdq } = router.query;
      if (userIdq) {
        const tempCp = userIdq as string;
        const curUserId = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
        if (tempCp === curUserId) {
          setIsCurrentUser(true);
        } else {
          setIsCurrentUser(false);
        }
      } else {
        setIsCurrentUser(false);
      }
    }
  }, [isLoggedIn, router.query]);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const avatar = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    const fullname = LocalUtils.getLocalStorage(LocalStorageConstants.FULL_NAME);

    setIsLoggedIn(isLoggedInCookie);
    if (avatar) setAvatar(avatar);
    if (fullname) setFullname(fullname);
  }, []);

  const _submitPost = async (params: any) => {
    console.log(params);
  };

  return (
    <>
      <Flex gap='4' minW='6xl' minH='300px' overflow='hidden'>
        <AboutPost />
        <Box width='60%'>
          {isCurrentUser && (
            <>
              <Tabs
                py='5'
                px='8'
                isFitted
                zIndex='auto'
                isManual
                colorScheme='pink'
                variant='unstyled'
                bg='white'
                rounded='lg'
                shadow='md'
              >
                <TabList>
                  <Tab
                    onClick={() => {
                      setTypePost('experience');
                    }}
                    _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
                    _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
                  >
                    Experiences
                  </Tab>
                  <Tab
                    onClick={() => {
                      setTypePost('faq');
                    }}
                    _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
                    _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
                  >
                    FAQs
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel zIndex='auto' px='4'>
                    <CreatePost
                      avatar={avatar}
                      fullname={fullname}
                      onCreate={() => {
                        setIsCreatePost(true);
                      }}
                    />
                  </TabPanel>
                  <TabPanel zIndex='auto' px='4'>
                    <CreatePost
                      avatar={avatar}
                      fullname={fullname}
                      onCreate={() => {
                        setIsCreatePost(true);
                      }}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <CreateNewPost
                onSubmit={_submitPost}
                type={typePost}
                isOpen={isCreatePost}
                onClose={() => setIsCreatePost(false)}
              />

              <Spacer h='7'>
                <Center color='gray.300'>---</Center>
              </Spacer>
            </>
          )}

          <Box bg='white' rounded='lg' mb='5' px='4' shadow='md' h='36'></Box>
          <Box bg='white' rounded='lg' mb='5' px='4' shadow='md' h='36'></Box>
          <Box bg='white' rounded='lg' mb='5' px='4' shadow='md' h='36'></Box>
          <Box bg='white' rounded='lg' mb='5' px='4' shadow='md' h='36'></Box>
          <Box bg='white' rounded='lg' mb='5' px='4' shadow='md' h='36'></Box>
          <Box bg='white' rounded='lg' mb='5' px='4' shadow='md' h='36'></Box>
        </Box>
      </Flex>
    </>
  );
}
