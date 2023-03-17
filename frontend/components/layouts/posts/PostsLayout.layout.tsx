import { Box, Flex } from '@chakra-ui/react';
import Weather from '../../views/Profile/Posts/Weather/index.component';

export interface IPostsLayoutProps {
  children: React.ReactNode;
}

export default function PostsLayout(props: IPostsLayoutProps) {
  const { children } = props;

  return (
    <Flex justify='space-between' align='flex-start' gap={6} w='full'>
      <Box position='sticky' top='20' display={{ base: 'none', lg: 'block' }} width={{ md: '0%', lg: '40%' }}>
        <Weather />
      </Box>
      {children}
    </Flex>
  );
}
