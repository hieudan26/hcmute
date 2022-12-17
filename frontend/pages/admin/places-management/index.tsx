import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Flex,
  Divider,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RiPencilLine } from 'react-icons/ri';
import { usePlacesCountries } from '../../../hooks/queries/place';
import { IPageableResponse, IPaginationRequest } from '../../../models/common/ResponseMessage.model';
import { IPlaceCountryResponse } from '../../../models/place/place.model';
import placeService from '../../../services/place/place.service';

export interface IAdminPlacesManagementPageProps {}

const initialPageable = {
  hasNext: false,
  hasPrevious: false,
  pageNumber: 0,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
};

const intialPagination: IPaginationRequest = {
  pageNumber: 0,
  pageSize: 10,
  sortBy: 'name',
  sortType: 'ASC',
};

const AdminPlacesManagementPage: NextPage = (props: IAdminPlacesManagementPageProps) => {
  const tableBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const colorTxt = useColorModeValue('black', 'white');
  const bgInput = useColorModeValue('white', '#4b4b4b');
  const router = useRouter();
  const [paramsPaginationCountry, setParamsPaginationCountry] = useState<IPaginationRequest>(intialPagination);
  const [paramsPaginationProvince, setParamsPaginationProvince] = useState<IPaginationRequest>(intialPagination);
  const [paramsPaginationPlace, setParamsPaginationPlace] = useState<IPaginationRequest>(intialPagination);
  const [pageableCountry, setPageableCountry] = useState<IPageableResponse>(initialPageable);
  const [pageableProvince, setPageableProvince] = useState<IPageableResponse>(initialPageable);
  const [pageablePlace, setPageablePlace] = useState<IPageableResponse>(initialPageable);
  const [dataCountry, setDataCountry] = useState<IPlaceCountryResponse[]>([]);
  const [dataProvince, setDataProvince] = useState<IPlaceCountryResponse[]>([]);
  const [dataPlace, setDataPlace] = useState<IPlaceCountryResponse[]>([]);
  const [urlCountry, setUrlCountry] = useState<string>('');
  const [urlProvince, setUrlProvince] = useState<string>('');

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await placeService.getCountries(paramsPaginationCountry);
      setPageableCountry(response.data.pageable);
      setDataCountry(response.data.content);
    };
    fetchCountries();
  }, [paramsPaginationCountry]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await placeService.getProvincesByCountry(paramsPaginationProvince, urlCountry);
      setPageableProvince(response.data.pageable);
      setDataProvince(response.data.content);
    };

    if (urlCountry.trim() !== '') {
      fetchProvinces();
    }
  }, [paramsPaginationProvince, urlCountry]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await placeService.getPlaces(paramsPaginationPlace, urlCountry, urlProvince, undefined);
      setPageablePlace(response.data.pageable);
      setDataPlace(response.data.content);
    };

    if (urlCountry.trim() !== '' && urlProvince.trim() !== '') {
      fetchPlaces();
    }
  }, [paramsPaginationPlace, urlCountry, urlProvince]);

  const changePaginationCountries = (page: number | undefined) => {
    if (paramsPaginationCountry && page) {
      const tempPagination = { ...paramsPaginationCountry };
      tempPagination.pageNumber = page - 1;
      setParamsPaginationCountry(tempPagination);
    }
  };

  const changePaginationProvinces = (page: number | undefined) => {
    if (paramsPaginationProvince && page) {
      const tempPagination = { ...paramsPaginationProvince };
      tempPagination.pageNumber = page - 1;
      setParamsPaginationProvince(tempPagination);
    }
  };

  const changePaginationPlaces = (page: number | undefined) => {
    if (paramsPaginationPlace && page) {
      const tempPagination = { ...paramsPaginationPlace };
      tempPagination.pageNumber = page - 1;
      setParamsPaginationPlace(tempPagination);
    }
  };

  const goDetail = (item: IPlaceCountryResponse, type: string) => {
    if (type === 'country') {
      router.push(`/admin/places-management/update/${item.url}`);
    } else if (type === 'province') {
      router.push(`/admin/places-management/update/${urlCountry}/${item.url}`);
    } else {
      router.push(`/admin/places-management/update/${urlCountry}/${urlProvince}/${item.url}`);
    }
  };

  return (
    <Box mb='10' w='full'>
      <Box w='full' bg={tableBg} rounded='md' shadow='md' p='6'>
        <TableContainer>
          <Table variant='simple'>
            <TableCaption>All countries - places in system</TableCaption>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Hash Tags</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataCountry.map((item) => (
                <Tr
                  key={item.id}
                  cursor='pointer'
                  onClick={() => {
                    setUrlCountry(item.url);
                  }}
                >
                  <Td>{item.id}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.category.name}</Td>
                  <Td>
                    {item.hashTags.map((tag) => (
                      <Badge key={`badge-${item.id}`} fontSize='3xs' colorScheme='red'>
                        {tag}
                      </Badge>
                    ))}
                  </Td>
                  <Td>
                    <Button
                      title='Detail'
                      size='xs'
                      fontSize='sm'
                      onClick={() => {
                        goDetail(item, 'country');
                      }}
                    >
                      <Icon as={RiPencilLine} />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Hash Tags</Th>
                <Th>Action</Th>
              </Tr>
            </Tfoot>
          </Table>
          <Flex my='6' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
            <Pagination
              onChange={(page) => {
                changePaginationCountries(page);
              }}
              activeStyles={{ bg: '#D0637C', color: 'white' }}
              hoverStyles={{
                bg: '#F5DDe0',
                color: 'black',
              }}
              defaultCurrent={1}
              total={pageableCountry.totalItems}
              paginationProps={{
                display: 'flex',
              }}
              pageNeighbours={1}
            />
          </Flex>
        </TableContainer>
      </Box>
      <Divider my='8' />
      {urlCountry.trim() !== '' && dataProvince.length > 0 && (
        <Box w='full' bg={tableBg} rounded='md' shadow='md' p='6'>
          <TableContainer>
            <Table variant='simple'>
              <TableCaption>All provinces - places in system</TableCaption>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Hash Tags</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataProvince.length &&
                  dataProvince.map((item) => (
                    <Tr
                      key={`province-${item.id}`}
                      cursor='pointer'
                      onClick={() => {
                        setUrlProvince(item.url);
                      }}
                    >
                      <Td>{item.id}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.category.name}</Td>
                      <Td>
                        {item.hashTags.map((tag) => (
                          <Badge key={`provincebadge-${item.id}`} fontSize='3xs' colorScheme='red'>
                            {tag}
                          </Badge>
                        ))}
                      </Td>
                      <Td>
                        <Button
                          title='Detail'
                          size='xs'
                          fontSize='sm'
                          onClick={() => {
                            goDetail(item, 'province');
                          }}
                        >
                          <Icon as={RiPencilLine} />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Hash Tags</Th>
                  <Th>Action</Th>
                </Tr>
              </Tfoot>
            </Table>
            <Flex my='6' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
              <Pagination
                onChange={(page) => {
                  changePaginationProvinces(page);
                }}
                activeStyles={{ bg: '#D0637C', color: 'white' }}
                hoverStyles={{
                  bg: '#F5DDe0',
                  color: 'black',
                }}
                defaultCurrent={1}
                total={pageableProvince.totalItems}
                paginationProps={{
                  display: 'flex',
                }}
                pageNeighbours={1}
              />
            </Flex>
          </TableContainer>
        </Box>
      )}
      <Divider my='8' />
      {urlCountry.trim() !== '' && urlProvince.trim() !== '' && dataPlace.length > 0 && (
        <Box w='full' bg={tableBg} rounded='md' shadow='md' p='6'>
          <TableContainer>
            <Table variant='simple'>
              <TableCaption>All places - places in system</TableCaption>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Hash Tags</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataPlace.length &&
                  dataPlace.map((item) => (
                    <Tr key={`place-${item.id}`}>
                      <Td>{item.id}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.category.name}</Td>
                      <Td>
                        {item.hashTags.map((tag) => (
                          <Badge key={`placebadge-${item.id}`} fontSize='3xs' colorScheme='red'>
                            {tag}
                          </Badge>
                        ))}
                      </Td>
                      <Td>
                        <Button
                          title='Detail'
                          size='xs'
                          fontSize='sm'
                          onClick={() => {
                            goDetail(item, 'place');
                          }}
                        >
                          <Icon as={RiPencilLine} />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Hash Tags</Th>
                  <Th>Action</Th>
                </Tr>
              </Tfoot>
            </Table>
            <Flex my='6' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
              <Pagination
                onChange={(page) => {
                  changePaginationPlaces(page);
                }}
                activeStyles={{ bg: '#D0637C', color: 'white' }}
                hoverStyles={{
                  bg: '#F5DDe0',
                  color: 'black',
                }}
                defaultCurrent={1}
                total={pageablePlace.totalItems}
                paginationProps={{
                  display: 'flex',
                }}
                pageNeighbours={1}
              />
            </Flex>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default AdminPlacesManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
