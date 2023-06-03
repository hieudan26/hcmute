import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
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
import ModalContainer from '../../../../../components/views/Modals/ModalContainer/index.component';
import { useImagesHashTag } from '../../../../../hooks/queries/hashtag';
import { useFetchCountry, useFetchProvince } from '../../../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../../../models/place/place.model';
import { ArrayTenTemp } from '../../../../experiences';
import { useTranslation } from 'next-i18next';
import { useAppSelector } from '../../../../../hooks/redux';
import { RoleConstants } from '../../../../../constants/roles.constant';

export interface IProvinceImagesProps {}

const ProvinceImages: NextPage = (props: IProvinceImagesProps) => {
  const { t } = useTranslation('discovery_detail');
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth.value);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [modal, setModal] = useState<boolean>(false);
  const [tempSrc, setTempSrc] = useState<string>('');
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataProvince = useFetchProvince(
    { urlCountry: country ? country : '', urlProvince: province ? province : '' },
    country !== undefined && province !== undefined
  );
  const dataImagesQuery = useImagesHashTag(
    { pagination: { pageNumber: 0, pageSize: 10 }, hashTag: data ? data.hashTags[0] : '#vietnam', type: 'experience' },
    true
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

  const getImg = (url: string) => {
    setTempSrc(url);
    setModal(true);
  };

  return (
    <Box w='full'>
      <ModalContainer isOpen={modal} size='xl'>
        <ModalHeader display='flex' flexDirection='column' alignItems='center'>
          {/* Detail image about {data?.name} */}
          {t('detail_image')} {data?.name}
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            setModal(false);
          }}
        />
        <ModalBody>
          <Image src={tempSrc} alt={'no'} w='full' rounded='md' maxH='md' />
        </ModalBody>
      </ModalContainer>
      <Box mx='6'>
        <Box mb='4'>
          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href='/discovery'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{t('breadcrumb.discovery')}</BreadcrumbLink>
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
              <Link href={`/discovery/${country}/${province}/images`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{t('breadcrumb.images')}</BreadcrumbLink>
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
              <Text>{t('breadcrumb.introduce')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/places`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.province')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/experiences`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.experiences')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/images`}>
            <Flex
              cursor='pointer'
              justify='space-between'
              align='center'
              mb='4'
              fontWeight='semibold'
              fontStyle='italic'
              color='#D0637C'
            >
              <Text>{t('breadcrumb.images')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/faqs`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.faq')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          {auth && auth.role === RoleConstants.USER && (
            <Link href={`/discovery/${country}/${data?.url}/contribute`}>
              <Flex cursor='pointer' justify='space-between' align='center'>
                <Text>Đóng góp</Text>
                <ChevronRightIcon />
              </Flex>
            </Link>
          )}
        </Box>
        <Box w='80%' bg={bgBox} p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          {dataImagesQuery.data?.pages[0].data.content.length === 0 ? (
            <Center py='2'>
              <Text>{t('nodata')}</Text>
            </Center>
          ) : (
            <InfiniteScroll
              loadMore={() => dataImagesQuery.fetchNextPage()}
              hasMore={dataImagesQuery.hasNextPage}
              loader={
                <Center key={0} my='5'>
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
                </Center>
              }
            >
              <Box
                style={{
                  WebkitColumnCount: 3,
                  MozColumnCount: 3,
                  columnCount: 3,
                  WebkitColumnWidth: '33%',
                  MozColumnWidth: '33%',
                  columnWidth: '33%',
                  padding: '0 12px',
                }}
                className='gallery'
              >
                {dataImagesQuery.data
                  ? dataImagesQuery.data.pages.map((page) =>
                      page.data.content.map((item: string, index: number) => (
                        <Box
                          style={{
                            WebkitTransition: 'all 350ms ease',
                            transition: 'all 350ms ease',
                            cursor: 'pointer',
                            marginBottom: '12px',
                          }}
                          _hover={{
                            filter: 'opacity(.8)',
                          }}
                          className='pics'
                          key={index}
                          onClick={() => {
                            getImg(item);
                          }}
                        >
                          <Image src={item} alt={index.toString()} width='full' rounded='md' />
                        </Box>
                      ))
                    )
                  : ArrayTenTemp.map((item, index) => (
                      <>
                        <Box
                          style={{
                            WebkitTransition: 'all 350ms ease',
                            transition: 'all 350ms ease',
                            cursor: 'pointer',
                            marginBottom: '12px',
                          }}
                          _hover={{
                            filter: 'opacity(.8)',
                          }}
                          className='pics'
                          key={index}
                        >
                          <Skeleton key={`skexp-${index}`} h='xs'></Skeleton>
                        </Box>
                      </>
                    ))}
              </Box>
            </InfiniteScroll>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ProvinceImages;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'discovery_detail'])),
      // Will be passed to the page component as props
    },
  };
};
