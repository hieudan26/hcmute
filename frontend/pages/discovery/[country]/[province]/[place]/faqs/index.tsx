import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { v4 as uuidv4 } from 'uuid';
import CreatePost from '../../../../../../components/views/Profile/Posts/CreatePost/index.component';
import CreateNewPost from '../../../../../../components/views/Profile/Posts/Modals/CreateNewPost/index.component';
import PostRender from '../../../../../../components/views/Profile/Posts/PostRender/index.component';
import { RoleConstants } from '../../../../../../constants/roles.constant';
import { CookieConstants, LocalStorageConstants } from '../../../../../../constants/store.constant';
import { useFetchCountry, useFetchPlace, useFetchProvince } from '../../../../../../hooks/queries/place';
import { useCUDPost, usePostsByTypeAndHashTag } from '../../../../../../hooks/queries/posts';
import { useAppSelector } from '../../../../../../hooks/redux';
import { IPlaceCountryResponse } from '../../../../../../models/place/place.model';
import { IPostRequestModel, IPostRequestModelLoading, IPostResponseModel } from '../../../../../../models/post/post.model';
import { defaultAvatar, timeRefreshDataTenSeconds } from '../../../../../../utils';
import { LocalUtils } from '../../../../../../utils/local.utils';
import { ArrayTenTemp } from '../../../../../experiences';
import { useTranslation } from 'next-i18next';
import { useQueryClient } from '@tanstack/react-query';

export interface IPlaceFaqsProps {}

const PlaceFaqs: NextPage = (props: IPlaceFaqsProps) => {
  const { t } = useTranslation('discovery_detail');
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const bgHeading = useColorModeValue('gray.50', 'blackAlpha.400');
  const router = useRouter();
  const modalRef = useRef(false);
  const queryClient = useQueryClient();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [place, setPlace] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [defaultValueTag, setDefaultValueTag] = useState<{ value: string; label: string }[]>([]);
  const auth = useAppSelector((state) => state.auth.value);
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataProvince = useFetchProvince(
    { urlCountry: country ? country : '', urlProvince: province ? province : '' },
    country !== undefined && province !== undefined
  );
  const dataPlace = useFetchPlace(
    { urlCountry: country ? country : '', urlProvince: province ? province : '', urlPlace: place ? place : '' },
    country !== undefined && province !== undefined && place !== undefined
  );
  const dataFaqsQuery = usePostsByTypeAndHashTag({
    pagination: { pageNumber: 0, pageSize: 12, sortBy: 'time', sortType: 'DESC' },
    hashTags: data ? data.hashTags : ['#vietnam'],
    type: 'faq',
    isDeleted: false,
  });
  const { mutationCreatePost } = useCUDPost();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!modalRef.current) {
        queryClient.invalidateQueries(['posts_by_type_hashTag']);
      }
    }, timeRefreshDataTenSeconds);

    return () => clearInterval(interval);
  }, [queryClient, modalRef]);

  useEffect(() => {
    const Tags: { value: string; label: string }[] = [];
    dataCountry.data?.data.hashTags.map((item: string) => {
      Tags.push({ value: item, label: item });
    });

    dataProvince.data?.data.hashTags.map((item: string) => {
      Tags.push({ value: item, label: item });
    });

    data?.hashTags.map((item) => {
      Tags.push({ value: item, label: item });
    });
    if (Tags.length) {
      setDefaultValueTag(Tags);
    }
  }, [data, dataCountry.data?.data.hashTags, dataProvince.data?.data.hashTags]);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const userIdLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);
    const avatarLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);

    if (userIdLocalStorage) {
      if (auth?.role === RoleConstants.USER) {
        setCurrentUserId(userIdLocalStorage);
        setIsLoggedIn(isLoggedInCookie);
      }
    }

    if (isLoggedInCookie && avatarLocalStorage) {
      setAvatar(avatarLocalStorage);
    }
  }, [auth]);

  useEffect(() => {
    const { country: countryQuery, province: provinceQuery, place: placeQuery } = router.query;
    if (countryQuery) {
      setCountry(countryQuery as string);
    }

    if (provinceQuery) {
      setProvince(provinceQuery as string);
    }

    if (placeQuery) {
      setPlace(placeQuery as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (dataPlace.data) {
      setData(dataPlace.data?.data as IPlaceCountryResponse);
    }
  }, [dataPlace]);

  const _submitPost = async (params: IPostRequestModel) => {
    const paramsLoading: IPostRequestModelLoading = { ...params, setSubmitting: undefined };
    mutationCreatePost.mutate(paramsLoading);
  };

  return (
    <Box w='full'>
      <CreateNewPost
        currentUserId={currentUserId}
        onSubmit={_submitPost}
        type='faq'
        isOpen={isCreatePost}
        onClose={() => setIsCreatePost(false)}
        defaultValueTag={defaultValueTag}
      />
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
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{dataProvince.data?.data.name}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/discovery/${country}/${province}/${place}`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{data?.name}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Link href={`/discovery/${country}/${province}/${place}/faqs`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{t('breadcrumb.faq')}</BreadcrumbLink>
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
          <Link href={`/discovery/${country}/${province}/${data?.url}`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.introduce')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${province}/${data?.url}/places`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.others_location')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${province}/${data?.url}/experiences`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.experiences')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${province}/${data?.url}/images`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.images')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${province}/${data?.url}/faqs`}>
            <Flex
              cursor='pointer'
              justify='space-between'
              align='center'
              mb='4'
              fontWeight='semibold'
              fontStyle='italic'
              color='#D0637C'
            >
              <Text>{t('breadcrumb.faq')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          {auth && auth.role === RoleConstants.USER && (
            <Link href={`/discovery/${country}/${province}/${data?.url}/contribute`}>
              <Flex cursor='pointer' justify='space-between' align='center'>
                <Text>Đóng góp</Text>
                <ChevronRightIcon />
              </Flex>
            </Link>
          )}
        </Box>
        <Box w='80%' bg={bgBox} p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          {isLoggedIn && (
            <>
              <Box px='24'>
                <Heading py='2' px='3' as='h5' size='sm' mb='2' bg={bgHeading} fontWeight='medium'>
                  {t('faq.heading')}
                </Heading>
                <CreatePost
                  isDicovery
                  content={t('faq.input')}
                  avatar={avatar}
                  onCreate={() => {
                    setIsCreatePost(true);
                  }}
                />
              </Box>
              <Spacer h='7' my='1'>
                <Center color='gray.300'>---</Center>
              </Spacer>
            </>
          )}
          <SimpleGrid>
            <InfiniteScroll
              loadMore={() => dataFaqsQuery.fetchNextPage()}
              hasMore={dataFaqsQuery.hasNextPage}
              loader={
                <Center key={0}>
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
                </Center>
              }
            >
              {dataFaqsQuery.data
                ? dataFaqsQuery.data.pages.map((page) =>
                    page.data.content.map((item: IPostResponseModel, index: number) => (
                      <PostRender
                        modalRef={modalRef}
                        isHashtag
                        key={`place-faqs-${item.id}-${index}`}
                        post={item}
                        currentUserId={currentUserId}
                      />
                    ))
                  )
                : ArrayTenTemp.map((item, index) => (
                    <>
                      <Box key={`place-faqstmp-${uuidv4()}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                        <SkeletonCircle size='10' />
                        <SkeletonText my='4' noOfLines={4} spacing='4' />
                        <Skeleton h='xs'></Skeleton>
                      </Box>
                    </>
                  ))}

              {dataFaqsQuery.isFetching &&
                ArrayTenTemp.map((item, index) => (
                  <>
                    <Box key={`place-faqsftc-${uuidv4()}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                      <SkeletonCircle size='10' />
                      <SkeletonText my='4' noOfLines={4} spacing='4' />
                      <Skeleton h='xs'></Skeleton>
                    </Box>
                  </>
                ))}
            </InfiniteScroll>
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default PlaceFaqs;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'header',
        'footer',
        'modal_is_first_login',
        'modal_create_post',
        'post',
        'discovery_detail',
      ])),
      // Will be passed to the page component as props
    },
  };
};
