import { Box, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Create from '../../components/views/Contribute/Create/index.component';

export interface ContributeProps {}

const Contribute: NextPage = (props: ContributeProps) => {
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');

  return (
    <Box mb='10' w='120%' bg={boxBg} shadow='md' rounded='md' p='8'>
      <Create />
    </Box>
  );
};

export default Contribute;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'soon'])),
      // Will be passed to the page component as props
    },
  };
};
