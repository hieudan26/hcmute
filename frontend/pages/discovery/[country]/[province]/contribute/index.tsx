import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface ICountryProvinceContributeProps {}

const CountryProvinceContribute: NextPage = (props: ICountryProvinceContributeProps) => {
  return <>Hello world</>;
};

export default CountryProvinceContribute;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'header',
        'footer',
        'modal_is_first_login',
        'modal_create_post',
        'discovery_detail',
      ])),
      // Will be passed to the page component as props
    },
  };
};
