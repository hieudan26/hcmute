import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';
import cookie from 'react-cookies';
import { CookieConstants } from '../../../../constants/store.constant';
import { useAppSelector } from '../../../../hooks/redux';
import { useRouter } from 'next/router';

//#region lazy loading components
const Friends = dynamic(() => import('../../../../components/views/Profile/Friends/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfileFriendsProps {}

const ProfileFriends: NextPage = (props: IProfileFriendsProps) => {
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const isLoggedIn = cookie.load(CookieConstants.IS_LOGGED_IN) ? true : false;
  const userNotAuth = useAppSelector((state) => state.userNotAuthReducer.value);
  const auth = useAppSelector((state) => state.auth.value);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      const { userId } = router.query;
      const qUserId = userId as string;
      if (qUserId !== auth?.id) {
        setIsCurrentUser(false);
      } else {
        setIsCurrentUser(true);
      }
    } else {
      setIsCurrentUser(false);
    }
  }, [auth, isLoggedIn, router.query]);

  return (
    <>
      <Friends isCurrentUser={isCurrentUser} user={isCurrentUser ? auth : userNotAuth} />
    </>
  );
};

export default ProfileFriends;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login', 'profile'])),
      // Will be passed to the page component as props
    },
  };
};
