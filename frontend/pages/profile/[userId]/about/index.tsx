import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';

//#region lazy loading components
const About = dynamic(() => import('../../../../components/views/Profile/About/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfileAboutsProps {}

const ProfileAbouts: NextPage = (props: IProfileAboutsProps) => {
  return (
    <>
      <About />
    </>
  );
};

export default ProfileAbouts;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
