import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { getCurrentYear } from '../../../../utils';
import { ChakraNextImage } from '../../Image/index.component';

export interface IImageAuthProps {}

export default function ImageAuth(props: IImageAuthProps) {
  return (
    <VStack
      display={{ base: 'none', '2xl': 'block' }}
      color='textColor.primary_darkMode'
      position='relative'
      w='100%'
      maxH='100vh'
      borderRadius='10px'
      alignItems='flex-start'
      bg='gray.50'
      top={-2}
    >
      <Flex p='20' minH='100%' direction='column' justify='space-between' zIndex='10' position='absolute'>
        <Link href='/experiences' prefetch={false}>
          <Text fontSize='2xl' fontFamily={'extraBold'} cursor='pointer'>
            LUMIÈRE
          </Text>
        </Link>
        <Box>
          <Text fontSize='xl' pb='2.5'>
            You&apos;ll never travel without our trip planner again.
          </Text>
          <Text mb='20'>Build, organize, and map your itineraries in a free travel app designed for vacations & road trips</Text>
          <Text>Lumière {getCurrentYear}. All rights reserved.</Text>
        </Box>
      </Flex>
      <ChakraNextImage position='relative' minH='100vh' w='100%' src='/images/auth_image.jpg' alt='Login image' />
    </VStack>
  );
}
