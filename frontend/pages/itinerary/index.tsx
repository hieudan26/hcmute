import {
  Box,
  Flex,
  Heading,
  Grid,
  Container,
  Center,
  Spinner,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Button,
} from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '../../components/views/Itinerary/Card/index.component';
import MoreInformation from '../../components/views/Itinerary/MoreInformation/index.component';
import { useTrips } from '../../hooks/queries/trip';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { ITripsResponseModel } from '../../models/trip/trip.model';
import { ArrayTenTemp } from '../experiences';

export interface IItineraryProps {}

const Itinerary: NextPage = (props: IItineraryProps) => {
  const array = [1, 2, 3, 4, 5];
  const trips = useTrips({
    key: undefined,
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'id',
    sortType: 'ASC',
    status: 'Public',
    type: undefined,
  });

  // useEffect(() => {
  //   console.log(trips.data?.pages[0].data);
  // }, [trips]);

  return (
    <Box mb='10'>
      <Heading textAlign='center' mb='10'>
        Lịch trình nổi bật
      </Heading>
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
