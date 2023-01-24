import { Box } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuggestFriends from '../../../../components/views/SuggestFriends/index.component';

export interface IProfileSuggestFriendProps {}

const ProfileSuggestFriend: NextPage = (props: IProfileSuggestFriendProps) => {
  return (
    <Box w='full'>
      <SuggestFriends />
    </Box>
  );
};

export default ProfileSuggestFriend;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login', 'profile', 'suggest_friends'])),
      // Will be passed to the page component as props
    },
  };
};
