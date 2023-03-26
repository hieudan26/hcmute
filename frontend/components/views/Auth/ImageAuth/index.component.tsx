import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { getCurrentYear } from '../../../../utils';
import { ChakraNextImage } from '../../Image/index.component';

export interface IImageAuthProps {}

export default function ImageAuth(props: IImageAuthProps) {
  return (
    <VStack
      display={{ base: 'none', xl: 'block' }}
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
          <Text fontSize='xl' pb='2.5' fontWeight='semibold'>
            {/* You&apos;ll never travel without our trip planner again. */}
            Bạn sẽ không bao giờ đi du lịch mà không có kế hoạch cho chuyến đi nữa.
          </Text>
          <Text mb='20' fontSize='xs'>
            Xây dựng, sắp xếp và lập bản đồ hành trình của bạn trong một ứng dụng du lịch miễn phí được thiết kế cho các kỳ nghỉ
            và chuyến đi
          </Text>
          <Text fontSize='xs' fontWeight='semibold'>
            Lumière {getCurrentYear}. Đã đăng ký bản quyền.
          </Text>
        </Box>
      </Flex>
      <ChakraNextImage position='relative' minH='100vh' w='100%' src='/images/auth_image.jpg' alt='Login image' />
    </VStack>
  );
}
