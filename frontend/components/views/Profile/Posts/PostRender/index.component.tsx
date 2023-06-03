import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Prose } from '@nikolovlazar/chakra-ui-prose';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { Carousel } from 'react-responsive-carousel';
import { useCUDPost, usePostsById } from '../../../../../hooks/queries/posts';
import { IPostRequestModel, IPostRequestModelPostId, IPostResponseModel } from '../../../../../models/post/post.model';
import { timeSincePost, uppercaseFirstLetter } from '../../../../../utils';
import ImageBox from '../../../ImageBox/index.component';
import { toggleMessage } from '../../../Message/index.component';
import ModalContainer from '../../../Modals/ModalContainer/index.component';
import QueryHashtagModal from '../../../Modals/QueryHashtagModal/index.component';
import ConfirmDeletePost from '../Modals/ConfirmDeletePost/index.component';
import ModalDetailPost from '../Modals/ModalDetailPost/index.component';
import UpdatePost from '../Modals/UpdatePost/index.component';

export interface IPostRenderProps {
  post: IPostResponseModel;
  currentUserId: string;
  isProfile?: boolean;
  isHashtag?: boolean;
  modalRef?: MutableRefObject<boolean>;
}

export default function PostRender(props: IPostRenderProps) {
  const { post, currentUserId, isProfile = false, isHashtag = false, modalRef } = props;
  const { t } = useTranslation('post');
  const queryClient = useQueryClient();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isOpenHashTag, setIsOpenHashTag] = useState<boolean>(false);
  const [queryHashtag, setQueryHashtag] = useState<string>('#vietnam');
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [idPostDetail, setIdPostDetail] = useState<string>('');
  const postFetch = usePostsById(idPostDetail, undefined, idPostDetail !== '');
  const { mutationReactPost, mutationUpdatePost, mutationDeletePost } = useCUDPost();
  const bgColor = useColorModeValue('white', 'backgroundBox.primary_darkMode');

  const reactPost = async () => {
    if (currentUserId === '') {
      toggleMessage({
        title: 'Authentication/Authorization',
        message: 'You must login first',
        type: 'warning',
      });
    } else {
      await mutationReactPost.mutateAsync(post.id);
      if (isProfile) {
        queryClient.invalidateQueries(['posts_by_type_userId']);
      } else {
        if (isHashtag) {
          queryClient.invalidateQueries(['posts_by_type_hashTag']);
        } else {
          queryClient.invalidateQueries(['posts_by_type']);
        }
      }
    }
  };

  const _submitEditPost = async (params: IPostRequestModel) => {
    const paramsPostId: IPostRequestModelPostId = { ...params, postId: post.id };
    await mutationUpdatePost.mutateAsync(paramsPostId);
    setIsOpenEdit(false);
    closeModal();
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

  const deletePostInDetail = () => {
    setIsOpenDetail(false);
  };

  const closeModal = () => {
    if (modalRef) {
      modalRef.current = false;
    }
    if (isProfile) {
      queryClient.invalidateQueries(['posts_by_type_userId']);
    } else {
      if (isHashtag) {
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
      } else {
        queryClient.invalidateQueries(['posts_by_type']);
      }
    }
  };

  return (
    <Box bg={bgColor} rounded='lg' mb='5' px='4' py='2' shadow='md'>
      <ModalContainer isOpen={modalImage} size='xl'>
        <ModalHeader display='flex' flexDirection='column' alignItems='center'>
          Chi tiết hình ảnh
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            setModalImage(false);
            closeModal();
          }}
        />
        <ModalBody>
          <Carousel infiniteLoop showThumbs={false} showStatus={false} emulateTouch>
            {post.images.map((item, index) => (
              <ImageBox key={index} src={item} alt={item} isDelete={false} />
            ))}
          </Carousel>
        </ModalBody>
      </ModalContainer>
      <QueryHashtagModal
        isOpen={isOpenHashTag}
        query={queryHashtag}
        onClose={() => {
          setIsOpenHashTag(false);
          closeModal();
        }}
      />
      {idPostDetail && postFetch.data && (
        <ModalDetailPost
          currentUserId={currentUserId}
          post={postFetch.data.data as IPostResponseModel}
          isOpen={isOpenDetail}
          onClose={() => {
            setIdPostDetail('');
            setIsOpenDetail(false);
            closeModal();
          }}
          deletePostInDetail={deletePostInDetail}
        />
      )}
      <UpdatePost
        currentUserId={currentUserId}
        post={post}
        type={post.type === 'experience' ? 'experience' : 'faq'}
        isOpen={isOpenEdit}
        onClose={() => {
          setIsOpenEdit(false);
          closeModal();
        }}
        onSubmit={_submitEditPost}
      />
      <ConfirmDeletePost
        title={t('title_delete')}
        content={t('content_delete')}
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
          closeModal();
        }}
        onSubmit={() => {
          mutationDeletePost.mutate(post.id);
          setIsOpenDelete(false);
        }}
      />
      <Heading as='h4' size='md' px='4' py='2'>
        {uppercaseFirstLetter(post.title)}
      </Heading>
      <Flex justify='space-between' align='center' px='4' py='2'>
        <Flex gap='2' align='center'>
          <Link href={`/profile/${post.userId}/about`}>
            <Box position='relative' cursor='pointer'>
              <Image src={post.avatar} alt='Profile picture' w='10' h='10' rounded='full' />
              <span className='bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2'></span>
            </Box>
          </Link>
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
                onClick={() => {
                  setIsOpenEdit(true);
                  if (modalRef) {
                    modalRef.current = true;
                  }
                }}
                hidden={currentUserId !== post.userId}
              >
                {t('options.Edit')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsOpenDelete(true);
                  if (modalRef) {
                    modalRef.current = true;
                  }
                }}
                hidden={currentUserId !== post.userId}
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
        <Flex direction='row' gap='2' px='4' mt='2'>
          {post.hashTags.map((item: string, index: number) => (
            <Text
              fontWeight='semibold'
              color='pink.600'
              as='i'
              key={`hst-${post.id}-${index}`}
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
              onClick={() => {
                setQueryHashtag(item);
                setIsOpenHashTag(true);
              }}
            >
              {item}
            </Text>
          ))}
        </Flex>
      )}

      {post.images.length > 0 && (
        <Box pb='2' pt='6'>
          <Carousel infiniteLoop showThumbs={false} showStatus={false} emulateTouch>
            {post.images.map((item, index) => (
              <Box
                key={index}
                cursor='pointer'
                onClick={() => {
                  setModalImage(true);
                  if (modalRef) {
                    modalRef.current = true;
                  }
                }}
              >
                <ImageBox src={item} alt={item} isDelete={false} />
              </Box>
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
                setIdPostDetail(post.id);
                setIsOpenDetail(true);
                queryClient.invalidateQueries(['post_by_Id']);
                if (modalRef) {
                  modalRef.current = true;
                }
              }}
            >
              <Icon color='#D0637C' as={BiCommentDetail} />
              &nbsp;
              <Text fontSize='md'>{t('comment')}</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
