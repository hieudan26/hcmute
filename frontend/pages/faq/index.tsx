import { Box, Center, Flex, Spacer, Spinner } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import CreatePost from '../../components/views/Profile/Posts/CreatePost/index.component';
import CreateNewPost from '../../components/views/Profile/Posts/Modals/CreateNewPost/index.component';
import PostRender from '../../components/views/Profile/Posts/PostRender/index.component';
import Weather from '../../components/views/Profile/Posts/Weather/index.component';
import { CookieConstants, LocalStorageConstants } from '../../constants/store.constant';
import { useCUDPost, usePostsByType } from '../../hooks/queries/posts';
import { IPostRequestModel, IPostRequestModelLoading, IPostResponseModel } from '../../models/post/post.model';
import { defaultAvatar } from '../../utils';
import { LocalUtils } from '../../utils/local.utils';

export interface IFAQProps {}

const FAQ: NextPage = (props: IFAQProps) => {
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const posts = usePostsByType({
    type: 'faq',
    sortBy: 'time',
    sortType: 'DESC',
    pageNumber: 0,
    pageSize: 10,
  });
  const { mutationCreatePost } = useCUDPost();

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const avatarLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    const userIdLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);

    if (userIdLocalStorage) {
      setCurrentUserId(userIdLocalStorage);
    }

    setIsLoggedIn(isLoggedInCookie);

    if (isLoggedInCookie && avatarLocalStorage) {
      setAvatar(avatarLocalStorage);
    }
  }, []);

  const _submitPost = async (params: IPostRequestModel) => {
    const paramsLoading: IPostRequestModelLoading = { ...params, setSubmitting: undefined };
    mutationCreatePost.mutate(paramsLoading);
  };

  return (
    <Flex gap='6' w='100%'>
      <CreateNewPost
        currentUserId={currentUserId}
        onSubmit={_submitPost}
        type='faq'
        isOpen={isCreatePost}
        onClose={() => setIsCreatePost(false)}
      />
      <Box mr='6' width='40%'>
        <Weather />
      </Box>
      <Flex position='relative' justify='center' width='60%' direction='column'>
        {isLoggedIn && (
          <>
            <Box bg='white' width='100%' px='4' rounded='lg' shadow='md' py='5'>
              <CreatePost
                avatar={avatar}
                onCreate={() => {
                  setIsCreatePost(true);
                }}
              />
            </Box>
            <Spacer h='7' my='1'>
              <Center color='gray.300'>---</Center>
            </Spacer>
          </>
        )}

        <InfiniteScroll
          loadMore={() => posts.fetchNextPage()}
          hasMore={posts.hasNextPage}
          loader={
            <Center>
              <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
            </Center>
          }
        >
          {posts.data?.pages.map((page) =>
            page.data.content.map((item: IPostResponseModel, index: number) => (
              <PostRender key={index} post={item} currentUserId={currentUserId} />
            ))
          )}
        </InfiniteScroll>
      </Flex>
    </Flex>
  );
};

export default FAQ;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
