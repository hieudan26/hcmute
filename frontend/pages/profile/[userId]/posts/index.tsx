import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { toggleLoading } from '../../../../components/views/Loading/index.component';
import LoadingComponent from '../../../../components/views/Loading/LoadingComponent.tsx/index.component';
import userService from '../../../../services/user/user.service';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { timeRefreshDataTenSeconds } from '../../../../utils';

//#region lazy loading component
const Posts = dynamic(() => import('../../../../components/views/Profile/Posts/index.component'), {
  loading: () => <LoadingComponent />,
});
//#endregion

export interface IProfilePostsProps {}

const ProfilePosts: NextPage<IProfilePostsProps> = (props: IProfilePostsProps) => {
  const modalRef = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!modalRef.current) {
        queryClient.invalidateQueries(['posts_by_type_userId']);
      }
    }, timeRefreshDataTenSeconds);

    return () => clearInterval(interval);
  }, [queryClient, modalRef]);

  return (
    <>
      <Posts modalRef={modalRef} />
    </>
  );
};

export default ProfilePosts;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }: any) => {
  // const { userId } = params;
  // const response = await userService.getUserInformationById(userId.toString());
  // var user = undefined;
  // if (response.isSuccess) {
  //   user = response.data;
  // } else {
  //   // in the current page, with the 404 http status code.
  //   // this will display your /pages/404.js error page,
  //   return { notFound: true };
  // }

  return {
    props: {
      // user,
      ...(await serverSideTranslations(locale, [
        'header',
        'footer',
        'common',
        'modal_is_first_login',
        'modal_create_post',
        'post',
        'profile',
      ])),
      // Will be passed to the page component as props
    },
  };
};
