import { Box } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProvinceFaqsProps {}

const ProvinceFaqs: NextPage = (props: IProvinceFaqsProps) => {
  return <Box mb='10'>Discovery - country - province - faqs</Box>;
};

export default ProvinceFaqs;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
