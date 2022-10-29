import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';

//#region lazy loading components
const Friends = dynamic(() => import('../../../../components/views/Profile/Friends/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfileFriendsProps {}

const ProfileFriends: NextPage = (props: IProfileFriendsProps) => {
  return (
    <>
      <Friends />
    </>
  );
};

export default ProfileFriends;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
