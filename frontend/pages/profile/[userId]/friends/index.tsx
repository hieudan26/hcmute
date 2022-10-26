import { Box } from '@chakra-ui/react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProfileFriendsProps {}

const ProfileFriends: NextPage = (props: IProfileFriendsProps) => {
  return <Box>ProfileFriends</Box>;
};

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
  },
});

export const getStaticPaths: GetStaticPaths = () => ({
  paths: ['profile/[userId]/friends'],
  fallback: true,
});

export default ProfileFriends;
