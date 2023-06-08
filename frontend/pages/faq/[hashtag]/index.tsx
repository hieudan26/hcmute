import { Box, Center, Flex, Skeleton, SkeletonCircle, SkeletonText, Spacer, Spinner, useColorModeValue } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { v4 as uuidv4 } from 'uuid';
import CreatePost from '../../../components/views/Profile/Posts/CreatePost/index.component';
import CreateNewPost from '../../../components/views/Profile/Posts/Modals/CreateNewPost/index.component';
import PostRender from '../../../components/views/Profile/Posts/PostRender/index.component';
import { RoleConstants } from '../../../constants/roles.constant';
import { CookieConstants, LocalStorageConstants } from '../../../constants/store.constant';
import { useCUDPost, usePostsByTypeAndHashTag } from '../../../hooks/queries/posts';
import { useAppSelector } from '../../../hooks/redux';
import { IPostRequestModel, IPostRequestModelLoading, IPostResponseModel } from '../../../models/post/post.model';
import { defaultAvatar, timeRefreshDataTenSeconds } from '../../../utils';
import { LocalUtils } from '../../../utils/local.utils';
import { ArrayTenTemp } from '../../experiences';
import { useQueryClient } from '@tanstack/react-query';

export interface IFaqHashtagProps {}

const FaqHashtag: NextPage = (props: IFaqHashtagProps) => {
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const auth = useAppSelector((state) => state.auth.value);
  const posts = usePostsByTypeAndHashTag({
    pagination: { pageNumber: 0, pageSize: 12, sortBy: 'time', sortType: 'DESC' },
    hashTags: ['#vietnam'],
    type: 'faq',
    isDeleted: false,
  });
  const { mutationCreatePost } = useCUDPost();
  const bgCreatePost = useColorModeValue('white', 'backgroundBox.primary_darkMode');
  const modalRef = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!modalRef.current) {
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
      }
    }, timeRefreshDataTenSeconds);

    return () => clearInterval(interval);
  }, [queryClient, modalRef]);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const avatarLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    const userIdLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);

    if (userIdLocalStorage) {
      if (auth?.role === RoleConstants.USER) {
        setCurrentUserId(userIdLocalStorage);
        setIsLoggedIn(isLoggedInCookie);
      }
    }

    if (isLoggedInCookie && avatarLocalStorage) {
      setAvatar(avatarLocalStorage);
    }
  }, [auth]);

  const _submitPost = async (params: IPostRequestModel) => {
    const paramsLoading: IPostRequestModelLoading = { ...params, setSubmitting: undefined };
    await mutationCreatePost.mutateAsync(paramsLoading);
  };

  return (
    <>
      <CreateNewPost
        currentUserId={currentUserId}
        onSubmit={_submitPost}
        type='faq'
        isOpen={isCreatePost}
        onClose={() => setIsCreatePost(false)}
      />
      <Flex justify='center' width={{ base: '100%', lg: '60%' }} direction='column'>
        {isLoggedIn && (
          <>
            <Box bg={bgCreatePost} width='100%' px='4' rounded='lg' shadow='md' py='5'>
              <CreatePost
                avatar={avatar}
                onCreate={() => {
                  modalRef.current = true;
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
            <Center key={0}>
              <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
            </Center>
          }
        >
          {posts.data
            ? posts.data.pages.map((page) =>
                page.data.content.map((item: IPostResponseModel, index: number) => (
                  <PostRender
                    modalRef={modalRef}
                    isHashtag
                    key={`faqhash-${uuidv4()}-${item.id}-${index}}`}
                    post={item}
                    currentUserId={currentUserId}
                  />
                ))
              )
            : ArrayTenTemp.map((item, index) => (
                <>
                  <Box key={`boxfaqhash-${index}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                    <SkeletonCircle key={`skcfaqhash-${index}`} size='10' />
                    <SkeletonText key={`sktfaqhash-${index}`} my='4' noOfLines={4} spacing='4' />
                    <Skeleton key={`skfaqhash-${index}`} h='xs'></Skeleton>
                  </Box>
                </>
              ))}

          {posts.isFetching &&
            ArrayTenTemp.map((item, index) => (
              <>
                <Box key={`boxfaqhashft-${index}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                  <SkeletonCircle size='10' />
                  <SkeletonText my='4' noOfLines={4} spacing='4' />
                  <Skeleton h='xs'></Skeleton>
                </Box>
              </>
            ))}
        </InfiniteScroll>
      </Flex>
    </>
  );
};

export default FaqHashtag;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'header',
        'footer',
        'modal_is_first_login',
        'weather',
        'modal_create_post',
        'post',
      ])),
      // Will be passed to the page component as props
    },
  };
};
