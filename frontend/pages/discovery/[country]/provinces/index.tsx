import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  chakra,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useFetchCountry, usePlacesProvincesByCountry } from '../../../../hooks/queries/place';
import { IPaginationRequest } from '../../../../models/common/ResponseMessage.model';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { ArrayTenTemp } from '../../../experiences';
import { useTranslation } from 'next-i18next';
import { useAppSelector } from '../../../../hooks/redux';
import { RoleConstants } from '../../../../constants/roles.constant';

export interface ICountryProvincesProps {}

const CountryProvinces: NextPage = (props: ICountryProvincesProps) => {
  const { t } = useTranslation('discovery_detail');
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const bgCard = useColorModeValue('white', 'blackAlpha.800');
  const colorCard = useColorModeValue('gray.800', 'white');
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth.value);
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest>({
    pageNumber: 0,
    pageSize: 12,
    sortBy: 'name',
    sortType: 'ASC',
  });
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataProvince = usePlacesProvincesByCountry(
    { pagination: paramsPagination, urlName: country ? country : '' },
    country !== undefined
  );

  useEffect(() => {
    const { country: countryQuery } = router.query;
    if (countryQuery) {
      setCountry(countryQuery as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (dataCountry.data) {
      setData(dataCountry.data?.data as IPlaceCountryResponse);
    }
  }, [dataCountry]);

  return (
    <Box w='full'>
      <Box mx='6'>
        <Box mb='4'>
          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href='/discovery'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{t('breadcrumb.discovery')}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/discovery/${data?.url}`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{data?.name}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Link href={`/discovery/${data?.url}/provinces`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{t('breadcrumb.province')}</BreadcrumbLink>
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
          <Link href={`/discovery/${data?.url}`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.introduce')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/provinces`}>
            <Flex
              cursor='pointer'
              justify='space-between'
              align='center'
              mb='4'
              fontWeight='semibold'
              fontStyle='italic'
              color='#D0637C'
            >
              <Text>{t('breadcrumb.province')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/experiences`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.experiences')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/images`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.images')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/faqs`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.faq')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Flex
            cursor='pointer'
            justify='space-between'
            align='center'
            mb={!auth || auth.role !== RoleConstants.USER ? '0' : '4'}
          >
            <Text>{t('breadcrumb.itinerary')}</Text>
            <ChevronRightIcon />
          </Flex>
          {auth && auth.role === RoleConstants.USER && (
            <Link href={`/discovery/${data?.url}/contribute`}>
              <Flex cursor='pointer' justify='space-between' align='center'>
                <Text>Đóng góp</Text>
                <ChevronRightIcon />
              </Flex>
            </Link>
          )}
        </Box>
        <Box w='80%' bg={bgBox} p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          {!dataProvince.isFetching &&
            (!dataProvince.data ||
              (dataProvince.data.pages.length === 1 && dataProvince.data.pages[0].data.content.length === 0)) && (
              <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg='gray.200'>
                <Text>{t('nodata')}</Text>
              </Flex>
            )}
          <InfiniteScroll
            loadMore={() => dataProvince.fetchNextPage()}
            hasMore={dataProvince.hasNextPage}
            loader={
              <Center key={0}>
                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
              </Center>
            }
          >
            <SimpleGrid columns={[2, null, 3]}>
              {dataProvince.data &&
                dataProvince.data.pages.map((page) =>
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
                            router.push(`/discovery/${data?.url}/${item.url}`);
                          }}
                        >
                          <Text>{t('checkin')}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  ))
                )}

              {dataProvince.isFetching &&
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
                          <Text>{t('checkin')}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Skeleton>
                ))}
            </SimpleGrid>
          </InfiniteScroll>
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryProvinces;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'discovery_detail'])),
      // Will be passed to the page component as props
    },
  };
};
