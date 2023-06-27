import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Input,
  Select,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import Card from '../../components/views/Itinerary/Card/index.component';
import MoreInformation from '../../components/views/Itinerary/MoreInformation/index.component';
import { useTrips } from '../../hooks/queries/trip';
import { ITripsResponseModel } from '../../models/trip/trip.model';
import { ArrayTenTemp } from '../experiences';

export interface IItineraryProps {}

const Itinerary: NextPage = (props: IItineraryProps) => {
  const [search, setSearch] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const queryClient = useQueryClient();
  const trips = useTrips({
    key: key === '' ? undefined : key,
    pageNumber: 0,
    pageSize: 9,
    sortBy: 'id',
    sortType: 'ASC',
    status: 'Public',
    type: filterType === '' ? undefined : (filterType as 'Plan' | 'Adventure'),
  });

  useEffect(() => {
    queryClient.invalidateQueries(['trips']);
  }, [queryClient]);

  const onChangeSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const filter = (event: any) => {
    setFilterType(event.target.value);
  };

  return (
    <Box mb='10'>
      <Heading textAlign='center' mb='10'>
        Lịch trình nổi bật
      </Heading>
      <Flex w='full' gap='4' mb='6' px='8'>
        <Input type='search' bg='white' placeholder='Tìm kiếm hành trình theo tên' value={search} onChange={onChangeSearch} />
        <IconButton
          colorScheme='blue'
          aria-label='Search database'
          icon={<SearchIcon />}
          onClick={() => {
            setKey(search);
          }}
        />
        <Select w='50%' onChange={filter} bg='white'>
          <option value=''>Mặc định</option>
          <option value='Adventure'>Hành trình đã trải nghiệm</option>
          <option value='Plan'>Hành trình chưa trải nghiệm</option>
        </Select>
      </Flex>
      <Container maxW='8xl'>
        <Grid gap='6' templateColumns='repeat(3, 1fr)' mb='6'>
          {trips.data
            ? trips.data.pages.map((page) =>
                page.data.content.map((item: ITripsResponseModel, index: number) => <Card data={item} key={item.id} />)
              )
            : ArrayTenTemp.map((item, index) => (
                <>
                  <Box key={`trips-${index}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                    <SkeletonCircle size='10' />
                    <SkeletonText my='4' noOfLines={4} spacing='4' />
                    <Skeleton h='xs'></Skeleton>
                  </Box>
                </>
              ))}
        </Grid>

        {trips.isFetching &&
          ArrayTenTemp.map((item, index) => (
            <>
              <Box key={`boxexpft-${index}`} padding='6' boxShadow='lg' bg='white' mb='5' rounded='md'>
                <SkeletonCircle size='10' />
                <SkeletonText my='4' noOfLines={4} spacing='4' />
                <Skeleton h='xs'></Skeleton>
              </Box>
            </>
          ))}
        {trips.hasNextPage && (
          <Center>
            <Button
              variant='ghost'
              onClick={() => {
                trips.fetchNextPage();
              }}
            >
              Tải thêm
            </Button>
          </Center>
        )}
      </Container>
      <MoreInformation />
    </Box>
  );
};

export default Itinerary;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
