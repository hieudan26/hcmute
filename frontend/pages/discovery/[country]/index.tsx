import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Introduce from '../../../components/views/Discovery/Introduce/index.component';
import { useFetchCountry } from '../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../models/place/place.model';
import { useTranslation } from 'next-i18next';

export interface IDiscoveryCountryProps {}

const DiscoveryCountry: NextPage = (props: IDiscoveryCountryProps) => {
  const { t } = useTranslation('discovery_detail');
  const bgBox = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IPlaceCountryResponse | undefined>(undefined);
  const dataCountry = useFetchCountry(country ? country : '', country !== undefined);

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

            <BreadcrumbItem isCurrentPage>
              <Link href={`/discovery/${data?.url}`}>
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
        <Box w='20%' bg={bgBox} shadow='md' border='1px' borderColor='gray.300' p='6' h='fit-content' position='sticky' top='20'>
          <Link href={`/discovery/${data?.url}`}>
            <Flex
              cursor='pointer'
              justify='space-between'
              align='center'
              mb='4'
              fontWeight='semibold'
              fontStyle='italic'
              color='#D0637C'
            >
              <Text>{t('breadcrumb.introduce')}</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Link href={`/discovery/${data?.url}/provinces`}>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
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
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>{t('breadcrumb.itinerary')}</Text>
            <ChevronRightIcon />
          </Flex>
          <Link href={`/discovery/${data?.url}/contribute`}>
            <Flex cursor='pointer' justify='space-between' align='center'>
              <Text>Đóng góp</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
        </Box>
        <Box w='80%' bg={bgBox} p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          <Introduce data={data} />
        </Box>
      </Flex>
    </Box>
  );
};

export default DiscoveryCountry;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'discovery_detail'])),
      // Will be passed to the page component as props
    },
  };
};
