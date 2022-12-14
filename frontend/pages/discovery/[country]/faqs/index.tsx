import {
  Box,
  Flex,
  Text,
  AspectRatio,
  Heading,
  Stack,
  Divider,
  Highlight,
  chakra,
  SimpleGrid,
  Image,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spacer,
  Center,
  Spinner,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdHeadset, MdLocationOn, MdEmail } from 'react-icons/md';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFetchCountry } from '../../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { useCUDPost, usePostsByTypeAndHashTag } from '../../../../hooks/queries/posts';
import { IPostRequestModel, IPostRequestModelLoading, IPostResponseModel } from '../../../../models/post/post.model';
import { defaultAvatar } from '../../../../utils';
import { LocalUtils } from '../../../../utils/local.utils';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import CreatePost from '../../../../components/views/Profile/Posts/CreatePost/index.component';
import { useAppSelector } from '../../../../hooks/redux';
import { RoleConstants } from '../../../../constants/roles.constant';
import CreateNewPost from '../../../../components/views/Profile/Posts/Modals/CreateNewPost/index.component';
import { PropsValue } from 'react-select';
import InfiniteScroll from 'react-infinite-scroller';
import PostRender from '../../../../components/views/Profile/Posts/PostRender/index.component';
import { ArrayTenTemp } from '../../../experiences';
import { v4 as uuidv4 } from 'uuid';

export interface ICountryFaqsProps {}

const CountryFaqs: NextPage = (props: ICountryFaqsProps) => {
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [defaultValueTag, setDefaultValueTag] = useState<{ value: string; label: string }[]>([]);
  const auth = useAppSelector((state) => state.auth.value);
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataFaqsQuery = usePostsByTypeAndHashTag({
    pagination: { pageNumber: 0, pageSize: 12, sortBy: 'time', sortType: 'DESC' },
    hashTag: data ? data.hashTags[0] : '#vietnam',
    type: 'faq',
  });
  const { mutationCreatePost } = useCUDPost();

  useEffect(() => {
    const Tags: { value: string; label: string }[] = [];
    data?.hashTags.map((item) => {
      Tags.push({ value: item, label: item });
    });
    if (Tags.length) {
      setDefaultValueTag(Tags);
    }
  }, [data]);

  useEffect(() => {
    const isLoggedInCookie = LocalUtils.getCookie(CookieConstants.IS_FIRST_LOGIN) ? true : false;
    const avatarLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.AVATAR);
    const userIdLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);

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
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Khám phá</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/discovery/${data?.url}`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{data?.name}</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Link href={`/discovery/${data?.url}/faqs`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Hỏi đáp</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Heading mb='8' textTransform='uppercase' color='#D0637C'>
          {data?.name}
        </Heading>
      </Box>
      <Flex justify='space-between' w='full' align='flex-start' gap={6}>
        <Box w='20%' bg='white' shadow='md' border='1px' borderColor='gray.300' p='6' h='fit-content' position='sticky' top='20'>
          <Link href={`/discovery/${data?.url}`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Thông tin chung</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/provinces`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Tỉnh - Thành phố</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/experiences`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Kinh nghiệm</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/images`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Hình ảnh</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/faqs`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4' color='#D0637C'>
              <Text>Hỏi đáp</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Flex cursor='pointer' justify='space-between' align='center'>
            <Text>Hành trình</Text>
            <ChevronRightIcon />
          </Flex>
        </Box>
        <Box w='80%' bg='white' p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          {isLoggedIn && (
            <>
              <Box px='24'>
                <Heading py='2' px='3' as='h5' size='sm' mb='2' bg='gray.50' fontWeight='medium'>
                  Hỏi gì đáp nấy cùng cộng đồng Lumiere
                </Heading>
                <CreatePost
                  isDicovery
                  content='Câu hỏi của bạn ...'
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
                      <PostRender key={`country-faqs-${item.id}-${index}`} post={item} currentUserId={currentUserId} />
                    ))
                  )
                : ArrayTenTemp.map((item, index) => (
                    <>
                      <Box key={`country-faqstmp-${uuidv4()}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                        <SkeletonCircle size='10' />
                        <SkeletonText my='4' noOfLines={4} spacing='4' />
                        <Skeleton h='xs'></Skeleton>
                      </Box>
                    </>
                  ))}

              {dataFaqsQuery.isFetching &&
                ArrayTenTemp.map((item, index) => (
                  <>
                    <Box key={`country-faqsftc-${uuidv4()}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
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

export default CountryFaqs;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
