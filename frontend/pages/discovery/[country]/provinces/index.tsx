import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Text,
  AspectRatio,
  Heading,
  Stack,
  Divider,
  Highlight,
  chakra,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

export interface ICountryProvincesProps {}

const CountryProvinces: NextPage = (props: ICountryProvincesProps) => {
  return (
    <Box w='full'>
      <Box mx='6'>
        <Box mb='4'>
          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href='/discovery'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Khám phá</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href='/discovery/viet-nam'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Việt Nam</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Link href='/discovery/viet-nam/provinces'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Tỉnh - Thành phố</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Heading mb='8' textTransform='uppercase' color='#D0637C'>
          Việt nam
        </Heading>
      </Box>
      <Flex justify='space-between' w='full' align='flex-start' gap={6}>
        <Box w='20%' bg='white' shadow='md' border='1px' borderColor='gray.300' p='6' h='fit-content' position='sticky' top='20'>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Thông tin chung</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4' color='#D0637C'>
            <Text>Tỉnh - Thành phố</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Kinh nghiệm</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Hình ảnh</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Hỏi đáp</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center'>
            <Text>Hành trình</Text>
            <ChevronRightIcon />
          </Flex>
        </Box>
        <Box w='80%' bg='white' p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          <SimpleGrid columns={[2, null, 3]}>
            <Flex direction='column' justifyContent='center' alignItems='center' w='3xs' mx='auto' my='4'>
              <Box
                bg='gray.300'
                h={40}
                w='full'
                rounded='lg'
                shadow='md'
                bgSize='cover'
                bgPos='center'
                style={{
                  backgroundImage:
                    'url(https://cdn3.ivivu.com/2022/07/h%E1%BB%93-g%C6%B0%C6%A1m-du-l%E1%BB%8Bch-H%C3%A0-N%E1%BB%99i-ivivu.jpg)',
                }}
              ></Box>

              <Box w='44' bg='white' mt={-10} shadow='lg' rounded='lg' overflow='hidden'>
                <chakra.h3
                  py={2}
                  textAlign='center'
                  fontWeight='bold'
                  textTransform='capitalize'
                  color='gray.800'
                  letterSpacing={1}
                >
                  Hà nội
                </chakra.h3>
                <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg='gray.200'>
                  <Text>Checkin now</Text>
                </Flex>
              </Box>
            </Flex>
            <Flex direction='column' justifyContent='center' alignItems='center' w='3xs' mx='auto' my='4'>
              <Box
                bg='gray.300'
                h={40}
                w='full'
                rounded='lg'
                shadow='md'
                bgSize='cover'
                bgPos='center'
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)',
                }}
              ></Box>

              <Box w='44' bg='white' mt={-10} shadow='lg' rounded='lg' overflow='hidden'>
                <chakra.h3
                  py={2}
                  textAlign='center'
                  fontWeight='bold'
                  textTransform='capitalize'
                  color='gray.800'
                  letterSpacing={1}
                >
                  Hà nội
                </chakra.h3>
                <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg='gray.200'>
                  <Text>Checkin now</Text>
                </Flex>
              </Box>
            </Flex>
            <Flex direction='column' justifyContent='center' alignItems='center' w='3xs' mx='auto' my='4'>
              <Box
                bg='gray.300'
                h={40}
                w='full'
                rounded='lg'
                shadow='md'
                bgSize='cover'
                bgPos='center'
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)',
                }}
              ></Box>

              <Box w='44' bg='white' mt={-10} shadow='lg' rounded='lg' overflow='hidden'>
                <chakra.h3
                  py={2}
                  textAlign='center'
                  fontWeight='bold'
                  textTransform='capitalize'
                  color='gray.800'
                  letterSpacing={1}
                >
                  Hà nội
                </chakra.h3>
                <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg='gray.200'>
                  <Text>Checkin now</Text>
                </Flex>
              </Box>
            </Flex>
            <Flex direction='column' justifyContent='center' alignItems='center' w='3xs' mx='auto' my='4'>
              <Box
                bg='gray.300'
                h={40}
                w='full'
                rounded='lg'
                shadow='md'
                bgSize='cover'
                bgPos='center'
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80)',
                }}
              ></Box>

              <Box w='44' bg='white' mt={-10} shadow='lg' rounded='lg' overflow='hidden'>
                <chakra.h3
                  py={2}
                  textAlign='center'
                  fontWeight='bold'
                  textTransform='capitalize'
                  color='gray.800'
                  letterSpacing={1}
                >
                  Hà nội
                </chakra.h3>
                <Flex fontSize='sm' alignItems='center' justifyContent='center' py={2} px={3} bg='gray.200'>
                  <Text>Checkin now</Text>
                </Flex>
              </Box>
            </Flex>
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryProvinces;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
