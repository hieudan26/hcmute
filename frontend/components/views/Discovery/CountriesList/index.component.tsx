import { Box, Button, Center, Divider, Flex, Grid, Heading, Skeleton, Text } from '@chakra-ui/react';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AxiosResponseStatus } from '../../../../constants/global.constant';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { ArrayTenTemp } from '../../../../pages/experiences';
import { useTranslation } from 'next-i18next';

export interface ICountriesListProps {
  places_countries: UseInfiniteQueryResult<AxiosResponseStatus<any, any>, unknown>;
}

export default function CountriesList(props: ICountriesListProps) {
  const { places_countries } = props;
  const { t } = useTranslation('discovery');
  const router = useRouter();

  const redirectToCountry = (urlName: string) => {
    router.push(`/discovery/${urlName}`);
  };

  return (
    <Box>
      <Flex direction='column' justify='center' align='center' textAlign='center'>
        <Heading as='h3' size='lg' fontWeight='semibold' mb='5'>
          {t('countries_world')}
        </Heading>
        <Text>{t('discover_destination')}</Text>
        <Divider color='#D0637C' w='10%' my='10' borderY='2px' />
      </Flex>
      <Grid templateColumns='repeat(5, 1fr)' gap={6} mb='5'>
        {places_countries.data &&
          places_countries.data.pages.map((page) =>
            page.data.content.map((item: IPlaceCountryResponse, index: number) => (
              <Button
                title={item.name}
                key={item.id}
                textTransform='uppercase'
                variant='outline'
                color='gray.500'
                onClick={() => {
                  redirectToCountry(item.url);
                }}
              >
                <Text noOfLines={1}>{item.name}</Text>
              </Button>
            ))
          )}
        {!places_countries.data &&
          ArrayTenTemp.map((item, index) => (
            <Skeleton key={index}>
              <Button textTransform='uppercase' variant='outline' color='gray.500'>
                item
              </Button>
            </Skeleton>
          ))}
      </Grid>
      {places_countries.hasNextPage && (
        <Center>
          <Button
            isLoading={places_countries.isFetching}
            fontStyle='italic'
            variant='ghost'
            fontWeight='medium'
            onClick={() => {
              places_countries.fetchNextPage();
            }}
          >
            {t('load_more')}
          </Button>
        </Center>
      )}
    </Box>
  );
}
