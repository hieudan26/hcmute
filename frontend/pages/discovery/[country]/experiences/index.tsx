import { ChevronRightIcon, SmallAddIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { v4 as uuidv4 } from 'uuid';
import ExperienceCard from '../../../../components/views/Discovery/ExperienceCard/index.component';
import CreateNewPost from '../../../../components/views/Profile/Posts/Modals/CreateNewPost/index.component';
import { RoleConstants } from '../../../../constants/roles.constant';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import { useFetchCountry } from '../../../../hooks/queries/place';
import { useCUDPost, usePostsByTypeAndHashTag } from '../../../../hooks/queries/posts';
import { useAppSelector } from '../../../../hooks/redux';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { IPostRequestModel, IPostRequestModelLoading, IPostResponseModel } from '../../../../models/post/post.model';
import { LocalUtils } from '../../../../utils/local.utils';
import { ArrayTenTemp } from '../../../experiences';

export interface ICountryExperiencesProps {}

const CountryExperiences: NextPage = (props: ICountryExperiencesProps) => {
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [defaultValueTag, setDefaultValueTag] = useState<{ value: string; label: string }[]>([]);
  const auth = useAppSelector((state) => state.auth.value);
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataExperiencesQuery = usePostsByTypeAndHashTag({
    pagination: { pageNumber: 0, pageSize: 12, sortBy: 'time', sortType: 'DESC' },
    hashTag: data ? data.hashTags[0] : '#vietnam',
    type: 'experience',
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
    const userIdLocalStorage = LocalUtils.getLocalStorage(LocalStorageConstants.USER_ID);

    if (userIdLocalStorage) {
      if (auth?.role === RoleConstants.USER) {
        setCurrentUserId(userIdLocalStorage);
        setIsLoggedIn(isLoggedInCookie);
      }
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
        type='experience'
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
              <Link href={`/discovery/${data?.url}/experiences`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Kinh nghiệm</BreadcrumbLink>
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
            <Flex cursor='pointer' justify='space-between' align='center' mb='4' color='#D0637C'>
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
        <Box w='80%' bg='white' p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          <Flex justify='space-between' align='center' gap='6'>
            <Box>
              <Heading size='md' fontWeight='medium' mb='4'>
                Bạn muốn bài viết của mình xuất hiện ở đây ?
              </Heading>
              <Text fontSize='sm'>
                Chia sẻ trải nghiệm, review ... du lịch của bạn với cộng đồng LUMIERE để tích điểm và nhận nhiều phần quà hấp dẫn
                đổi quà
              </Text>
            </Box>
            <Box>
              <Button onClick={() => setIsCreatePost(true)} leftIcon={<SmallAddIcon />}>
                CHIA SẺ TRẢI NGHIỆM
              </Button>
            </Box>
          </Flex>

          <InfiniteScroll
            loadMore={() => dataExperiencesQuery.fetchNextPage()}
            hasMore={dataExperiencesQuery.hasNextPage}
            loader={
              <Center key={0}>
                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='pink.500' size='xl' />
              </Center>
            }
          >
            <SimpleGrid columns={[2, null, 3]}>
              {dataExperiencesQuery.data
                ? dataExperiencesQuery.data.pages.map((page) =>
                    page.data.content.map((item: IPostResponseModel, index: number) => (
                      <ExperienceCard data={item} key={`country-experiences-${item.id}-${index}`} />
                    ))
                  )
                : ArrayTenTemp.map((item, index) => (
                    <>
                      <Box key={`country-expstmp-${uuidv4()}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                        <SkeletonCircle size='10' />
                        <SkeletonText my='4' noOfLines={4} spacing='4' />
                        <Skeleton h='xs'></Skeleton>
                      </Box>
                    </>
                  ))}

              {dataExperiencesQuery.isFetching &&
                ArrayTenTemp.map((item, index) => (
                  <>
                    <Box key={`country-expsftc-${uuidv4()}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                      <SkeletonCircle size='10' />
                      <SkeletonText my='4' noOfLines={4} spacing='4' />
                      <Skeleton h='xs'></Skeleton>
                    </Box>
                  </>
                ))}
            </SimpleGrid>
          </InfiniteScroll>
          {/* <ExperienceCard />
            <ExperienceCard />
            <ExperienceCard />
            <ExperienceCard />
            <ExperienceCard /> */}
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryExperiences;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
