import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Grid, GridItem, IconButton, Skeleton, Text } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AxiosResponseStatus } from '../../../../constants/global.constant';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { Array25Temp, truncate } from '../../../../utils';

export interface ICountriesCarouselProps {
  places_countries: UseQueryResult<AxiosResponseStatus<any, any>, unknown>;
  onChangeUrlCountry: (country: IPlaceCountryResponse) => void;
  currentUrlCountry: string;
}

export default function CountriesCarousel(props: ICountriesCarouselProps) {
  const { places_countries, onChangeUrlCountry, currentUrlCountry } = props;
  const [length, setLength] = useState<number>(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (places_countries.data) {
      setLength(places_countries.data.data.content.length);
    }
  }, [places_countries]);

  const numPages = Math.ceil(length / 25);

  const handlePrev = () => setPage((page) => Math.max(page - 1, 0));
  const handleNext = () => setPage((page) => Math.min(page + 1, numPages - 1));

  return (
    <Flex direction='row' alignItems='center' w='full' mt='8'>
      <IconButton aria-label='Previous' icon={<ChevronLeftIcon />} onClick={handlePrev} disabled={page === 0} mr={4} />
      <Grid templateColumns='repeat(5, 1fr)' gap={6} mb='5' w='full'>
        {places_countries.data &&
          places_countries.data.data.content.slice(page * 25, page * 25 + 25).map((item: IPlaceCountryResponse) => (
            <GridItem w='full' key={item.id} colSpan={1}>
              <Button
                title={item.name}
                w='full'
                key={item.id}
                textTransform='uppercase'
                variant={currentUrlCountry === item.url ? 'solid' : 'outline'}
                color={currentUrlCountry === item.url ? 'white' : 'gray.500'}
                onClick={() => {
                  onChangeUrlCountry(item);
                }}
              >
                <Text>{item.name ? truncate(item.name, 15) : 'none'}</Text>
              </Button>
            </GridItem>
          ))}
        {!places_countries.data &&
          Array25Temp.map((item, index) => (
            <Skeleton key={index}>
              <Button textTransform='uppercase' variant='outline' color='gray.500'>
                item
              </Button>
            </Skeleton>
          ))}
      </Grid>
      <IconButton aria-label='Next' icon={<ChevronRightIcon />} onClick={handleNext} disabled={page === numPages - 1} ml={4} />
    </Flex>
  );
}
