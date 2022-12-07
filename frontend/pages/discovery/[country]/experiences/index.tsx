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
  Image,
  Icon,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MdHeadset, MdLocationOn, MdEmail } from 'react-icons/md';
import { BsFillBriefcaseFill } from 'react-icons/bs';

export interface ICountryExperiencesProps {}

const CountryExperiences: NextPage = (props: ICountryExperiencesProps) => {
  return (
    <Box w='full'>
      <Box mx='6'>
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
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Tỉnh - Thành phố</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4' color='#D0637C'>
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
            <Box w='2xs' mx='auto' my='4' bg='white' shadow='lg' rounded='lg' overflow='hidden'>
              <Image
                w='full'
                h='44'
                fit='cover'
                objectPosition='center'
                src='https://img.freepik.com/premium-vector/around-the-world-tour-by-different-vehicle-travel-concept-vector-illustration-with-logo_95169-2212.jpg?w=2000'
                alt='avatar'
              />
              <Flex alignItems='center' px={6} py={3} bg='gray.900'>
                <chakra.h1 mx={3} color='white' fontWeight='bold' fontSize='lg'>
                  Thắng&apos;s experience
                </chakra.h1>
              </Flex>
              <Flex py={4} px={6} alignItems='center' justify='space-around' color='gray.700'>
                <Flex alignItems='center'>
                  <Icon as={MdLocationOn} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    30
                  </chakra.h1>
                </Flex>

                <Flex alignItems='center'>
                  <Icon as={MdEmail} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    20
                  </chakra.h1>
                </Flex>
              </Flex>
            </Box>

            <Box w='2xs' mx='auto' my='4' bg='white' shadow='lg' rounded='lg' overflow='hidden'>
              <Image
                w='full'
                h='44'
                fit='cover'
                objectPosition='center'
                src='https://img.freepik.com/premium-vector/around-the-world-tour-by-different-vehicle-travel-concept-vector-illustration-with-logo_95169-2212.jpg?w=2000'
                alt='avatar'
              />
              <Flex alignItems='center' px={6} py={3} bg='gray.900'>
                <chakra.h1 mx={3} color='white' fontWeight='bold' fontSize='lg'>
                  Thắng&apos;s experience
                </chakra.h1>
              </Flex>
              <Flex py={4} px={6} alignItems='center' justify='space-around' color='gray.700'>
                <Flex alignItems='center'>
                  <Icon as={MdLocationOn} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    30
                  </chakra.h1>
                </Flex>

                <Flex alignItems='center'>
                  <Icon as={MdEmail} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    20
                  </chakra.h1>
                </Flex>
              </Flex>
            </Box>

            <Box w='2xs' mx='auto' my='4' bg='white' shadow='lg' rounded='lg' overflow='hidden'>
              <Image
                w='full'
                h='44'
                fit='cover'
                objectPosition='center'
                src='https://img.freepik.com/premium-vector/around-the-world-tour-by-different-vehicle-travel-concept-vector-illustration-with-logo_95169-2212.jpg?w=2000'
                alt='avatar'
              />
              <Flex alignItems='center' px={6} py={3} bg='gray.900'>
                <chakra.h1 mx={3} color='white' fontWeight='bold' fontSize='lg'>
                  Thắng&apos;s experience
                </chakra.h1>
              </Flex>
              <Flex py={4} px={6} alignItems='center' justify='space-around' color='gray.700'>
                <Flex alignItems='center'>
                  <Icon as={MdLocationOn} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    30
                  </chakra.h1>
                </Flex>

                <Flex alignItems='center'>
                  <Icon as={MdEmail} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    20
                  </chakra.h1>
                </Flex>
              </Flex>
            </Box>

            <Box w='2xs' mx='auto' my='4' bg='white' shadow='lg' rounded='lg' overflow='hidden'>
              <Image
                w='full'
                h='44'
                fit='cover'
                objectPosition='center'
                src='https://img.freepik.com/premium-vector/around-the-world-tour-by-different-vehicle-travel-concept-vector-illustration-with-logo_95169-2212.jpg?w=2000'
                alt='avatar'
              />
              <Flex alignItems='center' px={6} py={3} bg='gray.900'>
                <chakra.h1 mx={3} color='white' fontWeight='bold' fontSize='lg'>
                  Thắng&apos;s experience
                </chakra.h1>
              </Flex>
              <Flex py={4} px={6} alignItems='center' justify='space-around' color='gray.700'>
                <Flex alignItems='center'>
                  <Icon as={MdLocationOn} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    30
                  </chakra.h1>
                </Flex>

                <Flex alignItems='center'>
                  <Icon as={MdEmail} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    20
                  </chakra.h1>
                </Flex>
              </Flex>
            </Box>

            <Box w='2xs' mx='auto' my='4' bg='white' shadow='lg' rounded='lg' overflow='hidden'>
              <Image
                w='full'
                h='44'
                fit='cover'
                objectPosition='center'
                src='https://img.freepik.com/premium-vector/around-the-world-tour-by-different-vehicle-travel-concept-vector-illustration-with-logo_95169-2212.jpg?w=2000'
                alt='avatar'
              />
              <Flex alignItems='center' px={6} py={3} bg='gray.900'>
                <chakra.h1 mx={3} color='white' fontWeight='bold' fontSize='lg'>
                  Thắng&apos;s experience
                </chakra.h1>
              </Flex>
              <Flex py={4} px={6} alignItems='center' justify='space-around' color='gray.700'>
                <Flex alignItems='center'>
                  <Icon as={MdLocationOn} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    30
                  </chakra.h1>
                </Flex>

                <Flex alignItems='center'>
                  <Icon as={MdEmail} h={6} w={6} />
                  <chakra.h1 px={2} fontSize='sm'>
                    20
                  </chakra.h1>
                </Flex>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryExperiences;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
