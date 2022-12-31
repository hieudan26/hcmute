import { useColorModeValue } from '@chakra-ui/react';
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
  Spinner,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import InfiniteScroll from 'react-infinite-scroller';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import { useCUDPost, usePosts, usePostsByTypeAndUserId } from '../../../../hooks/queries/posts';
import { useAppSelector } from '../../../../hooks/redux';
import { IPostRequestModel, IPostRequestModelLoading, IPostResponseModel } from '../../../../models/post/post.model';
import { ArrayTenTemp } from '../../../../pages/experiences';
import postService from '../../../../services/post/post.service';
import { defaultAvatar } from '../../../../utils';
import { LocalUtils } from '../../../../utils/local.utils';
import AboutPost from './AboutPost/index.component';
import CreatePost from './CreatePost/index.component';
import CreateNewPost from './Modals/CreateNewPost/index.component';
import PostRender from './PostRender/index.component';
import { useTranslation } from 'next-i18next';
import { v4 as uuidv4 } from 'uuid';

export interface IPostsProps {}

export default function Posts(props: IPostsProps) {
  const { t } = useTranslation('profile');
  const [typePost, setTypePost] = useState<'experience' | 'faq'>('experience');
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [fullname, setFullname] = useState<string>('username');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userIdQuery, setUserIdQuery] = useState<string>('');
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const auth = useAppSelector((state) => state.auth.value);
  const router = useRouter();
  const posts = usePostsByTypeAndUserId({
    type: typePost,
    userId: userIdQuery,
    sortBy: 'time',
    sortType: 'DESC',
    pageNumber: 0,
    pageSize: 10,
  });
  const { mutationCreatePost } = useCUDPost();
  const bgLayout = useColorModeValue('white', 'backgroundBox.primary_darkMode');

  useEffect(() => {
    const { userId: userIdq } = router.query;
    if (userIdq) {
      const tempCp = userIdq as string;
      setUserIdQuery(tempCp);
      if (isLoggedIn) {
        const curUserId = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
        if (tempCp === curUserId) {
          setIsCurrentUser(true);
        } else {
          setIsCurrentUser(false);
        }

        if (curUserId) {
          setCurrentUserId(curUserId);
        }
      } else {
        setIsCurrentUser(false);
      }
    } else {
      setIsCurrentUser(false);
    }
  }, [isLoggedIn, router.query]);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_LOGGED_IN) ? true : false;
    const avatar = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    const fullname = LocalUtils.getLocalStorage(LocalStorageConstants.FULL_NAME);

    setIsLoggedIn(isLoggedInCookie);
    if (avatar) setAvatar(avatar);
    if (fullname) setFullname(fullname);
  }, []);

  useEffect(() => {
    if (isCurrentUser && auth?.avatar) {
      setAvatar(auth.avatar);
    }
  }, [isCurrentUser, auth]);

  const _submitPost = async (params: IPostRequestModel) => {
    const paramsLoading: IPostRequestModelLoading = { ...params, setSubmitting: undefined };
    mutationCreatePost.mutate(paramsLoading);
  };

  return (
    <>
      <Flex gap='5' minW='6xl' minH='300px'>
        <Box width='40%'>
          <AboutPost />
        </Box>
        <Box width='60%'>
          {isCurrentUser && (
            <>
              <Tabs
                py='5'
                px='8'
                isFitted
                zIndex='5'
                isManual
                colorScheme='pink'
                variant='unstyled'
                bg={bgLayout}
                rounded='lg'
                shadow='md'
              >
                <TabList>
                  <Tab
                    zIndex='5'
                    onClick={() => {
                      setTypePost('experience');
                    }}
                    _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
                    _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
                  >
                    {t('tabpost.create.tabExperience')}
                  </Tab>
                  <Tab
                    zIndex='5'
                    onClick={() => {
                      setTypePost('faq');
                    }}
                    _hover={{ bg: '#F8B5C1', color: '#0000008a' }}
                    _selected={{ borderBottom: '2px', borderColor: '#D0637C' }}
                  >
                    {t('tabpost.create.tabFaqs')}
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px='4'>
                    <CreatePost
                      avatar={avatar}
                      fullname={fullname}
                      onCreate={() => {
                        setIsCreatePost(true);
                      }}
                    />
                  </TabPanel>
                  <TabPanel px='4'>
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
                currentUserId={currentUserId}
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

          <InfiniteScroll
            loadMore={() => posts.fetchNextPage()}
            hasMore={posts.hasNextPage}
            loader={
              <Center key={0}>
                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
              </Center>
            }
          >
            {posts.data
              ? posts.data.pages.map((page) =>
                  page.data.content.map((item: IPostResponseModel, index: number) => (
                    <PostRender key={`profile-${uuidv4()}-${item.id}-${index}}`} post={item} currentUserId={currentUserId} />
                  ))
                )
              : ArrayTenTemp.map((item, index) => (
                  <>
                    <Box key={`boxfaq-${index}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                      <SkeletonCircle key={`skcfaq-${index}`} size='10' />
                      <SkeletonText key={`sktfaq-${index}`} my='4' noOfLines={4} spacing='4' />
                      <Skeleton key={`skfaq-${index}`} h='xs'></Skeleton>
                    </Box>
                  </>
                ))}
          </InfiniteScroll>
        </Box>
      </Flex>
    </>
  );
}
