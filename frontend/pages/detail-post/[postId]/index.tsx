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
import { AiFillHeart } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toggleMessage } from '../../../components/views/Message/index.component';
import TreeCommentRender from '../../../components/views/Profile/Posts/TreeCommentRender/index.component';
import { useCommentsPost } from '../../../hooks/queries/comment';
import { ICommentsPostResponse } from '../../../models/comment/comment.model';
import { IPostResponseModel } from '../../../models/post/post.model';
import postService from '../../../services/post/post.service';

export interface IDetailPostProps {
  post: IPostResponseModel;
}

const DetailPost: NextPage<IDetailPostProps> = (props) => {
  const { post: dataPost } = props;
  const commentsPost = useCommentsPost(
    { postId: dataPost.id, pageNumber: 0, pageSize: 10, sortBy: 'time', sortType: 'DESC' },
    true
  );

  const copyLink = () => {
    var linkComment = 'http://localhost:3000';
    if (process.env.NODE_ENV === 'development') {
      linkComment = `${linkComment}/detail-post/${dataPost.id}`;
    } else {
      linkComment = 'https://lumiere.hcmute.me';
      linkComment = `${linkComment}/detail-post/${dataPost.id}`;
    }

    navigator.clipboard.writeText(linkComment);
    toggleMessage({
      message: 'Copy link post successfully',
      type: 'info',
    });
  };

  return (
    <Box width='80%' bg='white' rounded='lg' mb='5' px='4' shadow='md' overflow='scroll'>
      {/* <UpdatePost
        currentUserId={currentUserId}
        post={dataPost}
        type={dataPost.type === 'experience' ? 'experience' : 'faq'}
        isOpen={isOpenEdit}
        onClose={() => {
          setIsOpenEdit(false);
        }}
        onSubmit={_submitEditPost}
      /> */}
      {/* <ConfirmDeletePost
        title='Confirm Delete Post'
        content='Do you want to delete post'
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onSubmit={() => {
          mutationDeletePost.mutate(post.id);
        }}
      /> */}
      <Flex justify='space-between' align='center' px='4' py='2'>
        <Flex gap='2' align='center'>
          <Box position='relative'>
            <Image src={dataPost.avatar} alt='Profile picture' w='10' h='10' rounded='full' />
            <span className='bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2'></span>
          </Box>
          <Box>
            <Box fontWeight='semibold'>{dataPost.fullName}</Box>
            <Text fontSize='sm' color='gray.500'>
              {dataPost.time}
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
              {/* <MenuItem onClick={() => setIsOpenEdit(true)} hidden={currentUserId !== dataPost.userId}>
                Edit
              </MenuItem> */}
              {/* <MenuItem
                onClick={() => {
                  setIsOpenDelete(true);
                }}
                hidden={currentUserId !== post.userId}
              >
                Delete
              </MenuItem> */}
              <MenuItem onClick={copyLink}>Copy link</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Text textAlign='justify' px='4' py='2'>
        {dataPost.content}
      </Text>

      {dataPost.images.length > 0 && (
        <Box px='4' py='2' h='md'>
          <Carousel infiniteLoop showArrows centerMode={dataPost.images.length > 1} showThumbs={false}>
            {dataPost.images.map((item, index) => (
              <Image w='3xs' h='md' key={index} src={item} alt={item} />
            ))}
          </Carousel>
        </Box>
      )}

      <Box mx='20' px='4' py='2' pt='6'>
        <Flex align='center' justify='space-between'>
          <Flex direction='row-reverse' align='center'>
            <Text fontSize='md' ml='2' color='gray.500'>
              {dataPost.reactNumber}
            </Text>
            <Icon color='#D0637C' fontSize='xl' as={AiFillHeart} />
          </Flex>
          <Box fontSize='md' color='gray.500'>
            <Text>{dataPost.commentNumber} comments</Text>
          </Box>
        </Flex>
      </Box>

      {/* <Box px='4' py='2'>
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
              color={dataPost.isReacted ? '#D0637C' : 'gray.500'}
              // onClick={reactPost}
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
            >
              <Icon color='#D0637C' as={BiCommentDetail} />
              &nbsp;
              <Text fontSize='md'>Comment</Text>
            </Flex>
          </Flex>
        </Box>
      </Box> */}

      <Box>
        {commentsPost.data?.pages[0].data.content.length === 0 ? (
          <Center py='2'>
            <Text>Không có bình luận nào</Text>
          </Center>
        ) : (
          commentsPost.data?.pages.map((page) =>
            page.data.content.map((item: ICommentsPostResponse, index: number) => (
              <>
                <TreeCommentRender key={`${item.id}-${index}`} commentsPost={item} currentUserId={''} />
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
  );
};

export default DetailPost;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }: any) => {
  const { postId } = params;
  const response = await postService.getPostById(postId);

  var post = undefined;
  if (response.isSuccess) {
    post = response.data;
  } else {
    // in the current page, with the 404 http status code.
    // this will display your /pages/404.js error page,
    return { notFound: true };
  }

  if (post && post.isDeleted) {
    return { notFound: true };
  }

  return {
    props: {
      post,
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
