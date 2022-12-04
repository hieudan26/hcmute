import {
  Box,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Link as ChakraLink,
  Text,
  Button,
  Icon,
  FormControl,
  FormLabel,
  Input,
  Center,
  Select,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ICountryRequest, ICountryResponse, IProvinceRequest, IProvinceResponse } from '../../../models/area/country.model';
import { IPageableResponse, IPaginationRequest } from '../../../models/common/ResponseMessage.model';
import areaService from '../../../services/area/area.service';
import { TiTick } from 'react-icons/ti';

export interface IAdminAreasManagementPageProps {}

const AdminAreasManagementPage: NextPage = (props: IAdminAreasManagementPageProps) => {
  const [dataCountries, setDataCountries] = useState<ICountryResponse[]>([]);
  const [paramsCountryPagination, setParamsCountryPagination] = useState<IPaginationRequest | undefined>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'id',
    sortType: 'ASC',
  });
  const [pageableCountry, setPageableCountry] = useState<IPageableResponse>({
    hasNext: false,
    hasPrevious: false,
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [dataProvinces, setDataProvinces] = useState<IProvinceResponse[]>([]);
  const [paramsProvincePagination, setParamProvincePagination] = useState<IPaginationRequest | undefined>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'id',
    sortType: 'ASC',
  });
  const [pageableProvince, setPageableProvince] = useState<IPageableResponse>({
    hasNext: false,
    hasPrevious: false,
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [countryChoose, setCountryChoose] = useState<string | undefined>(undefined);
  const idRef = useRef<string | undefined>(undefined);
  const [modelCountry, setModelCountry] = useState<ICountryRequest>({ name: '', enName: '' });
  const [modelProvince, setModelProvince] = useState<IProvinceRequest>({ parentId: 1, name: '', enName: '' });
  const [dataSelect, setDataSelect] = useState<ICountryResponse[]>([]);
  const [select, setSelect] = useState<string>('1');
  const colorTxt = useColorModeValue('black', 'white');

  const fetchDataCountries = useCallback(async () => {
    try {
      const response = await areaService.getCountriesPagination(paramsCountryPagination);
      setDataCountries(response.data.content);
      setPageableCountry(response.data.pageable);
    } catch (error) {
      console.log(error);
    }
  }, [paramsCountryPagination]);

  const fetchDataProvinces = useCallback(async () => {
    try {
      if (!countryChoose) {
        const response = await areaService.getProvinces(paramsProvincePagination);
        setDataProvinces(response.data.content);
        setPageableProvince(response.data.pageable);
      } else {
        if (countryChoose !== idRef.current) {
          idRef.current = countryChoose;
          setParamProvincePagination({
            pageNumber: 0,
            pageSize: 10,
            sortBy: 'id',
            sortType: 'ASC',
          });
          const response = await areaService.getProvincesByCountryPagination(paramsProvincePagination, countryChoose);
          setDataProvinces(response.data.content);
          setPageableProvince(response.data.pageable);
        } else {
          const response = await areaService.getProvincesByCountryPagination(paramsProvincePagination, countryChoose);
          setDataProvinces(response.data.content);
          setPageableProvince(response.data.pageable);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [paramsProvincePagination, countryChoose]);

  useEffect(() => {
    const fetchSelect = async () => {
      try {
        const response = await areaService.getCountries();
        setDataSelect(response.data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSelect();
  }, []);

  useEffect(() => {
    fetchDataCountries();
  }, [fetchDataCountries]);

  useEffect(() => {
    fetchDataProvinces();
  }, [fetchDataProvinces]);

  const changePagination = (type: string, page: number | undefined) => {
    if (type === 'country' && paramsCountryPagination && page) {
      const tempPagination = { ...paramsCountryPagination };
      tempPagination.pageNumber = page - 1;
      setParamsCountryPagination(tempPagination);
    } else if (type === 'province' && paramsProvincePagination && page) {
      const tempPagination = { ...paramsProvincePagination };
      tempPagination.pageNumber = page - 1;
      setParamProvincePagination(tempPagination);
    }
  };

  const changeSortBy = (type: string, sortBy: string) => {
    let tempPagination;
    tempPagination = { ...paramsCountryPagination };
    if (type === 'province') {
      tempPagination = { ...paramsProvincePagination };
    }

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
    if (type === 'country') {
      setParamsCountryPagination(tempPagination);
    } else {
      setParamProvincePagination(tempPagination);
    }
  };

  const handleChooseCountry = (countryId: number) => {
    // console.log(countryId.toString() !== countryChoose);
    if (countryId.toString() !== countryChoose) {
      setCountryChoose(countryId.toString());
    } else {
      setCountryChoose(undefined);
    }
  };

  const handleChangeCountry = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      const { name, value } = event.target;
      setModelCountry((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleChangeProvince = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (event) {
      const { name, value } = event.target;
      setModelProvince((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const createNewCountry = async () => {
    const response = await areaService.createCountry(modelCountry);
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement> | undefined) => {
    if (event) {
      setSelect(event.target.value);
    }
  };

  const createNewProvince = async () => {
    modelProvince.parentId = Number(select);
    const response = await areaService.createProvince(modelProvince);
  };

  return (
    <Box w='full'>
      <Box w='full' bg='white' mb='4' rounded='md' px='4' py='6'>
        <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
          Create new country
        </Heading>
        <Flex direction='row' justify='space-between' gap='6' align='center' mb='2'>
          <FormControl>
            <FormLabel>Vietnamese name</FormLabel>
            <Input name='name' onChange={handleChangeCountry} value={modelCountry?.name} type='text' />
          </FormControl>
          <FormControl>
            <FormLabel>English name</FormLabel>
            <Input name='enName' onChange={handleChangeCountry} value={modelCountry?.enName} type='text' />
          </FormControl>
        </Flex>
        <Center>
          <Button w='30%' onClick={createNewCountry}>
            Create
          </Button>
        </Center>
      </Box>

      <Box w='full' bg='white' mb='4' rounded='md' px='4' py='6'>
        <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
          Create new province
        </Heading>
        <Flex direction='row' justify='space-between' gap='6' align='center' mb='2'>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Select onChange={handleChangeSelect}>
              {dataSelect.map((item, index) => (
                <option key={item.id} value={item.id}>
                  {item.enName}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Vietnamese name</FormLabel>
            <Input name='name' onChange={handleChangeProvince} value={modelProvince.name} type='text' />
          </FormControl>
          <FormControl>
            <FormLabel>English name</FormLabel>
            <Input name='enName' onChange={handleChangeProvince} value={modelProvince.enName} type='text' />
          </FormControl>
        </Flex>
        <Center>
          <Button w='30%' onClick={createNewProvince}>
            Create
          </Button>
        </Center>
      </Box>

      <SimpleGrid
        w='full'
        display={{
          base: 'initial',
          md: 'grid',
        }}
        columns={{
          md: 2,
        }}
        spacing={{
          md: 6,
        }}
        justifyContent='space-between'
      >
        <GridItem
          colSpan={{
            md: 1,
          }}
          p='10'
          bg='white'
          rounded='lg'
          shadow='lg'
        >
          <Box px={[4, 0]}>
            <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
              Countries
            </Heading>
            <TableContainer>
              <Table variant='striped' colorScheme='pink'>
                <TableCaption>All contries in system</TableCaption>
                <Thead>
                  <Tr>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('country', 'id');
                      }}
                    >
                      Id
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('country', 'enName');
                      }}
                    >
                      Name & Eng name
                    </Th>
                    <Th>Choose</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataCountries.map((item: ICountryResponse, index) => (
                    <Tr key={item.id}>
                      <Td>{item.id}</Td>
                      <Td>
                        <Box w='full'>
                          <ChakraLink color='purple.400'>
                            <Text fontWeight='bold'>{item.name}</Text>
                          </ChakraLink>
                          <Text fontWeight='normal' fontSize='sm' color='gray.500'>
                            {item.enName}
                          </Text>
                        </Box>
                      </Td>
                      <Td>
                        <Button
                          title='Choose'
                          size='xs'
                          fontSize='xs'
                          background={item.id.toString() !== countryChoose ? 'gray.600' : 'pink.500'}
                          _hover={{ bg: 'black' }}
                          onClick={() => {
                            handleChooseCountry(item.id);
                          }}
                        >
                          <Icon as={TiTick} fontSize='sm' />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Eng Name</Th>
                </Tfoot>
              </Table>
            </TableContainer>
            <Flex mt='4' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
              <Pagination
                onChange={(page) => {
                  changePagination('country', page);
                }}
                activeStyles={{ bg: '#D0637C', color: 'white' }}
                hoverStyles={{
                  bg: '#F5DDe0',
                  color: 'black',
                }}
                size='sm'
                defaultCurrent={1}
                total={pageableCountry.totalItems}
                paginationProps={{
                  display: 'flex',
                }}
                pageNeighbours={1}
              />
            </Flex>
          </Box>
        </GridItem>

        <GridItem
          colSpan={{
            md: 1,
          }}
          p='10'
          bg='white'
          rounded='lg'
          shadow='lg'
        >
          <Box px={[4, 0]}>
            <Heading fontSize='lg' fontWeight='md' lineHeight='6' mb='4'>
              Provinces
            </Heading>
            <TableContainer>
              <Table variant='striped' colorScheme='pink'>
                <TableCaption>All provinces in system</TableCaption>
                <Thead>
                  <Tr>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('province', 'id');
                      }}
                    >
                      Id
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('province', 'name');
                      }}
                    >
                      Name
                    </Th>
                    <Th
                      cursor='pointer'
                      onClick={() => {
                        changeSortBy('province', 'enName');
                      }}
                    >
                      Eng name
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataProvinces.length > 0 ? (
                    dataProvinces.map((item, index) => (
                      <Tr key={item.id}>
                        <Td>{item.id}</Td>
                        <Td>{item.name}</Td>
                        <Td>{item.enName}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Text>No Information</Text>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Name</Th>
                    <Th>Eng name</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
            <Flex mt='4' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
              <Pagination
                onChange={(page) => {
                  changePagination('province', page);
                }}
                activeStyles={{ bg: '#D0637C', color: 'white' }}
                hoverStyles={{
                  bg: '#F5DDe0',
                  color: 'black',
                }}
                size='sm'
                defaultCurrent={1}
                total={pageableProvince.totalItems}
                paginationProps={{
                  display: 'flex',
                }}
                pageNeighbours={1}
              />
            </Flex>
          </Box>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default AdminAreasManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
