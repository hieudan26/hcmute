import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { toggleLoading } from '../../../../components/views/Loading/index.component';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';

//#region lazy loading component
const Posts = dynamic(() => import('../../../../components/views/Profile/Posts/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfilePostsProps {}

const ProfilePosts: NextPage = (props: IProfilePostsProps) => {
  return (
    <>
      <Posts />
    </>
  );
};

export default ProfilePosts;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
