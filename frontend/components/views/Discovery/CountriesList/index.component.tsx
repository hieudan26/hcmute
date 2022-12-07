import { Box, Button, Center, Divider, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export interface ICountriesListProps {}

export default function CountriesList(props: ICountriesListProps) {
  const router = useRouter();

  const redirectToCountry = () => {
    router.push('/discovery/viet-nam');
  };

  return (
    <Box>
      <Flex direction='column' justify='center' align='center' textAlign='center'>
        <Heading as='h3' size='lg' fontWeight='semibold' mb='5'>
          {/* List of countries in the world */}
          Danh sách các quốc gia trên thế giới
        </Heading>
        <Text>
          {/* Discover the next destination for your amazing journey */}
          Khám phá điểm đến tiếp theo cho hành trình tuyệt vời của bạn
        </Text>
        <Divider color='#D0637C' w='10%' my='10' borderY='2px' />
      </Flex>
      <Grid templateColumns='repeat(5, 1fr)' gap={6} mb='5'>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Nha Trang - Khánh Hòa
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
        <Button textTransform='uppercase' variant='outline' color='gray.500' onClick={redirectToCountry}>
          Hồ chí minh
        </Button>
      </Grid>
      <Center>
        <Button fontStyle='italic' variant='ghost' fontWeight='medium'>
          Xem thêm
        </Button>
      </Center>
    </Box>
  );
}
