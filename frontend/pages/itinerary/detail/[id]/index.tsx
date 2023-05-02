import { Box, Text, Heading, Center, Container, Divider } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IItineraryDetailProps {}

const ItineraryDetail: NextPage = (props: IItineraryDetailProps) => {
  return (
    <>
      <Box mb='10' w='full'>
        <Heading as='h4' size='md' mb='2'>
          Lịch trình nổi bật
        </Heading>
        <Text>Mô tả chi tiết</Text>
      </Box>
      <Divider w='full' px='-20' orientation='horizontal' />
    </>
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
