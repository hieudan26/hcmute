import { Avatar, AvatarGroup, Button, ButtonGroup, Flex, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { setValueItineraryMap } from '../../../../app/slices/itineraryMapSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import Logo from '../../Navbar/Logo/index.component';
import NavBarContainer from '../../Navbar/NavbarContainer/index.component';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTripMembers } from '../../../../hooks/queries/trip';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';

export interface INavbarProps {}

export default function Navbar(props: INavbarProps) {
  const bg = useColorModeValue('white', 'black');
  const router = useRouter();
  const isItineraryMap = useAppSelector((state) => state.itineraryMap.value);
  const auth = useAppSelector((state) => state.auth.value);
  const dispatch = useAppDispatch();
  const statusTrip = useAppSelector((state) => state.statusItinarary.value);
  const [idTrip, setIdTrip] = useState<number>(0);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalMembersGet, setTotalMembersGet] = useState<number>(0);
  const members = useTripMembers(
    {
      params: {
        pageNumber: 0,
        pageSize: 4,
      },
      tripId: idTrip,
      key: undefined,
    },
    idTrip !== 0
  );

  useEffect(() => {
    if (members.data) {
      setTotalMembersGet(members.data.pages[0].data.content.length);
      setTotalMembers(members.data.pages[0].data.pageable.totalItems);
    }
  }, [members]);

  useEffect(() => {
    const { id } = router.query;
    id && setIdTrip(Number(id as string));
  }, [router.query]);

  const paddingLayout = useBreakpointValue(
    {
      base: '60px',
      md: '150px',
    },
    {
      fallback: 'base',
    }
  );

  return (
    <NavBarContainer
      w='100%'
      paddingX={paddingLayout}
      paddingY='12px'
      bg={bg}
      boxShadow='rgb(44 101 144 / 10%) 0px 0px 8px 0px'
      minH='55px'
      borderBottom='1px'
      borderBottomColor='gray.200'
    >
      <Logo w='128px' />
      <ButtonGroup spacing='2'>
        <Button
          onClick={() => {
            dispatch(setValueItineraryMap(false));
          }}
          variant={!isItineraryMap ? undefined : 'outline'}
        >
          Địa điểm
        </Button>
        <Button
          onClick={() => {
            dispatch(setValueItineraryMap(true));
          }}
          variant={isItineraryMap ? undefined : 'outline'}
        >
          Bản đồ
        </Button>
      </ButtonGroup>
      <Flex align='center' gap='2'>
        <Avatar size='sm' name='Dan Abrahmov' src={auth?.avatar} />
        <Text fontSize='sm'>Thangg Duongg /</Text>
        <AvatarGroup size='sm' spacing='-2'>
          {members.data?.pages[0].data.content.map((item: IUserFirstLoginRequest, index: number) => (
            <Avatar
              border='1px'
              title={`${item.firstName} ${item.lastName}`}
              key={item.id}
              name={item.firstName}
              src={item.avatar}
            />
          ))}
          {totalMembers - totalMembersGet > 0 && (
            <Avatar border='1px' bg='gray.200' fontWeight='bold' name={`${totalMembers - totalMembersGet} +`}></Avatar>
          )}
        </AvatarGroup>
      </Flex>
      <Flex align='center' gap='2' fontSize='sm'>
        <Text>
          Trạng thái:{' '}
          <span className='px-1 py-1 bg-pink-200 rounded-md'>
            {statusTrip === 'Public' ? 'Công khai' : 'Chưa đủ điều kiện công khai'}
          </span>
        </Text>
      </Flex>
    </NavBarContainer>
  );
}
