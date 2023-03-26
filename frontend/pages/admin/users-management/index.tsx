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
  useColorModeValue,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { RiAddLine, RiCheckFill, RiDeleteBin5Fill, RiPencilLine, RiRefreshLine } from 'react-icons/ri';
import DetailUserModal from '../../../components/views/Modals/DetailUserModal/index.component';
import useDebounce from '../../../hooks/useDebounce';
import { IPageableResponse, IPaginationRequest } from '../../../models/common/ResponseMessage.model';
import { IUserFirstLoginRequest } from '../../../models/user/user.model';
import userService from '../../../services/user/user.service';
import { formatDate } from '../../../utils';

export interface IAdminUsersManagementPageProps {}

const AdminUsersManagementPage: NextPage = (props: IAdminUsersManagementPageProps) => {
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest | undefined>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'creationDate',
    sortType: 'DESC',
  });
  const [pageable, setPageable] = useState<IPageableResponse>({
    hasNext: false,
    hasPrevious: false,
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [searchFirstName, setSearchFirstName] = useState<string | undefined>(undefined);
  const [searchLastName, setSearchLastName] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>('');
  const [data, setData] = useState<IUserFirstLoginRequest[] | undefined>(undefined);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<IUserFirstLoginRequest | undefined>(undefined);
  const tableBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const colorTxt = useColorModeValue('black', 'white');
  const bgInput = useColorModeValue('white', '#4b4b4b');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userService.getUsers(paramsPagination, searchFirstName, searchFirstName);
      setData(response.data.content);
      setPageable(response.data.pageable);
    } catch (error) {
      console.log(error);
    }
  }, [paramsPagination, searchFirstName, searchLastName]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useDebounce(
    () => {
      if (search !== '') {
        setSearchFirstName(search);
      } else {
        setSearchFirstName(undefined);
      }
    },
    [search],
    400
  );

  const changePagination = (page: number | undefined) => {
    if (paramsPagination && page) {
      const tempPagination = { ...paramsPagination };
      tempPagination.pageNumber = page - 1;
      setParamsPagination(tempPagination);
    }
  };

  const renderCreateDate = (datetimeCreated: number | undefined) => {
    if (datetimeCreated) {
      const date = new Date(datetimeCreated);
      return formatDate(date);
    }
  };

  const refreshData = async () => {
    setIsRefresh(true);
    await fetchUsers();
    setIsRefresh(false);
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

  const handleSearch = (event: ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      setSearch(event.target.value);
    }
  };

  const changeStatusUser = async (user: IUserFirstLoginRequest) => {
    if (user.disable.toString() === 'false') {
      const response = await userService.disableUser(user.id);
    } else {
      const response = await userService.enableUser(user.id);
    }
    refreshData();
  };

  return (
    <>
      <DetailUserModal user={userDetail} isOpen={isOpen} setIsOpen={setIsOpen} />
      <Box w='full'>
        <Box w='full' borderRadius={8} bg={tableBg} p='8' color='black' shadow='lg'>
          <Flex mb='8' justifyContent='space-between' alignContent='center'>
            <Heading color={colorTxt} size='lg' fontWeight='normal'>
              Tất cả người dùng
            </Heading>

            <Flex gap='4'>
              <Button title='refresh' as='a' size='sm' fontSize='sm' colorScheme='pink' onClick={refreshData}>
                {isRefresh ? <Spinner size='sm' /> : <Icon as={RiRefreshLine} fontSize='16' />}
              </Button>

              <Link href='/admin/accounts-management' passHref>
                <Button as='a' size='sm' fontSize='sm' colorScheme='pink' leftIcon={<Icon as={RiAddLine} fontSize='20' />}>
                  Tạo mới người dùng / tài khoản
                </Button>
              </Link>
            </Flex>
          </Flex>

          <Box px='64' mb='3'>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                // eslint-disable-next-line react/no-children-prop
                children={<Search2Icon color='gray.300' />}
              />
              <Input
                bg={bgInput}
                color={colorTxt}
                type='search'
                placeholder='Tìm kiếm theo tên hoặc tên họ và tên lót'
                border='1px'
                _hover={{
                  borderColor: 'backgroundButton.primary',
                }}
                onChange={handleSearch}
              />
            </InputGroup>
          </Box>

          {!data ? (
            <Flex justify='center'>
              <Spinner />
            </Flex>
          ) : data.length === 0 ? (
            <Flex justify='center' color={colorTxt}>
              Không có user nào trong hệ thống
            </Flex>
          ) : (
            <>
              <Table color={colorTxt}>
                <Thead>
                  <Tr>
                    <Th>STT</Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('firstName');
                      }}
                    >
                      Thông tin
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('phoneNumber');
                      }}
                    >
                      Số điện thoại
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('role');
                      }}
                    >
                      Vai trò
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('creationDate');
                      }}
                    >
                      Ngày tạo
                    </Th>
                    <Th>Trạng thái</Th>
                    <Th>Chi tiết</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.map((user, index) => (
                      <Tr key={user.id}>
                        <Td>{index + 1}</Td>
                        <Td>
                          <Box>
                            <ChakraLink color='purple.400'>
                              <Text fontWeight='bold'>{`${user.firstName} ${user.lastName}`}</Text>
                            </ChakraLink>
                            <Text fontWeight='normal' fontSize='sm' color='gray.500'>
                              {user.email}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{user.phoneNumber}</Td>
                        <Td>{user.role}</Td>
                        <Td>{renderCreateDate(user.creationDate)}</Td>
                        <Td>{user.disable.toString() === 'true' ? 'Invalid' : 'Valid'}</Td>
                        <Td>
                          <Flex gap={3}>
                            <Button
                              onClick={() => {
                                setUserDetail(user);
                                setIsOpen(true);
                              }}
                              title='Detail'
                              size='sm'
                              fontSize='sm'
                            >
                              <Icon as={RiPencilLine} fontSize='16' />
                            </Button>
                            <Button
                              hidden={user.disable.toString() === 'true'}
                              onClick={() => {
                                changeStatusUser(user);
                              }}
                              title='Delete'
                              size='sm'
                              fontSize='sm'
                            >
                              <Icon as={RiDeleteBin5Fill} fontSize='16' />
                            </Button>
                            <Button
                              hidden={user.disable.toString() === 'false'}
                              onClick={() => {
                                changeStatusUser(user);
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

export default AdminUsersManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
