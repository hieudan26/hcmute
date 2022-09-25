import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IRegisterProps {}

const Register: NextPage = (props: IRegisterProps) => {
  return <>Register</>;
};

export default Register;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer'])),
      // Will be passed to the page component as props
    },
  };
}
