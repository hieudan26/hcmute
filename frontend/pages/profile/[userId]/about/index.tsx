import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';
import cookie from 'react-cookies';
import { CookieConstants, LocalStorageConstants } from '../../../../constants/store.constant';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import { LocalUtils } from '../../../../utils/local.utils';
import { useRouter } from 'next/router';

//#region lazy loading components
const About = dynamic(() => import('../../../../components/views/Profile/About/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfileAboutsProps {}

const ProfileAbouts: NextPage = (props: IProfileAboutsProps) => {
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
      <About isCurrentUser={isCurrentUser} user={isCurrentUser ? auth : userNotAuth} />
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
