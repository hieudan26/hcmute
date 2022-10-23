import { Box } from '@chakra-ui/react';
import { Auth } from 'aws-amplify';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export interface IExperiencesProps {}

const Experiences: NextPage = (props: IExperiencesProps) => {
  const router = useRouter();
  const { code, state } = router.query;

  useEffect(() => {
    if (code && state) {
      router.push('/experience');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state]);

  return <Box>Experiences</Box>;
};

export default Experiences;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
