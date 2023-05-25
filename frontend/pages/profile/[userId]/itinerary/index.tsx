import {
  Box,
  Button,
  Center,
  Grid,
  RadioGroup,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Radio,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Input,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import Card from '../../../../components/views/Itinerary/Card/index.component';
import { useTrips, useTripsByUserId } from '../../../../hooks/queries/trip';
import { ITripsResponseModel } from '../../../../models/trip/trip.model';
import { ArrayTenTemp } from '../../../experiences';
import LayoutTab from '../../../../components/views/Profile/LayoutTab/index.component';
import { useAppSelector } from '../../../../hooks/redux';
import { SearchIcon } from '@chakra-ui/icons';

export interface IProfileItineraryProps {}

const ProfileItinerary: NextPage = (props: IProfileItineraryProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const auth = useAppSelector((state) => state.auth.value);
  const trips = useTripsByUserId(
    {
      id: auth ? auth.id : '1',
      key: key === '' ? undefined : key,
      pageNumber: 0,
      pageSize: 9,
      sortBy: 'id',
      sortType: 'ASC',
      status: tabIndex === 0 ? 'Public' : 'Private',
      type: filterType === '' ? undefined : (filterType as 'Plan' | 'Adventure'),
    },
    auth !== null
  );

  const onChangeSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const filter = (event: any) => {
    setFilterType(event.target.value);
  };

  return (
    <LayoutTab title='Hành trình' isItinerary>
      <Flex w='full' gap='4' mb='2'>
        <Input type='search' placeholder='Tìm kiếm hành trình theo tên' value={search} onChange={onChangeSearch} />
        <IconButton
          colorScheme='blue'
          aria-label='Search database'
          icon={<SearchIcon />}
          onClick={() => {
            setKey(search);
          }}
        />
        <Select w='50%' onChange={filter}>
          <option value=''>Mặc định</option>
          <option value='Adventure'>Hành trình đã trải nghiệm</option>
          <option value='Plan'>Hành trình chưa trải nghiệm</option>
        </Select>
      </Flex>
      <Tabs onChange={(index) => setTabIndex(index)} position='relative' colorScheme='pink'>
        <TabList>
          <Tab>Công khai</Tab>
          <Tab>Chưa đủ điều kiện công khai</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid gap='4' templateColumns='repeat(3, 1fr)' mb='6'>
              {trips.data
                ? trips.data.pages.map((page) =>
                    page.data.content.map((item: ITripsResponseModel, index: number) => (
                      <Card data={item} key={item.id} isItinerary />
                    ))
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
          </TabPanel>
          <TabPanel>
            <Grid gap='4' templateColumns='repeat(3, 1fr)' mb='6'>
              {trips.data
                ? trips.data.pages.map((page) =>
                    page.data.content.map((item: ITripsResponseModel, index: number) => (
                      <Card data={item} key={item.id} isItinerary />
                    ))
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </LayoutTab>
  );
};

export default ProfileItinerary;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'profile', 'suggest_friends'])),
      // Will be passed to the page component as props
    },
  };
};
