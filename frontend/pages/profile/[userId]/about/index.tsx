import { Box } from '@chakra-ui/react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProfileAboutsProps {}

const ProfileAbouts: NextPage = (props: IProfileAboutsProps) => {
  return <Box>ProfileAbouts</Box>;
};

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
  },
});

export const getStaticPaths: GetStaticPaths = () => ({
  paths: ['profile/[userId]/about'],
  fallback: true,
});

export default ProfileAbouts;
