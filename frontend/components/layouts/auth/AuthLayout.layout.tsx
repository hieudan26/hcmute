import { Flex, useColorModeValue, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import ImageAuth from '../../views/Auth/ImageAuth/index.component';
import ScrollToTop from '../../views/ScrollToTop/index.component';

export default function AuthLayout({ children }: any) {
  const bg = useColorModeValue('white', 'backgroundPage.primary_darkMode');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <Flex minH='100vh' overflowY='hidden'>
      <ImageAuth />
      <VStack
        justify='center'
        w='100%'
        minH='100vh'
        px={['15', '20', '20', '64']}
        py='10'
        bg={bg}
        spacing='10'
        alignItems='flex-start'
      >
        {children}
      </VStack>
      <ScrollToTop />
    </Flex>
  );
}
