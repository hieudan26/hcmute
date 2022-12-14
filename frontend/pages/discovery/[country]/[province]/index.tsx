import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Introduce from '../../../../components/views/Discovery/Introduce/index.component';
import { useFetchCountry, useFetchProvince } from '../../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';

export interface ICountryProvinceProps {}

const CountryProvince: NextPage = (props: ICountryProvinceProps) => {
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataProvince = useFetchProvince(
    { urlCountry: country ? country : '', urlProvince: province ? province : '' },
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

            <BreadcrumbItem isCurrentPage>
              <Link href={`/discovery/${country}/${province}`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>{data?.name}</BreadcrumbLink>
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
          <Link href={`/discovery/${country}/${data?.url}`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4' color='#D0637C'>
              <Text>Thông tin chung</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${data?.url}/places`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
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
        <Box w='80%' bg='white' p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          <Introduce data={data} />
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryProvince;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
