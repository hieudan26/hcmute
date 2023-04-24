import { Box, Flex, Heading, Center, Container } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '../../components/views/Itinerary/Card/index.component';
import MoreInformation from '../../components/views/Itinerary/MoreInformation/index.component';

export interface IItineraryProps {}

const Itinerary: NextPage = (props: IItineraryProps) => {
  const array = [1, 2, 3, 4, 5];

  return (
    <Box mb='10'>
      <Heading textAlign='center' mb='10'>
        Lịch trình nổi bật
      </Heading>
      <Container maxW='8xl'>
        {array.map((item, index) => (
          <Flex key={item} gap='6' justifyContent='space-between' mb='6'>
            <Card />
            <Card />
            <Card />
          </Flex>
        ))}
      </Container>
      <MoreInformation />
    </Box>
  );
};

export default Itinerary;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
