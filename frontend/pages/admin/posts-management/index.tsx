/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  Icon,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useState } from 'react';
import { RiPencilLine, RiRefreshLine, RiSettings6Fill } from 'react-icons/ri';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ModalDetailPost from '../../../components/views/Profile/Posts/Modals/ModalDetailPost/index.component';
import ModalObservePostAdmin from '../../../components/views/Profile/Posts/Modals/ModalObservePostAdmin/index.component';
import { STATUS_POST } from '../../../constants/global.constant';
import { IPageableResponse, IPaginationRequest } from '../../../models/common/ResponseMessage.model';
import { IPostResponseModel } from '../../../models/post/post.model';
import postService from '../../../services/post/post.service';

export interface IAdminPostsManagementPageProps {}

const AdminPostsManagementPage: NextPage = (props: IAdminPostsManagementPageProps) => {
  const { isOpen: isOpenObserve, onOpen: onOpenObserve, onClose: onCloseObserve } = useDisclosure();
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest | undefined>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'creationDate',
    sortType: 'DESC',
  });
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined); //undefined === false, true
  const [type, setType] = useState<string | undefined>(undefined);
  const [pageable, setPageable] = useState<IPageableResponse>({
    hasNext: false,
    hasPrevious: false,
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [value, setValue] = useState('false');
  const [valueType, setValueType] = useState('1');
  const [data, setData] = useState<IPostResponseModel[] | undefined>(undefined);
  const [postValue, setPostValue] = useState<IPostResponseModel>({
    id: 'string',
    userId: 'string',
    avatar: 'string',
    fullName: 'string',
    type: 'string',
    title: 'string',
    content: 'string',
    time: 'string',
    commentNumber: 0,
    reactNumber: 0,
    images: [''],
    isReacted: false,
    isDeleted: false,
    hashTags: [''],
    reportCount: 0,
    status: STATUS_POST.ACTIVE,
  });
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [valueStatusPost, setValueStatusPost] = useState<string>(STATUS_POST.ACTIVE);
  const tableBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const colorTxt = useColorModeValue('black', 'white');
  const bgInput = useColorModeValue('white', '#4b4b4b');

  const fetchPosts = useCallback(async () => {
    try {
      const response = await postService.getAllPostsDeleted(paramsPagination, isDeleted, type, valueStatusPost);
      setData(response.data.content);
      setPageable(response.data.pageable);
    } catch (error) {
      console.log(error);
    }
  }, [paramsPagination, isDeleted, type, valueStatusPost]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderStatus = (status: boolean | undefined) => {
    if (status !== undefined) {
      if (status) {
        return 'Invalid';
      } else {
        return 'Valid';
      }
    }
    return 'Invalid';
  };

  const changePagination = (page: number | undefined) => {
    if (paramsPagination && page) {
      const tempPagination = { ...paramsPagination };
      tempPagination.pageNumber = page - 1;
      setParamsPagination(tempPagination);
    }
  };

  const changeSortBy = (sortBy: string) => {
    if (paramsPagination) {
      const tempPagination = { ...paramsPagination };
      if (tempPagination.sortBy !== sortBy) {
        tempPagination.sortType = 'DESC';
      } else {
        if (tempPagination.sortType === 'ASC') {
          tempPagination.sortType = 'DESC';
        } else {
          tempPagination.sortType = 'ASC';
        }
      }
      tempPagination.sortBy = sortBy;
      setParamsPagination(tempPagination);
    }
  };

  const changeStatusPost = (nextValue: string) => {
    setValue(nextValue);
    if (nextValue === 'true') {
      setIsDeleted(undefined);
    } else {
      setIsDeleted(true);
    }
  };

  const changeTypePost = (nextValue: string) => {
    setValueType(nextValue);
    if (nextValue === '1') {
      setType(undefined);
    } else if (nextValue === '2') {
      setType('experience');
    } else {
      setType('faq');
    }
  };

  const refreshData = async () => {
    setIsRefresh(true);
    await fetchPosts();
    setIsRefresh(false);
  };

  const deletePost = async (postId: string) => {
    const response = await postService.deletePost(postId);
  };

  const onChangeStatusPost = async (postId: string, type: string) => {
    if (type === 'ACTIVE') {
      await postService.updateReportPost(postId, STATUS_POST.ACTIVE);
    } else {
      await postService.updateReportPost(postId, STATUS_POST.BANNED);
    }
    onCloseObserve();
    refreshData();
  };

  return (
    <>
      <ModalObservePostAdmin
        onChangeStatusPost={onChangeStatusPost}
        post={postValue}
        isOpen={isOpenObserve}
        onClose={onCloseObserve}
        onOpen={onOpenObserve}
      />
      <ModalDetailPost
        currentUserId=''
        post={postValue}
        isOpen={isOpenDetail}
        onClose={() => {
          setIsOpenDetail(false);
        }}
      />
      <Box w='full'>
        <Box w='full' borderRadius={8} bg={tableBg} p='8' color='black' shadow='lg'>
          <Flex mb='8' justifyContent='space-between' alignContent='center'>
            <Flex align='end' gap='4'>
              <Heading color={colorTxt} size='lg' fontWeight='normal'>
                Tất cả bài đăng
              </Heading>
              <RadioGroup colorScheme='pink' onChange={setValueStatusPost} value={valueStatusPost}>
                <Stack direction='row' gap='4'>
                  <Radio size='sm' value={STATUS_POST.ACTIVE}>
                    Bình thường
                  </Radio>
                  <Radio size='sm' value={STATUS_POST.OBSERVE}>
                    Cần xem xét
                  </Radio>
                  <Radio size='sm' value={STATUS_POST.BANNED}>
                    Đã chặn
                  </Radio>
                </Stack>
              </RadioGroup>
            </Flex>

            <Flex gap='4'>
              <Button title='refresh' as='a' size='sm' fontSize='sm' colorScheme='pink' onClick={refreshData}>
                {isRefresh ? <Spinner size='sm' /> : <Icon as={RiRefreshLine} fontSize='16' />}
              </Button>
            </Flex>
          </Flex>

          <Flex justify='space-evenly' mb='4'>
            <RadioGroup onChange={changeStatusPost} value={value} colorScheme='pink' color={colorTxt}>
              <Stack direction='row'>
                <Text fontSize='sm'>Loại trạng thái bài viết: </Text>
                <Radio size='sm' value='true'>
                  Đang hiển thị
                </Radio>
                <Radio size='sm' value='false'>
                  Đã bị xóa
                </Radio>
              </Stack>
            </RadioGroup>

            <RadioGroup onChange={changeTypePost} value={valueType} colorScheme='pink' color={colorTxt}>
              <Stack direction='row'>
                <Text fontSize='sm'>Lọc theo loại bài viết: </Text>
                <Radio size='sm' value='1'>
                  Tất cả
                </Radio>
                <Radio size='sm' value='2'>
                  Trải nghiệm
                </Radio>
                <Radio size='sm' value='3'>
                  Hỏi đáp
                </Radio>
              </Stack>
            </RadioGroup>
          </Flex>

          {!data ? (
            <Flex justify='center'>
              <Spinner />
            </Flex>
          ) : data.length === 0 ? (
            <Flex justify='center' fontSize='sm'>
              Không có post nào trong hệ thống
            </Flex>
          ) : (
            <>
              <Table color={colorTxt} fontSize='sm'>
                <Thead>
                  <Tr>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('id');
                      }}
                    >
                      ID
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('type');
                      }}
                    >
                      Loại
                    </Th>
                    <Th>Người sở hữu</Th>
                    <Th>Lượt tương tác</Th>
                    <Th>Lượt bình luận</Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('time');
                      }}
                    >
                      Ngày tạo
                    </Th>
                    {/* <Th>Trạng thái</Th> */}
                    <Th>Chi tiết</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.map((post: IPostResponseModel, index) => (
                      <Tr key={post.id}>
                        <Td>{post.id}</Td>
                        <Td>{post.type}</Td>
                        <Td>
                          <Box>
                            <ChakraLink color='purple.400'>
                              <Text fontWeight='bold'>{post.fullName}</Text>
                            </ChakraLink>
                            {/* <Text fontWeight='normal' fontSize='sm' color='gray.500'>
                              {post.userId}
                            </Text> */}
                          </Box>
                        </Td>
                        <Td>{post.reactNumber}</Td>
                        <Td>{post.commentNumber}</Td>
                        <Td>{post.time.split(' ').shift()}</Td>
                        {/* <Td>{renderStatus(post.isDeleted)}</Td> */}
                        <Td>
                          <Flex gap={3}>
                            <Button
                              onClick={() => {
                                setPostValue(post);
                                setIsOpenDetail(true);
                              }}
                              title='Detail'
                              size='xs'
                              fontSize='xs'
                            >
                              <Icon as={RiPencilLine} fontSize='16' />
                            </Button>
                            {post.status === STATUS_POST.OBSERVE && (
                              <Button
                                onClick={() => {
                                  setPostValue(post);
                                  onOpenObserve();
                                }}
                                title='Xem xét báo cáo bài viết'
                                size='xs'
                                fontSize='xs'
                              >
                                <Icon as={RiSettings6Fill} fontSize='16' />
                              </Button>
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              <Flex mt='8' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                <Pagination
                  onChange={(page) => {
                    changePagination(page);
                  }}
                  activeStyles={{ bg: '#D0637C', color: 'white' }}
                  hoverStyles={{
                    bg: '#F5DDe0',
                    color: 'black',
                  }}
                  defaultCurrent={1}
                  total={pageable.totalItems}
                  paginationProps={{
                    display: 'flex',
                  }}
                  pageNeighbours={1}
                />
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminPostsManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'post'])),
      // Will be passed to the page component as props
    },
  };
};
