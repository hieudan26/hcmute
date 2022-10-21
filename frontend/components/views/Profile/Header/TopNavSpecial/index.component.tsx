import { Avatar, Box, Container, Flex, SkeletonCircle, Text, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import TopNav from '../TopNav/index.component';

export interface ITopNavSpecialProps {
  userId: string;
  mainCurrentRoute: string;
  pushRoute: (link: string) => void;
  user: IUserFirstLoginRequest | null;
  avatar: string;
}

export default function TopNavSpecial(props: ITopNavSpecialProps) {
  const { userId, mainCurrentRoute, pushRoute, user, avatar } = props;
  const bg = useColorModeValue('white', 'header.primary_darkMode');

  return (
    <Flex px='72' bg={bg} w={'full'} position='fixed' mt='70px' alignItems='center' justify='space-between'>
      <Flex alignItems='center' gap='2'>
        <Wrap>
          <WrapItem>
            <Avatar size='sm' showBorder name={user?.fullName} src={avatar} />
          </WrapItem>
        </Wrap>
        <Text>{user ? user.fullName : 'Default Fullname'}</Text>
      </Flex>
      <Box>
        <TopNav userId={userId} mainCurrentRoute={mainCurrentRoute} pushRoute={pushRoute} />
      </Box>
    </Flex>
  );
}
