import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IExperiencesProps {}

const Experiences: NextPage = (props: IExperiencesProps) => {
  return <Box>Experiences</Box>;
};

export default Experiences;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer'])),
      // Will be passed to the page component as props
    },
  };
}
