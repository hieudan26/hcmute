import {
  Box,
  Grid,
  GridItem,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Image,
  Button,
  IconButton,
  Center,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IPageableResponse, IPaginationRequest } from '../../../models/common/ResponseMessage.model';
import { ICategoryRequest, ICategoryRequestUpdate, ICategoryResponse } from '../../../models/place/place.model';
import placeService from '../../../services/place/place.service';
import { defaultAvatar } from '../../../utils';
import { TiCancel } from 'react-icons/ti';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useValidationSchema from '../../../hooks/validation/useValidationSchema';
import useUploadFile from '../../../hooks/useUploadFile';
import { toggleMessage } from '../../../components/views/Message/index.component';
import CreateUpdateForm from '../../../components/views/Admin/Categories/CreateUpdateForm/index.component';

export interface IAdminCategoriesManagementPageProps {}

interface IFormValue {
  name: string;
}

const AdminCategoriesManagementPage: NextPage = (props: IAdminCategoriesManagementPageProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const colorTxt = useColorModeValue('black', 'white');
  const [dataCategory, setDataCategory] = useState<ICategoryResponse | undefined>(undefined);
  const [dataCategories, setDataCategories] = useState<ICategoryResponse[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { upload, urlRef } = useUploadFile();
  const [pageableCategory, setPageableCategory] = useState<IPageableResponse>({
    hasNext: false,
    hasPrevious: false,
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest | undefined>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'id',
    sortType: 'ASC',
  });
  const { createCategorySchema } = useValidationSchema();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name: '',
    },
  });

  const fetchDataCategories = useCallback(async () => {
    try {
      const response = await placeService.getCategories(paramsPagination);
      setDataCategories(response.data.content);
      setPageableCategory(response.data.pageable);
    } catch (error) {
      console.log(error);
    }
  }, [paramsPagination]);

  useEffect(() => {
    fetchDataCategories();
  }, [fetchDataCategories]);

  const onSubmit = async (data: IFormValue, selectedFileAvatar: File | undefined) => {
    if (!selectedFileAvatar) {
      toggleMessage({ type: 'warning', message: 'Make default avatar to image category' });
    } else {
      await upload(selectedFileAvatar, 'category', 'category');
    }

    const params: ICategoryRequest = {
      name: data.name,
      image: selectedFileAvatar ? urlRef.current : defaultAvatar,
    };

    const response = await placeService.createCategory(params, setSubmitting);
    fetchDataCategories();
  };

  const onUpdate = async (name: string, id: number, selectedFileAvatar: File | undefined, image: string) => {
    if (selectedFileAvatar) {
      await upload(selectedFileAvatar, 'category', 'category');
    }

    const params: ICategoryRequestUpdate = {
      id: id.toString(),
      image: selectedFileAvatar ? urlRef.current : image,
      name: name,
    };
    const response = await placeService.updateCategory(params, setSubmitting);
    setDataCategory({ id: id, image: selectedFileAvatar ? urlRef.current : image, name: name });
    fetchDataCategories();
  };

  return (
    <Box mb='10' w='100%'>
      <SimpleGrid
        display={{
          base: 'initial',
          md: 'grid',
        }}
        columns={{
          md: 3,
        }}
        spacing={{
          md: 6,
        }}
      >
        <GridItem
          colSpan={{
            md: 1,
          }}
          shadow='lg'
          rounded={[null, 'md']}
          p='6'
          bg={boxBg}
        >
          <Box>
            {dataCategories.length ? (
              <>
                <TableContainer>
                  <Table variant='striped' colorScheme='pink'>
                    <TableCaption>Categories</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Id</Th>
                        <Th>Name</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dataCategories &&
                        dataCategories.length &&
                        dataCategories.map((item, index) => (
                          <Tr key={`${item.id}-${item.name}-${index}`} cursor='pointer' onClick={() => setDataCategory(item)}>
                            <Td>{item.id}</Td>
                            <Td>{item.name}</Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex mt='4' w='full' color={colorTxt} alignItems='center' justifyContent='center'>
                  <Pagination
                    onChange={(page) => {
                      if (page) {
                        const tempPagination = { ...paramsPagination };
                        tempPagination.pageNumber = page - 1;
                        setParamsPagination(tempPagination);
                      }
                    }}
                    activeStyles={{ bg: '#D0637C', color: 'white' }}
                    hoverStyles={{
                      bg: '#F5DDe0',
                      color: 'black',
                    }}
                    size='sm'
                    defaultCurrent={1}
                    total={pageableCategory.totalItems}
                    paginationProps={{
                      display: 'flex',
                    }}
                    pageNeighbours={1}
                  />
                </Flex>
              </>
            ) : (
              <Flex direction='row' justify='center' align='center' mb='5px'>
                <Spinner thickness='3px' speed='0.65s' emptyColor='gray.200' color='#D0637C' size='sm' />
                <Text as='samp'>&nbsp;Loading...</Text>
              </Flex>
            )}
          </Box>
        </GridItem>
        <GridItem
          colSpan={{
            md: 2,
          }}
          shadow='lg'
          rounded={[null, 'md']}
          px='6'
          pt='6'
          bg={boxBg}
          justifyContent='center'
          alignContent='center'
        >
          <Tabs colorScheme='pink' isFitted>
            <TabList>
              <Tab>Create</Tab>
              <Tab isDisabled={!dataCategory}>Update</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <CreateUpdateForm onSubmit={onSubmit} submitting={submitting} type='create' />
              </TabPanel>
              <TabPanel>
                <CreateUpdateForm
                  onUpdate={onUpdate}
                  dataCategory={dataCategory}
                  onSubmit={onSubmit}
                  submitting={submitting}
                  type='update'
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default AdminCategoriesManagementPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
