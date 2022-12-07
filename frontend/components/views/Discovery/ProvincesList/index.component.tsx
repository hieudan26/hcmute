import { Box, Button, Center, Divider, Flex, Grid, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Link from 'next/link';

export interface IProvincesListProps {}

export default function ProvincesList(props: IProvincesListProps) {
  const data = [
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Việt nam',
    'Úc',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
    'Áo',
  ];

  return (
    <Box>
      <Flex direction='column' justify='center' align='center' textAlign='center'>
        <Heading as='h3' size='lg' fontWeight='semibold'>
          {/* List of countries in the world */}
          Danh sách điểm đến tại Việt Nam
        </Heading>
        <Divider color='#D0637C' w='10%' my='10' borderY='2px' />
      </Flex>
      <Center justifyContent='center' alignItems='center' alignContent='center'>
        <SimpleGrid columns={[2, 3, 4]} w='full' textAlign='center' gap='8'>
          <Link href='/discovery/viet-nam/ho-chi-minh' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
          <Link href='/' passHref>
            <Text cursor='pointer' textTransform='capitalize'>
              an giang
            </Text>
          </Link>
        </SimpleGrid>
      </Center>
      <Center mt='5'>
        <Button fontStyle='italic' variant='ghost' fontWeight='medium'>
          Xem thêm
        </Button>
      </Center>
    </Box>
  );
}
