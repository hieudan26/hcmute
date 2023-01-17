import { Box, Flex } from '@chakra-ui/react';
import Weather from '../../views/Profile/Posts/Weather/index.component';

export interface IPostsLayoutProps {
  children: React.ReactNode;
}

export default function PostsLayout(props: IPostsLayoutProps) {
  const { children } = props;

  return (
    <Flex gap={{ base: '0', md: '0', lg: '0', xl: '0', '2xl': '6' }} w='100%' position='relative'>
      <Box
        display={{ base: 'none', lg: 'block' }}
        mr={{ base: '0', md: '0', lg: '65px', xl: '0', '2xl': '6' }}
        width={{ md: '0%', lg: '30%', xl: '40%', '2xl': '40%' }}
      >
        <Weather />
      </Box>
      {children}
    </Flex>
  );
}
