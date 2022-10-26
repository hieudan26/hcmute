import { Box } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProfilePostsProps {}

const ProfilePosts: NextPage = (props: IProfilePostsProps) => {
  return (
    <>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
      <Box>ProfilePosts</Box>
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
