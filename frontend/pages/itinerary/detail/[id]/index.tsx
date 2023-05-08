import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Box,
  Text,
  Heading,
  Center,
  Container,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MdCheckCircle } from 'react-icons/md';

export interface IItineraryDetailProps {}

const ItineraryDetail: NextPage = (props: IItineraryDetailProps) => {
  return (
    <Box mb='10' w='full'>
      <Heading as='h4' size='md' mb='2'>
        Hà Giang kí sự
      </Heading>
      <Text>Mô tả chi tiết</Text>
      <Divider my='4' w='full' orientation='horizontal' />
      <Flex maxW='full' overflowX='auto' fontSize='sm' direction='row' gap='10' py='4'>
        <List spacing={3} minW='fit-content'>
          <Text px='2'>Ngày 01</Text>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            Núi Sam - Miếu bà Chúa Xứ
          </ListItem>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            Chợ Châu Đốc
          </ListItem>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            LĂNG THOẠI NGỌC HẬU
          </ListItem>
        </List>
        <List spacing={3} minW='fit-content'>
          <Text px='2'>Ngày 01</Text>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            Núi Sam - Miếu bà Chúa Xứ
          </ListItem>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            Chợ Châu Đốc
          </ListItem>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            LĂNG THOẠI NGỌC HẬU
          </ListItem>
        </List>
        <List spacing={3} minW='fit-content'>
          <Text px='2'>Ngày 01</Text>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            Núi Sam - Miếu bà Chúa Xứ
          </ListItem>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            Chợ Châu Đốc
          </ListItem>
          <ListItem as={Flex} flexDirection='row' alignItems='center'>
            <Text mx='2'>00:10</Text>
            <ListIcon as={MdCheckCircle} color='green.500' />
            LĂNG THOẠI NGỌC HẬU
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
};

export default ItineraryDetail;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
