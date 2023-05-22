import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Box,
  Text,
  Heading,
  Center,
  Container,
  Divider,
  Flex,
  Avatar,
  Button,
  AvatarGroup,
  VStack,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useRef, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { useTripById, useTripMembers } from '../../../../hooks/queries/trip';
import { useRouter } from 'next/router';
import { ITripMemberResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import { useQueryClient } from '@tanstack/react-query';
import DayListDetail from '../../../../components/views/Itinerary/DayListDetail/index.component';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import MainContentDetail from '../../../../components/views/Itinerary/MainContentDetail/index.component';
import { useAppSelector } from '../../../../hooks/redux';

export interface IItineraryDetailProps {}

const ItineraryDetail: NextPage = (props: IItineraryDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [idTrip, setIdTrip] = useState<string>('');
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalMembersGet, setTotalMembersGet] = useState<number>(0);
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

  useEffect(() => {
    if (members.data) {
      setTotalMembersGet(members.data.pages[0].data.content.length);
      setTotalMembers(members.data.pages[0].data.pageable.totalItems);
    }
  }, [members]);

  useEffect(() => {
    queryClient.invalidateQueries(['trip_by_id']);
    queryClient.invalidateQueries(['trip_members']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { id } = router.query;
    setIdTrip(id as string);
  }, [router.query]);

  return (
    <Box mb='10' w='full'>
      <Heading as='h4' size='md' mb='2'>
        {trip.data ? (trip.data.data as ITripsResponseModel).title : 'Hà Giang kí sự'}
      </Heading>
      <Text>Mô tả chi tiết</Text>
      <Divider my='4' w='full' orientation='horizontal' />
      <Flex maxW='full' overflowX='auto' fontSize='sm' direction='row' gap='28' py='4'>
        {trip.data &&
          (trip.data.data as ITripsResponseModel).tripDays.map((day, index) => (
            <DayListDetail index={index + 1} day={day} key={day.id} />
          ))}
      </Flex>
      <Flex
        bg='#f0f2f5'
        position='sticky'
        top={16}
        left={0}
        zIndex={10}
        maxW='full'
        py='4'
        px='28'
        justify='space-between'
        align='center'
        borderBottom='2px'
        borderBottomColor='gray.200'
      >
        <Flex align='center' gap='10'>
          <Flex align='center' gap='4'>
            <Avatar
              name={
                trip.data
                  ? `${(trip.data.data as ITripsResponseModel).ownerInfo.firstName} ${
                      (trip.data.data as ITripsResponseModel).ownerInfo.lastName
                    }`
                  : 'No information'
              }
              src={trip.data ? `${(trip.data.data as ITripsResponseModel).ownerInfo.avatar}` : 'No information'}
            />
            <Text>
              {trip.data &&
                `${(trip.data.data as ITripsResponseModel).ownerInfo.firstName} ${
                  (trip.data.data as ITripsResponseModel).ownerInfo.lastName
                }`}
            </Text>
          </Flex>
          <AvatarGroup size='md' spacing='-2'>
            {members.data?.pages[0].data.content.map((item: IUserFirstLoginRequest, index: number) => (
              <Avatar
                cursor='default'
                title={`${item.firstName} ${item.lastName}`}
                key={item.id}
                name={`${item.firstName} ${item.lastName}`}
                src={item.avatar}
              />
            ))}
            {totalMembers - totalMembersGet > 0 && (
              <Avatar bg='gray.200' fontWeight='bold' name={`${totalMembers - totalMembersGet} +`}></Avatar>
            )}
          </AvatarGroup>
        </Flex>
        {auth && trip.data && (trip.data.data as ITripsResponseModel).ownerId === auth.id && (
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
      <MainContentDetail tripData={trip.data} />
    </Box>
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
