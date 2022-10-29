import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';

//#region lazy loading components
const Photos = dynamic(() => import('../../../../components/views/Profile/Photos/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfilePhotosProps {}

const ProfilePhotos: NextPage = (props: IProfilePhotosProps) => {
  return (
    <>
      <Photos />
    </>
  );
};

export default ProfilePhotos;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
