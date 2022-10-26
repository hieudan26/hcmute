import { Box } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProfilePhotosProps {}

const ProfilePhotos: NextPage = (props: IProfilePhotosProps) => {
  return <Box>ProfilePhotos</Box>;
};

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'modal_is_first_login'])),
  },
});

export const getStaticPaths: GetStaticPaths = () => ({
  paths: ['profile/[userId]/photos'],
  fallback: true,
});

export default ProfilePhotos;
