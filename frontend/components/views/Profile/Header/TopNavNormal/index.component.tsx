import { Flex } from '@chakra-ui/react';
import TopNav from '../TopNav/index.component';

export interface ITopNavNormalProps {
  userId: string;
  mainCurrentRoute: string;
  pushRoute: (link: string) => void;
}

export default function TopNavNormal(props: ITopNavNormalProps) {
  const { userId, mainCurrentRoute, pushRoute } = props;

  return (
    <Flex h={'50px'} mt={3} alignItems='center'>
      <TopNav userId={userId} mainCurrentRoute={mainCurrentRoute} pushRoute={pushRoute} />
    </Flex>
  );
}
