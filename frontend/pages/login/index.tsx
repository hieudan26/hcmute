import { Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface ILoginProps {}

const Login: NextPage = (props: ILoginProps) => {
  return <>Login</>;
};

export default Login;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer'])),
      // Will be passed to the page component as props
    },
  };
}
