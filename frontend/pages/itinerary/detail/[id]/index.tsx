import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Card from '../../../../components/views/Itinerary/Card/index.component';
import DayListDetail from '../../../../components/views/Itinerary/DayListDetail/index.component';
import MainContentDetail from '../../../../components/views/Itinerary/MainContentDetail/index.component';
import Review from '../../../../components/views/Itinerary/Review/index.component';
import { useTripById, useTripMembers, useTrips } from '../../../../hooks/queries/trip';
import { useAppSelector } from '../../../../hooks/redux';
import { ITripsResponseModel } from '../../../../models/trip/trip.model';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import tripService from '../../../../services/trip/trip.service';
import { ArrayTenTemp } from '../../../experiences';

export interface IItineraryDetailProps {}

const ItineraryDetail: NextPage = (props: IItineraryDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [idTrip, setIdTrip] = useState<string>('');
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalMembersGet, setTotalMembersGet] = useState<number>(0);
  const [charKey, setCharKey] = useState<string>('');
  const [statusUser, setStatusUser] = useState<string>('NONE'); // NONE - MEMBER - REJECT - PENDING
  const [isLoadingRequestJoin, setIsLoadingRequestJoin] = useState<boolean>(false);
  const trip = useTripById(idTrip, undefined, idTrip !== '');
  const auth = useAppSelector((state) => state.auth.value);
  const members = useTripMembers(
    {
      params: {
        pageNumber: 0,
        pageSize: 4,
      },
      tripId: Number(idTrip),
      key: undefined,
    },
    idTrip !== ''
  );
  const trips = useTrips({
    key: charKey !== '' ? charKey : undefined,
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'id',
    sortType: 'ASC',
    status: 'Public',
    type: undefined,
  });

  const fetchStatusRequest = async () => {
    const resp = await tripService.getRequestStatus((trip.data.data as ITripsResponseModel).id);
    setStatusUser(resp.data.status);
  };

  useEffect(() => {
    if (trip.data && auth) {
      fetchStatusRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.data]);

  useEffect(() => {
    if (trip.data) {
      setCharKey((trip.data.data as ITripsResponseModel).title[0]);
    } else {
      setCharKey('');
    }
  }, [trip.data]);

  useEffect(() => {
    if (members.data) {
      setTotalMembersGet(members.data.pages[0].data.content.length);
      setTotalMembers(members.data.pages[0].data.pageable.totalItems);
    }
  }, [members]);

  useEffect(() => {
    const { id } = router.query;
    setIdTrip(id as string);
    queryClient.invalidateQueries(['trip_by_id']);
    queryClient.invalidateQueries(['trip_members']);
    queryClient.invalidateQueries(['trips']);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const sendRequestJoinTrip = async () => {
    if (trip.data && auth) {
      if (statusUser === 'PENDING') {
        try {
          setIsLoadingRequestJoin(true);
          await tripService.cancelRequestStatus((trip.data.data as ITripsResponseModel).id);
        } catch (err: any) {
          console.log(err);
        } finally {
          await fetchStatusRequest();
          setIsLoadingRequestJoin(false);
        }
      } else if (statusUser === 'NONE') {
        try {
          setIsLoadingRequestJoin(true);
          await tripService.createRequestJoinTrip((trip.data.data as ITripsResponseModel).id);
        } catch (err: any) {
          console.log(err);
        } finally {
          await fetchStatusRequest();
          setIsLoadingRequestJoin(false);
        }
      }
    }
  };

  const renderContentButton = () => {
    if (statusUser === 'NONE') {
      return 'Gửi yêu cầu tham gia';
    } else if (statusUser === 'MEMBER') {
      return 'Bạn đã là thành viên';
    } else if (statusUser === 'REJECTED') {
      return 'Bạn đã bị từ chối yêu cầu tham gia';
    } else if (statusUser === 'PENDING') {
      return 'Hủy yêu cầu tham gia';
    }
  };

  return (
    <>
      <Box mb='10' w='full'>
        <Heading as='h4' size='md' mb='2'>
          {trip.data ? (trip.data.data as ITripsResponseModel).title : 'Hà Giang kí sự'}
        </Heading>
        <Box mx='8'>
          <Text fontWeight='semibold'>Mô tả chi tiết:</Text>
          <Text my='2' textAlign='justify'>
            {trip.data && (trip.data.data as ITripsResponseModel).description}
          </Text>
        </Box>
        <Divider my='4' w='full' orientation='horizontal' />
        <Flex maxW='full' overflowX='auto' fontSize='sm' direction='row' gap='28' py='4'>
          {trip.data &&
            (trip.data.data as ITripsResponseModel).tripDays.map((day, index) => (
              <DayListDetail index={index + 1} day={day} key={day.id} />
            ))}
        </Flex>
        <Flex
          mt='3'
          bg='#f0f2f5'
          position='sticky'
          top={16}
          left={0}
          maxW='full'
          py='4'
          px='28'
          justify='space-between'
          align='center'
          borderBottom='2px'
          borderTop='2px'
          borderBottomColor='gray.200'
          borderTopColor='gray.200'
          zIndex='5'
        >
          <Flex align='center' gap='10'>
            <Flex align='center' gap='4'>
              <Avatar
                name={
                  trip.data
                    ? `${(trip.data.data as ITripsResponseModel).ownerInfo.firstName} ${
                        (trip.data.data as ITripsResponseModel).ownerInfo.lastName
                      }`
                    : 'Không có thông tin'
                }
                src={trip.data ? `${(trip.data.data as ITripsResponseModel).ownerInfo.avatar}` : 'Không có thông tin'}
              />
              <Text>
                {trip.data &&
                  `${(trip.data.data as ITripsResponseModel).ownerInfo.firstName} ${
                    (trip.data.data as ITripsResponseModel).ownerInfo.lastName
                  }`}
              </Text>
            </Flex>
            <AvatarGroup size='md' spacing='-2'>
              {members.data?.pages[0].data.content.map(
                (item: IUserFirstLoginRequest, index: number) =>
                  auth &&
                  auth.id !== item.id && (
                    <Avatar
                      cursor='default'
                      title={`${item.firstName} ${item.lastName}`}
                      key={item.id}
                      name={`${item.firstName} ${item.lastName}`}
                      src={item.avatar}
                    />
                  )
              )}
              {totalMembers - totalMembersGet > 0 && (
                <Avatar bg='gray.200' fontWeight='bold' name={`${totalMembers - totalMembersGet} +`}></Avatar>
              )}
            </AvatarGroup>
          </Flex>
          {auth && (
            <Flex align='center' gap='3'>
              {trip.data &&
                (trip.data.data as ITripsResponseModel).type === 'Plan' &&
                (trip.data.data as ITripsResponseModel).maxMember > totalMembers &&
                statusUser !== 'MEMBER' && (
                  <Button
                    disabled={statusUser === 'MEMBER' || statusUser === 'REJECTED'}
                    isLoading={isLoadingRequestJoin}
                    w='fit-content'
                    rounded='sm'
                    onClick={sendRequestJoinTrip}
                  >
                    {renderContentButton()}
                  </Button>
                )}
              {trip.data && (trip.data.data as ITripsResponseModel).ownerId === auth.id && (
                <Button
                  w='fit-content'
                  rounded='sm'
                  onClick={() => {
                    router.push(`/itinerary/edit/${idTrip}`);
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Flex>
          )}
        </Flex>
        <MainContentDetail tripData={trip.data} />
        <Review auth={auth} tripData={trip.data} />
      </Box>
      <Box mb='10'>
        <Heading textAlign='center' mb='10'>
          Danh sách các địa điểm liên quan
        </Heading>
        {/* {!(
          !trips.data ||
          (trips.data && trips.data.pages.length === 0) ||
          (trips.data &&
            trips.data.pages.length === 1 &&
            trips.data.pages[0].data.content.length === 1 &&
            (trips.data.pages[0].data.content[0] as ITripsResponseModel).id.toString() !== idTrip)
        ) && (
          <Flex justify='center'>
            <Text>Không có dữ liệu về danh sách các địa điểm liên quan</Text>
          </Flex>
        )} */}
        <Container maxW='7xl'>
          <Grid gap='6' templateColumns='repeat(3, 1fr)' mb='6'>
            {trips.data
              ? trips.data.pages.map((page) =>
                  page.data.content.map(
                    (item: ITripsResponseModel, index: number) =>
                      item.id.toString() !== idTrip && <Card data={item} key={item.id} />
                  )
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
      </Box>
    </>
  );
};

export default ItineraryDetail;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
