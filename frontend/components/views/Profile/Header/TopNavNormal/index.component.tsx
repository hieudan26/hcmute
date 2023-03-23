import { Flex } from '@chakra-ui/react';
import TopNav from '../TopNav/index.component';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';

export interface ITopNavNormalProps {
  userId: string;
  mainCurrentRoute: string;
  pushRoute: (link: string) => void;
  auth: IUserFirstLoginRequest | null;
}

export default function TopNavNormal(props: ITopNavNormalProps) {
  const { userId, mainCurrentRoute, pushRoute, auth } = props;

  return (
    <Flex h={'50px'} mt={3} alignItems='center'>
      <TopNav auth={auth} userId={userId} mainCurrentRoute={mainCurrentRoute} pushRoute={pushRoute} />
    </Flex>
  );
}
