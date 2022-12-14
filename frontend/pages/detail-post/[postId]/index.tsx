import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toggleMessage } from '../../../components/views/Message/index.component';
import UpdatePost from '../../../components/views/Profile/Posts/Modals/UpdatePost/index.component';
import TreeCommentRender from '../../../components/views/Profile/Posts/TreeCommentRender/index.component';
import { RoleConstants } from '../../../constants/roles.constant';
import { CookieConstants, LocalStorageConstants } from '../../../constants/store.constant';
import { useCommentsPost, useCUDComment } from '../../../hooks/queries/comment';
import { useCUDPost, usePostsById } from '../../../hooks/queries/posts';
import { useAppSelector } from '../../../hooks/redux';
import { ICommentsPostResponse } from '../../../models/comment/comment.model';
import { IPostRequestModel, IPostRequestModelPostId, IPostResponseModel } from '../../../models/post/post.model';
import postService from '../../../services/post/post.service';
import { defaultAvatar, formatTimePost, timeSincePost } from '../../../utils';
import { LocalUtils } from '../../../utils/local.utils';
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from '@tanstack/react-query';
import { BiCommentDetail } from 'react-icons/bi';
import ConfirmDeletePost from '../../../components/views/Profile/Posts/Modals/ConfirmDeletePost/index.component';
import CommentForm from '../../../components/views/Profile/Posts/Modals/ModalDetailPost/CommentForm/index.component';

export interface IDetailPostProps {
  post: IPostResponseModel;
}

const DetailPost: NextPage<IDetailPostProps> = (props) => {
  const router = useRouter();
  const commentsEndRef = useRef<null | HTMLDivElement>(null);
  const commentInputRef = useRef<null | HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [id, setId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dataPost, setDataPost] = useState<IPostResponseModel | undefined>(undefined);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const auth = useAppSelector((state) => state.auth.value);
  const postFetch = usePostsById(id ? id : '', undefined, id !== undefined);
  const { mutationReactPost, mutationUpdatePost, mutationDeletePost } = useCUDPost();
  const { mutationCreateComment } = useCUDComment();
  const commentsPost = useCommentsPost(
    { postId: id ? id : '1', pageNumber: 0, pageSize: 10, sortBy: 'time', sortType: 'DESC' },
    postFetch.data !== undefined
  );

  useEffect(() => {
    if (postFetch.data) {
      setDataPost(postFetch.data.data as IPostResponseModel);
    }
  }, [postFetch]);

  useEffect(() => {
    if (postFetch.data && postFetch.data.isSuccess === undefined) {
      router.push('/404');
    }
  }, [postFetch.data, router]);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const userIdLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);

    if (userIdLocalStorage) {
      if (auth?.role === RoleConstants.USER) {
        setCurrentUserId(userIdLocalStorage);
        setIsLoggedIn(isLoggedInCookie);
      }
    }
  }, [auth]);

  useEffect(() => {
    const { postId } = router.query;
    if (postId) {
      setId(postId as string);
    }
  }, [router.query]);

  const copyLink = () => {
    var linkComment = 'http://localhost:3000';
    if (process.env.NODE_ENV === 'development') {
      linkComment = `${linkComment}/detail-post/${id}`;
    } else {
      linkComment = 'https://lumiere.hcmute.me';
      linkComment = `${linkComment}/detail-post/${id}`;
    }

    navigator.clipboard.writeText(linkComment);
    toggleMessage({
      message: 'Copy link post successfully',
      type: 'info',
    });
  };

  const _submitEditPost = async (params: IPostRequestModel) => {
    const paramsPostId: IPostRequestModelPostId = { ...params, postId: id ? id : '1' };
    mutationUpdatePost.mutate(paramsPostId);
    setIsOpenEdit(false);
  };

  const reactPost = () => {
    if (currentUserId === '') {
      toggleMessage({
        title: 'Authentication/Authorization',
        message: 'You must login first',
        type: 'warning',
      });
    } else {
      if (id) {
        mutationReactPost.mutate(id);
      }
    }
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmitComment = async (value: string) => {
    if (currentUserId === '') {
      if (commentInputRef.current && commentInputRef.current.value) {
        commentInputRef.current.value = '';
      }
      toggleMessage({
        title: 'Authentication/Authorization',
        message: 'You must login first',
        type: 'warning',
      });
    } else {
      if (id) {
        await mutationCreateComment.mutateAsync({
          content: value,
          postId: Number(id),
          time: formatTimePost(new Date()),
          setSubmitting: setIsSubmitting,
        });
        if (!isSubmitting) {
          scrollToBottom();
        }
      }
    }
  };

  return (
    <Box width='80%' bg='white' rounded='lg' mb='5' px='4' shadow='md' overflow='scroll'>
      {dataPost && (
        <UpdatePost
          currentUserId={currentUserId}
          post={dataPost}
          type={dataPost.type === 'experience' ? 'experience' : 'faq'}
          isOpen={isOpenEdit}
          onClose={() => {
            setIsOpenEdit(false);
          }}
          onSubmit={_submitEditPost}
        />
      )}
      <ConfirmDeletePost
        title='Confirm Delete Post'
        content='Do you want to delete post'
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onSubmit={() => {
          if (id) {
            mutationDeletePost.mutate(id);
            router.push('/experiences');
          }
        }}
      />
      <Flex justify='space-between' align='center' px='4' py='2'>
        <Flex gap='2' align='center'>
          <Box position='relative'>
            <Image src={dataPost?.avatar} alt='Profile picture' w='10' h='10' rounded='full' />
            <span className='bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2'></span>
          </Box>
          <Box>
            <Box fontWeight='semibold'>{dataPost?.fullName}</Box>
            <Text fontSize='sm' color='gray.500'>
              {dataPost && timeSincePost(dataPost.time)}
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Menu closeOnSelect>
            <MenuButton
              transition='all 0.2s'
              as={IconButton}
              aria-label='Options'
              variant='outline'
              border='none'
              fontSize='md'
              icon={<Icon as={HiOutlineDotsHorizontal} />}
            />
            <MenuList minW='32'>
              <MenuItem onClick={() => setIsOpenEdit(true)} hidden={dataPost && currentUserId !== dataPost.userId}>
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsOpenDelete(true);
                }}
                hidden={dataPost && currentUserId !== dataPost.userId}
              >
                Delete
              </MenuItem>
              <MenuItem onClick={copyLink}>Copy link</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Text textAlign='justify' px='4' py='2'>
        {dataPost?.content}
      </Text>

      {dataPost && dataPost.hashTags && dataPost.hashTags.length > 0 && (
        <Flex direction='row' gap='2' px='4' mt='2'>
          {dataPost.hashTags.map((item: string, index: number) => (
            <Text
              color='pink.700'
              as='i'
              key={`hs-${dataPost.id}-${index}-${uuidv4()}`}
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
            >
              {item}
            </Text>
          ))}
        </Flex>
      )}

      {dataPost && dataPost.images.length > 0 && (
        <Box px='4' py='2' h='md'>
          <Carousel infiniteLoop showArrows centerMode={dataPost.images.length > 1} showThumbs={false}>
            {dataPost.images.map((item: string, index: number) => (
              <Image w='3xs' h='md' key={index} src={item} alt={item} />
            ))}
          </Carousel>
        </Box>
      )}

      <Box px='4' py='2'>
        <Box border='1px' borderColor='gray.200' borderX='0' py='1'>
          <Flex gap='2' fontSize='xs' width='100%'>
            <Flex
              w='100%'
              justify='center'
              align='center'
              bg='transparent'
              _hover={{ bg: 'gray.100' }}
              py='2'
              cursor='pointer'
              rounded='lg'
              color={dataPost?.isReacted ? '#D0637C' : 'gray.500'}
              onClick={reactPost}
            >
              <Icon as={AiFillHeart} />
              &nbsp;
              <Text fontSize='md'>{dataPost?.reactNumber} Love</Text>
            </Flex>
            <Flex
              w='100%'
              justify='center'
              align='center'
              bg='transparent'
              _hover={{ bg: 'gray.100' }}
              py='2'
              cursor='pointer'
              rounded='lg'
              color='gray.500'
            >
              <Icon color='#D0637C' as={BiCommentDetail} />
              &nbsp;
              <Text fontSize='md'>{dataPost?.commentNumber} Comment</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Box>
        {commentsPost.data?.pages[0].data.content.length === 0 ? (
          <Center py='2'>
            <Text>Không có bình luận nào</Text>
          </Center>
        ) : (
          commentsPost.data?.pages.map((page) =>
            page.data.content.map((item: ICommentsPostResponse, index: number) => (
              <>
                <TreeCommentRender key={`${item.id}-${index}`} commentsPost={item} currentUserId={currentUserId} />
                <Center key={`${item.id}-${index}-ce`} px='8'>
                  <Divider key={`${item.id}-${index}-di`} orientation='horizontal' />
                </Center>
                <Spacer key={`${item.id}-${index}-sp`} h='5' />
              </>
            ))
          )
        )}
        <Center hidden={!commentsPost.hasNextPage}>
          <Button
            bg='transparent'
            variant='link'
            onClick={() => {
              commentsPost.fetchNextPage();
            }}
          >
            Load more
          </Button>
        </Center>
      </Box>

      {currentUserId !== '' && <CommentForm isSubmitting={isSubmitting} _onSumbit={onSubmitComment} _ref={commentInputRef} />}
    </Box>
  );
};

export default DetailPost;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }: any) => {
  // const { postId } = params;
  // const response = await postService.getPostById(postId);
  // console.log(response);
  // var post = undefined;
  // if (response.isSuccess) {
  //   post = response.data;
  // } else {
  //   // in the current page, with the 404 http status code.
  //   // this will display your /pages/404.js error page,
  //   return { notFound: true };
  // }

  // if (post && post.isDeleted) {
  //   return { notFound: true };
  // }

  return {
    props: {
      // post,
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
