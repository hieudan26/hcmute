import { Box, Flex, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { BiCommentDetail } from 'react-icons/bi';
import { Carousel } from 'react-responsive-carousel';
import { defaultAvatar, timeSincePost } from '../../../../../utils';
import ModalDetailPost from '../Modals/ModalDetailPost/index.component';
import { IPostRequestModel, IPostRequestModelPostId, IPostResponseModel } from '../../../../../models/post/post.model';
import { useCUDPost } from '../../../../../hooks/queries/posts';
import { toggleMessage } from '../../../Message/index.component';
import UpdatePost from '../Modals/UpdatePost/index.component';
import ConfirmDeletePost from '../Modals/ConfirmDeletePost/index.component';
import Link from 'next/link';
import { useColorModeValue } from '@chakra-ui/react';

export interface IPostRenderProps {
  post: IPostResponseModel;
  currentUserId: string;
}

export default function PostRender(props: IPostRenderProps) {
  const { post, currentUserId } = props;
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const { mutationReactPost, mutationUpdatePost, mutationDeletePost } = useCUDPost();
  const bgColor = useColorModeValue('white', 'backgroundBox.primary_darkMode');

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
    setIsOpenEdit(false);
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

  return (
    <Box bg={bgColor} rounded='lg' mb='5' px='4' py='2' shadow='md'>
      <ModalDetailPost
        currentUserId={currentUserId}
        post={post}
        isOpen={isOpenDetail}
        onClose={() => {
          setIsOpenDetail(false);
        }}
        deletePostInDetail={deletePostInDetail}
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
      <ConfirmDeletePost
        title='Confirm Delete Post'
        content='Do you want to delete post'
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onSubmit={() => {
          mutationDeletePost.mutate(post.id);
          setIsOpenDelete(false);
        }}
      />
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
              <MenuItem onClick={() => setIsOpenEdit(true)} hidden={currentUserId !== post.userId}>
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsOpenDelete(true);
                }}
                hidden={currentUserId !== post.userId}
              >
                Delete
              </MenuItem>
              <MenuItem onClick={copyLink}>Copy link</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Text textAlign='justify' px='4' py='2'>
        {post.content}
      </Text>

      {post.hashTags && post.hashTags.length > 0 && (
        <Flex direction='row' gap='2' px='4' mt='2'>
          {post.hashTags.map((item: string, index: number) => (
            <Text
              color='pink.700'
              as='i'
              key={`hst-${post.id}-${index}`}
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
            <Text>{post.commentNumber} comments</Text>
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
                setIsOpenDetail(true);
              }}
            >
              <Icon color='#D0637C' as={BiCommentDetail} />
              &nbsp;
              <Text fontSize='md'>Comment</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
