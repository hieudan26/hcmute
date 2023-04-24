import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Flex,
  Highlight,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { setValueItineraryMap } from '../../../../app/slices/itineraryMapSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import Logo from '../../Navbar/Logo/index.component';
import NavBarContainer from '../../Navbar/NavbarContainer/index.component';

export interface INavbarProps {}

export default function Navbar(props: INavbarProps) {
  const bg = useColorModeValue('white', 'black');
  const isItineraryMap = useAppSelector((state) => state.itineraryMap.value);
  const auth = useAppSelector((state) => state.auth.value);
  const dispatch = useAppDispatch();

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
        <Text fontSize='sm'>Thangg Duongg</Text>
        <AvatarGroup size='sm' max={3}>
          <Avatar name='Ryan Florence' src={auth?.avatar} />
          <Avatar name='Segun Adebayo' src={auth?.avatar} />
          <Avatar name='Kent Dodds' src={auth?.avatar} />
          <Avatar name='Prosper Otemuyiwa' src={auth?.avatar} />
          <Avatar name='Christian Nwamba' src={auth?.avatar} />
        </AvatarGroup>
      </Flex>
      <Flex align='center' gap='2' fontSize='sm'>
        <Highlight query='Đã duyệt' styles={{ px: '1', py: '1', bg: 'orange.100' }}>
          Trạng thái: Đã duyệt
        </Highlight>
      </Flex>
    </NavBarContainer>
  );
}
