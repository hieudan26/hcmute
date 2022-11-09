import {
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  ModalFooter,
  Center,
  Spacer,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { BiCommentDetail } from 'react-icons/bi';
import { Carousel } from 'react-responsive-carousel';
import ModalContainer from '../../../../Modals/ModalContainer/index.component';
import { defaultAvatar, formatTimePost, timeSincePost } from '../../../../../../utils';
import CommentRender from '../../CommentRender/index.component';
import TreeCommentRender from '../../TreeCommentRender/index.component';
import CommentForm from './CommentForm/index.component';
import { IPostRequestModel, IPostRequestModelPostId, IPostResponseModel } from '../../../../../../models/post/post.model';
import { useCommentsPost, useCUDComment } from '../../../../../../hooks/queries/comment';
import { ICommentsPostResponse } from '../../../../../../models/comment/comment.model';
import InfiniteScroll from 'react-infinite-scroller';
import { useCUDPost } from '../../../../../../hooks/queries/posts';
import { toggleMessage } from '../../../../Message/index.component';
import UpdatePost from '../UpdatePost/index.component';

export interface IModalDetailPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPostResponseModel;
  currentUserId: string;
}

export default function ModalDetailPost(props: IModalDetailPostProps) {
  const { isOpen, onClose, post, currentUserId } = props;
  const commentsEndRef = useRef<null | HTMLDivElement>(null);
  const commentInputRef = useRef<null | HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');
  const commentsPost = useCommentsPost({ postId: post.id, pageNumber: 0, pageSize: 5, sortBy: 'time', sortType: 'DESC' }, isOpen);
  const { mutationCreateComment } = useCUDComment();
  const { mutationReactPost, mutationUpdatePost, mutationDeletePost } = useCUDPost();

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
      await mutationCreateComment.mutateAsync({
        content: value,
        postId: Number(post.id),
        time: formatTimePost(new Date()),
        setSubmitting: setIsSubmitting,
      });
      if (!isSubmitting) {
        scrollToBottom();
      }
    }
  };

  const reactPost = () => {
    if (currentUserId === '') {
      toggleMessage({
        title: 'Authentication/Authorization',
        message: 'You must login first',
        type: 'warning',
      });
    } else {
      mutationReactPost.mutate(post.id);
    }
  };

  const _submitEditPost = async (params: IPostRequestModel) => {
    const paramsPostId: IPostRequestModelPostId = { ...params, postId: post.id };
    mutationUpdatePost.mutate(paramsPostId);
  };

  const copyLink = () => {
    var linkComment = 'http://localhost:3000';
    if (process.env.NODE_ENV === 'development') {
      linkComment = `${linkComment}/detail-post/${post.id}`;
    } else {
      linkComment = 'https://lumiere.hcmute.me';
      linkComment = `${linkComment}/detail-post/${post.id}`;
    }

    navigator.clipboard.writeText(linkComment);
    toggleMessage({
      message: 'Copy link post successfully',
      type: 'info',
    });
  };

  return (
    <>
      {/* <UpdatePost
        currentUserId={currentUserId}
        post={post}
        type={post.type === 'experience' ? 'experience' : 'faq'}
        isOpen={isOpenEdit}
        onClose={() => {
          setIsOpenEdit(false);
        }}
        onSubmit={_submitEditPost}
      /> */}
      <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
        <ModalContent bg={bgModalContent} pb='0' width='2xl'>
          <ModalHeader fontWeight={700} textAlign={'center'}>
            {post.fullName}&apos;s Post
          </ModalHeader>
          <Divider />
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <Box overflowY='auto' minH='60vh' maxH='60vh'>
              <Flex justify='space-between' align='center' px='4' py='2'>
                <Flex gap='2' align='center'>
                  <Box position='relative'>
                    <Image src={post.avatar} alt='Profile picture' w='10' h='10' rounded='full' />
                    <span className='bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2'></span>
                  </Box>
                  <Box>
                    <Box fontWeight='semibold'>{post.fullName}</Box>
                    <Text fontSize='sm' color='gray.500'>
                      {timeSincePost(post.time)}
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
                      {/* <MenuItem hidden={currentUserId !== post.userId}>Edit</MenuItem> */}
                      <MenuItem hidden={currentUserId !== post.userId}>Delete</MenuItem>
                      <MenuItem onClick={copyLink}>Copy link</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>

              <Text textAlign='justify' px='4' py='2'>
                {post.content}
              </Text>

              {post.images.length > 0 && (
                <Box px='4' py='2' h='xs'>
                  <Carousel infiniteLoop showArrows centerMode={post.images.length > 1} showThumbs={false}>
                    {post.images.map((item, index) => (
                      <Image w='3xs' h='xs' key={index} src={item} alt={item} />
                    ))}
                  </Carousel>
                </Box>
              )}

              <Box px='4' py='2' pt='6'>
                <Flex align='center' justify='space-between'>
                  <Flex direction='row-reverse' align='center'>
                    <Text fontSize='xs' ml='2' color='gray.500'>
                      {post.reactNumber}
                    </Text>
                    <Icon color='#D0637C' fontSize='xl' as={AiFillHeart} />
                  </Flex>
                  <Box fontSize='xs' color='gray.500'>
                    <Text>{post.commentNumber} comments</Text>
                  </Box>
                </Flex>
              </Box>

              <div ref={commentsEndRef} />
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
                      color={post.isReacted ? '#D0637C' : 'gray.500'}
                      onClick={reactPost}
                    >
                      <Icon as={AiFillHeart} />
                      &nbsp;
                      <Text fontSize='md'>Love</Text>
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
                      onClick={() => {
                        commentInputRef.current?.focus();
                      }}
                    >
                      <Icon color='#D0637C' as={BiCommentDetail} />
                      &nbsp;
                      <Text fontSize='md'>Comment</Text>
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
            </Box>
            <ModalFooter bg='gray.50' rounded='md' justifyContent={currentUserId === '' ? 'center' : 'flex-start'}>
              {currentUserId === '' ? (
                <Text>You must login to comment this post</Text>
              ) : (
                <CommentForm isSubmitting={isSubmitting} _onSumbit={onSubmitComment} _ref={commentInputRef} />
              )}
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
