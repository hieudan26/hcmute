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
import ConfirmDeletePost from '../ConfirmDeletePost/index.component';
import { useTranslation } from 'next-i18next';
import { Prose } from '@nikolovlazar/chakra-ui-prose';

export interface IModalDetailPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPostResponseModel;
  currentUserId: string;
  deletePostInDetail?: () => void;
}

export default function ModalDetailPost(props: IModalDetailPostProps) {
  const { isOpen, onClose, post, currentUserId, deletePostInDetail } = props;
  const { t } = useTranslation('post');
  const commentsEndRef = useRef<null | HTMLDivElement>(null);
  const commentInputRef = useRef<null | HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');
  const commentsPost = useCommentsPost({ postId: post.id, pageNumber: 0, pageSize: 5, sortBy: 'time', sortType: 'DESC' }, isOpen);
  const { mutationCreateComment } = useCUDComment();
  const { mutationReactPost, mutationUpdatePost, mutationDeletePost } = useCUDPost();
  const bgForm = useColorModeValue('gray.50', 'header.primary_darkMode');

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
      <ConfirmDeletePost
        title={t('title_delete')}
        content={t('content_delete')}
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onSubmit={() => {
          mutationDeletePost.mutate(post.id);
          deletePostInDetail && deletePostInDetail();
          setIsOpenDelete(false);
        }}
      />
      <UpdatePost
        currentUserId={currentUserId}
        post={post}
        type={post.type === 'experience' ? 'experience' : 'faq'}
        isOpen={isOpenEdit}
        onClose={() => {
          setIsOpenEdit(false);
        }}
        onSubmit={_submitEditPost}
      />
      <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
        <ModalContent bg={bgModalContent} pb='0' width='2xl'>
          <ModalHeader fontWeight={700} textAlign={'center'}>
            {/* {post.fullName}&apos;s Post */}
            {post.title}
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
                      <MenuItem
                        hidden={currentUserId !== post.userId}
                        onClick={() => {
                          setIsOpenEdit(true);
                        }}
                      >
                        {t('options.Edit')}
                      </MenuItem>
                      <MenuItem
                        hidden={currentUserId !== post.userId}
                        onClick={() => {
                          setIsOpenDelete(true);
                        }}
                      >
                        {t('options.Delete')}
                      </MenuItem>
                      <MenuItem onClick={copyLink}>{t('options.Link')}</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>

              <Box textAlign='justify' px='4' py='2'>
                <Prose dangerouslySetInnerHTML={{ __html: post.content }} />
              </Box>

              {post.hashTags && post.hashTags.length > 0 && (
                <Flex direction='row' gap='2' px='4' mb='2'>
                  {post.hashTags.map((item: string, index: number) => (
                    <Text
                      color='pink.700'
                      as='i'
                      key={`hstdetail-${post.id}-${index}`}
                      cursor='pointer'
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {item}
                    </Text>
                  ))}
                </Flex>
              )}

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
                    <Text>
                      {post.commentNumber} {t('quality_comment')}
                    </Text>
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
                      <Text fontSize='md'>{t('love')}</Text>
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
                      <Text fontSize='md'>{t('comment')}</Text>
                    </Flex>
                  </Flex>
                </Box>
              </Box>

              <Box>
                {commentsPost.data?.pages[0].data.content.length === 0 ? (
                  <Center py='2'>
                    <Text>{t('no_comment')}</Text>
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
                    {t('load_more')}
                  </Button>
                </Center>
              </Box>
            </Box>
            <ModalFooter bg={bgForm} rounded='md' justifyContent={currentUserId === '' ? 'center' : 'flex-start'}>
              {currentUserId === '' ? (
                <Text>{t('warn_auth')}</Text>
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
