import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface IProfileProps {}

const Profile: NextPage = (props: IProfileProps) => {
  return <div></div>;
};

export default Profile;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common'])),
      // Will be passed to the page component as props
    },
  };
}
