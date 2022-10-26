import { Box } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProfileFriendsProps {}

const ProfileFriends: NextPage = (props: IProfileFriendsProps) => {
  return <Box>ProfileFriends</Box>;
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
