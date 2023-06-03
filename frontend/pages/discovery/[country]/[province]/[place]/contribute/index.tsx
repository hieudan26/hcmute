import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DiscoveryContribute from '../../../../../../components/views/Discovery/Contribute/index.component';
import { useFetchCountry, useFetchPlace, useFetchProvince } from '../../../../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../../../../models/place/place.model';

export interface ICountryProvincePlaceContributeProps {}

const CountryProvincePlaceContribute: NextPage = (props: ICountryProvincePlaceContributeProps) => {
  const { t } = useTranslation('discovery_detail');
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [place, setPlace] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);

  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);
  const dataProvince = useFetchProvince(
    { urlCountry: country ? country : '', urlProvince: province ? province : '' },
    country !== undefined && province !== undefined
  );
  const dataPlace = useFetchPlace(
    { urlCountry: country ? country : '', urlProvince: province ? province : '', urlPlace: place ? place : '' },
    country !== undefined && province !== undefined && place !== undefined
  );

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
              <Link href={`/discovery/${country}/${province}/${place}/contribute`}>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Đóng góp</BreadcrumbLink>
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
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>{t('breadcrumb.faq')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${country}/${province}/${data?.url}/contribute`}>
            <Flex
              cursor='pointer'
              justify='space-between'
              align='center'
              fontWeight='semibold'
              fontStyle='italic'
              color='#D0637C'
            >
              <Text>Đóng góp</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
        </Box>
        <Box w='80%' bg={bgBox} p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          <Text mb='5' align='center'>
            Hãy đóng góp những điểm du lịch, tham quan, vui chơi hấp dẫn giống như {data?.name} nhé 😘
          </Text>
          <Center>
            <DiscoveryContribute areaData={dataProvince.data?.data} />
          </Center>
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryProvincePlaceContribute;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'header',
        'footer',
        'modal_is_first_login',
        'modal_create_post',
        'discovery_detail',
      ])),
      // Will be passed to the page component as props
    },
  };
};
