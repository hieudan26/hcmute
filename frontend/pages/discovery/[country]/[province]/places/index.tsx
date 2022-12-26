import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Text,
  AspectRatio,
  Heading,
  Stack,
  Divider,
  Highlight,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  chakra,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Spinner,
  SimpleGrid,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useFetchCategories,
  useFetchCountry,
  useFetchProvince,
  usePlacesPlacesByCountryProvince,
} from '../../../../../hooks/queries/place';
import { ICategoryResponse, IPlaceCountryResponse } from '../../../../../models/place/place.model';
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroller';
import { ArrayTenTemp } from '../../../../experiences';

export interface IProvincePlacesProps {}

const ProvincePlaces: NextPage = (props: IProvincePlacesProps) => {
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const bgCard = useColorModeValue('white', 'blackAlpha.800');
  const colorCard = useColorModeValue('gray.800', 'white');
  const bgNoResult = useColorModeValue('gray.200', 'blackAlpha.400');
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [typeCategory, setTypeCategory] = useState<string>('place');
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataCategoriesQuery = useFetchCategories(undefined, true);
  const dataProvince = useFetchProvince(
    { urlCountry: country ? country : '', urlProvince: province ? province : '' },
    country !== undefined && province !== undefined
  );
  const dataPlacesQuery = usePlacesPlacesByCountryProvince(
    {
      pagination: { pageNumber: 0, pageSize: 12 },
      urlCountry: country ? country : '',
      urlProvince: province ? province : '',
      type: typeCategory,
    },
    country !== undefined && province !== undefined
  );

  useEffect(() => {
    const { country: countryQuery, province: provinceQuery } = router.query;
    if (countryQuery) {
      setCountry(countryQuery as string);
    }

    if (provinceQuery) {
      setProvince(provinceQuery as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (dataProvince.data) {
      setData(dataProvince.data?.data as IPlaceCountryResponse);
    }
  }, [dataProvince]);

  const load = () => {
    if (
      !dataPlacesQuery.isFetching &&
      (!dataPlacesQuery.data ||
        (dataPlacesQuery.data.pages.length === 1 && dataPlacesQuery.data.pages[0].data.content.length === 0))
    ) {
      return (
        <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg={bgNoResult}>
          <Text>Hiện không có dữ liệu</Text>
        </Flex>
      );
    } else {
      return (
        <InfiniteScroll
          loadMore={() => dataPlacesQuery.fetchNextPage()}
          hasMore={dataPlacesQuery.hasNextPage}
          loader={
            <Center key={0}>
              <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
            </Center>
          }
        >
          <SimpleGrid columns={[2, null, 3]}>
            {dataPlacesQuery.data &&
              dataPlacesQuery.data.pages.map((page) =>
                page.data.content.map((item: IPlaceCountryResponse, index: number) => (
                  <Flex
                    title={item.name}
                    key={item.id}
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                    w='3xs'
                    mx='auto'
                    my='4'
                  >
                    <Box
                      bg='gray.300'
                      h={40}
                      w='full'
                      rounded='lg'
                      shadow='md'
                      bgSize='cover'
                      bgPos='center'
                      style={{
                        backgroundImage: `url(${item.image})`,
                      }}
                    />

                    <Box w='90%' bg={bgCard} mt={-10} shadow='lg' rounded='lg' overflow='hidden'>
                      <Text
                        noOfLines={1}
                        fontSize='sm'
                        px={2}
                        my={2}
                        textAlign='center'
                        fontWeight='bold'
                        textTransform='capitalize'
                        color={colorCard}
                        letterSpacing={1}
                      >
                        {item.name}
                      </Text>
                      <Flex
                        cursor='pointer'
                        fontSize='sm'
                        alignItems='center'
                        justifyContent='center'
                        py={2}
                        px={3}
                        bg='gray.200'
                        color='blackAlpha.800'
                        onClick={() => {
                          router.push(`/discovery/${country}/${province}/${item.url}`);
                        }}
                      >
                        <Text>Checkin now</Text>
                      </Flex>
                    </Box>
                  </Flex>
                ))
              )}

            {dataPlacesQuery.isFetching &&
              ArrayTenTemp.map((item, index: number) => (
                <Skeleton key={index} w='3xs' mx='auto' my='4'>
                  <Flex direction='column' justifyContent='center' alignItems='center' w='3xs' mx='auto' my='4'>
                    <Box bg='gray.300' h={40} w='full' rounded='lg' shadow='md' bgSize='cover' bgPos='center' />

                    <Box w='44' bg='white' mt={-10} shadow='lg' rounded='lg' overflow='hidden'>
                      <chakra.h3
                        py={2}
                        textAlign='center'
                        fontWeight='bold'
                        textTransform='capitalize'
                        color='gray.800'
                        letterSpacing={1}
                      ></chakra.h3>
                      <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg='gray.200'>
                        <Text>Checkin now</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Skeleton>
              ))}
          </SimpleGrid>
        </InfiniteScroll>
      );
    }
  };

  return (
    <Box w='full'>
      <Box mx='6'>
        <Box mb='4'>
          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href='/discovery'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Khám phá</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/discovery/${country}`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{dataCountry.data?.data.name}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/discovery/${country}/${province}`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{data?.name}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Link href={`/discovery/${country}/${province}/places`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Địa điểm</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Heading mb='8' textTransform='uppercase' color='#D0637C'>
          {data?.name}
        </Heading>
      </Box>
      <Flex justify='space-between' w='full' align='flex-start' gap={6}>
        <Box w='20%' bg={bgBox} shadow='md' border='1px' borderColor='gray.300' p='6' h='fit-content' position='sticky' top='20'>
          <Link href={`/discovery/${country}/${data?.url}`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Thông tin chung</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/places`}>
            <Flex
              cursor='pointer'
              justify='space-between'
              align='center'
              mb='4'
              fontWeight='semibold'
              fontStyle='italic'
              color='#D0637C'
            >
              <Text>Địa điểm</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/experiences`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Kinh nghiệm</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/images`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Hình ảnh</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/faqs`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Hỏi đáp</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Flex cursor='pointer' justify='space-between' align='center'>
            <Text>Hành trình</Text>
            <ChevronRightIcon />
          </Flex>
        </Box>
        <Box w='80%' bg={bgBox} p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          <Tabs colorScheme='pink'>
            <TabList>
              {dataCategoriesQuery &&
                dataCategoriesQuery.data?.data.content.map((item: ICategoryResponse, index: number) => {
                  if (item.name !== 'province' && item.name !== 'country') {
                    return (
                      <Tab
                        onClick={() => {
                          setTypeCategory(item.name);
                        }}
                        textTransform='capitalize'
                        key={`tab-${item.id}-${uuidv4()}`}
                      >
                        {item.name}
                      </Tab>
                    );
                  }
                })}
            </TabList>
            <TabPanels>
              {dataCategoriesQuery &&
                dataCategoriesQuery.data?.data.content.map((item: ICategoryResponse, index: number) => {
                  if (item.name !== 'province' && item.name !== 'country') {
                    return <TabPanel key={`panel-${item.id}-${uuidv4()}`}>{load()}</TabPanel>;
                  }
                })}
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProvincePlaces;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
