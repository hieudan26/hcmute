import { Box, Center, Divider } from '@chakra-ui/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import CountriesList from '../../components/views/Discovery/CountriesList/index.component';
import ProvincesList from '../../components/views/Discovery/ProvincesList/index.component';
import { usePlacesCountries, usePlacesProvincesByCountry } from '../../hooks/queries/place';
import { IPaginationRequest } from '../../models/common/ResponseMessage.model';
import placeService from '../../services/place/place.service';

export interface IDiscoveryProps {}

const Discovery: NextPage = (props: IDiscoveryProps) => {
  const [paramsPagination, setParamsPagination] = useState<IPaginationRequest>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'name',
    sortType: 'ASC',
  });
  const places_countries = usePlacesCountries(paramsPagination);
  const place_provinces_vn = usePlacesProvincesByCountry({ pagination: undefined, urlName: 'vietnam' }, true);

  return (
    <Box w='100%'>
      <CountriesList places_countries={places_countries} />
      <Center mx='36'>
        <Divider orientation='horizontal' my='14' borderColor='gray.500' />
      </Center>
      <ProvincesList place_provinces_vn={place_provinces_vn} />
      <Center mx='36'>
        <Divider orientation='horizontal' my='8' borderColor='transparent' />
      </Center>
    </Box>
  );
};

export default Discovery;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
