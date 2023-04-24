import { Box, Button, Flex, Heading, Stack, chakra, Text, Icon } from '@chakra-ui/react';
import { useRef } from 'react';
import { AiOutlineEye, AiTwotoneEye } from 'react-icons/ai';
import { BsCheckLg, BsSunFill } from 'react-icons/bs';
import { IoMap } from 'react-icons/io5';
import { RiBellFill } from 'react-icons/ri';
import Feature from '../Feature/index.component';
import { useRouter } from 'next/router';
import cookie from 'react-cookies';
import { CookieConstants } from '../../../../constants/store.constant';

export interface IHeroProps {}

export default function Hero(props: IHeroProps) {
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const refSection = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const scorllToBottom = () => {
    window.scrollTo({
      top: refSection.current?.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <>
      <chakra.header pt='72px' ref={refSection}>
        <Box
          w='full'
          h='md'
          backgroundImage='url(https://media.zim.vn/6274ce1e72b7e1001eee2ac9/tu-vung-chu-de-travel-va-cach-su-dung-hieu-qua-vao-bai-ielts-speaking-part-1.webp)'
          bgPos='center'
          bgSize='cover'
        >
          <Flex align='center' pos='relative' justify='flex-start' boxSize='full' bg='blackAlpha.600'>
            <Stack color='white' ml='44' textAlign='center' alignItems='flex-start' spacing={6}>
              <Heading maxW='xl' fontSize='4xl' fontWeight='bold' lineHeight='normal'>
                Tạo lịch trình du lịch dễ dàng cho chuyến đi của bạn cùng{' '}
                <chakra.span color='#D0637C' textDecor='underline'>
                  LUMIÈRE
                </chakra.span>
              </Heading>
              <Text pl='2' fontSize='xl'>
                Chỉ mất 3-5 phút, bạn có thể tạo ngay cho mình lịch trình du lịch
              </Text>
              <Flex pl='2' gap='10'>
                <Flex align='center' gap='3'>
                  <Icon as={BsCheckLg} />
                  <Text>Đơn giản</Text>
                </Flex>
                <Flex align='center' gap='3'>
                  <Icon as={BsSunFill} />
                  <Text>Khoa học</Text>
                </Flex>
                <Flex align='center' gap='3'>
                  <Icon as={AiOutlineEye} />
                  <Text>Thẩm mỹ</Text>
                </Flex>
                <Flex align='center' gap='3'>
                  <Icon as={RiBellFill} />
                  <Text>Nhắc nhở thông báo</Text>
                </Flex>
              </Flex>
              <Flex gap='8'>
                {isLoggedIn && (
                  <Button
                    leftIcon={<Icon as={IoMap} fontSize='lg' />}
                    py='6'
                    textTransform='uppercase'
                    w='fit-content'
                    onClick={() => {
                      router.push('/itinerary/create');
                    }}
                  >
                    Tạo lịch trình
                  </Button>
                )}

                <Button
                  leftIcon={<Icon as={AiTwotoneEye} fontSize='lg' />}
                  py='6'
                  bg='white'
                  color='black'
                  textTransform='uppercase'
                  w='fit-content'
                  onClick={scorllToBottom}
                >
                  Cần tìm ý tưởng
                </Button>
              </Flex>
            </Stack>
          </Flex>
        </Box>
        <Feature />
      </chakra.header>
    </>
  );
}
