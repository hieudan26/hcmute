import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { ChakraNextImageGlobal } from '../../../ChakraNextImageGlobal/index.component';
import TopNav from '../TopNav/index.component';

export interface ITopNavSpecialProps {
  userId: string;
  mainCurrentRoute: string;
  pushRoute: (link: string) => void;
  user: IUserFirstLoginRequest | null;
  avatar: string;
  auth: IUserFirstLoginRequest | null;
}

export default function TopNavSpecial(props: ITopNavSpecialProps) {
  const { userId, mainCurrentRoute, pushRoute, user, avatar, auth } = props;
  const bg = useColorModeValue('white', 'black');

  return (
    <Flex
      px='60'
      bg={bg}
      w={'full'}
      position='fixed'
      mt='70px'
      alignItems='center'
      justify='space-between'
      boxShadow='rgb(44 101 144 / 10%) 0px 0px 8px 0px'
      zIndex='5'
    >
      <Flex alignItems='center' gap='2' bg={bg} display={{ base: 'none', md: 'flex' }}>
        <ChakraNextImageGlobal
          width='30px'
          height='30px'
          w='30px'
          h='30px'
          rounded='full'
          overflow='hidden'
          alt={user?.fullName}
          src={avatar}
        />
        <Text>{user ? user.fullName : 'Default Fullname'}</Text>
      </Flex>
      <Box zIndex='5' bg={bg}>
        <TopNav auth={auth} userId={userId} mainCurrentRoute={mainCurrentRoute} pushRoute={pushRoute} />
      </Box>
    </Flex>
  );
}
