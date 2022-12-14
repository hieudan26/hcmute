/* eslint-disable react-hooks/exhaustive-deps */
import { Search2Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { RiAddLine, RiCheckFill, RiDeleteBin5Fill, RiPencilLine, RiRefreshLine } from 'react-icons/ri';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { IPageableResponse, IPaginationRequest } from '../../../models/common/ResponseMessage.model';
import { useCallback, useEffect, useState } from 'react';
import { IPostResponseModel } from '../../../models/post/post.model';
import postService from '../../../services/post/post.service';
import { formatDate } from '../../../utils';
import ModalDetailPost from '../../../components/views/Profile/Posts/Modals/ModalDetailPost/index.component';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export interface IAdminPostsManagementPageProps {}

const AdminPostsManagementPage: NextPage = (props: IAdminPostsManagementPageProps) => {
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
    content: 'string',
    time: 'string',
    commentNumber: 0,
    reactNumber: 0,
    images: [''],
    isReacted: false,
    isDeleted: false,
    hashTags: [''],
  });
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const tableBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const colorTxt = useColorModeValue('black', 'white');
  const bgInput = useColorModeValue('white', '#4b4b4b');

  const fetchPosts = useCallback(async () => {
    try {
      const response = await postService.getAllPostsDeleted(paramsPagination, isDeleted, type);
      console.log(response.data.content);
      setData(response.data.content);
      setPageable(response.data.pageable);
    } catch (error) {
      console.log(error);
    }
  }, [paramsPagination, isDeleted, type]);

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

  return (
    <>
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
            <Heading color={colorTxt} size='lg' fontWeight='normal'>
              Posts
            </Heading>

            <Flex gap='4'>
              <Button title='refresh' as='a' size='sm' fontSize='sm' colorScheme='pink' onClick={refreshData}>
                {isRefresh ? <Spinner size='sm' /> : <Icon as={RiRefreshLine} fontSize='16' />}
              </Button>
            </Flex>
          </Flex>

          <Flex justify='space-evenly' mb='4'>
            <RadioGroup onChange={changeStatusPost} value={value} colorScheme='pink'>
              <Stack direction='row'>
                <Text>Type status posts: </Text>
                <Radio value='true'>Valid</Radio>
                <Radio value='false'>Invalid</Radio>
              </Stack>
            </RadioGroup>

            <RadioGroup onChange={changeTypePost} value={valueType} colorScheme='pink'>
              <Stack direction='row'>
                <Text>Get by type posts: </Text>
                <Radio value='1'>All</Radio>
                <Radio value='2'>Experience</Radio>
                <Radio value='3'>Faq</Radio>
              </Stack>
            </RadioGroup>
          </Flex>

          {!data ? (
            <Flex justify='center'>
              <Spinner />
            </Flex>
          ) : data.length === 0 ? (
            <Flex justify='center'>Không có post nào trong hệ thống</Flex>
          ) : (
            <>
              <Table color={colorTxt}>
                <Thead>
                  <Tr>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('id');
                      }}
                    >
                      Post Id
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('type');
                      }}
                    >
                      Type
                    </Th>
                    <Th>Owner</Th>
                    <Th>React Number</Th>
                    <Th>Comment Number</Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('time');
                      }}
                    >
                      Created At
                    </Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
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
                            <Text fontWeight='normal' fontSize='sm' color='gray.500'>
                              {post.userId}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{post.reactNumber}</Td>
                        <Td>{post.commentNumber}</Td>
                        <Td>{post.time.split(' ').shift()}</Td>
                        <Td>{renderStatus(post.isDeleted)}</Td>
                        <Td>
                          <Flex gap={3}>
                            <Button
                              onClick={() => {
                                setPostValue(post);
                                console.log(postValue);
                                setIsOpenDetail(true);
                              }}
                              title='Detail'
                              size='sm'
                              fontSize='sm'
                            >
                              <Icon as={RiPencilLine} fontSize='16' />
                            </Button>
                            <Button
                              hidden={post.isDeleted !== undefined && post.isDeleted}
                              onClick={() => {
                                // deletePost(post.id);
                              }}
                              title='Delete'
                              size='sm'
                              fontSize='sm'
                            >
                              <Icon as={RiDeleteBin5Fill} fontSize='16' />
                            </Button>
                            <Button
                              hidden={post.isDeleted !== undefined && !post.isDeleted}
                              onClick={() => {
                                // changeStatusUser(user);
                              }}
                              title='Active'
                              size='sm'
                              fontSize='sm'
                            >
                              <Icon as={RiCheckFill} fontSize='16' />
                            </Button>
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
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
