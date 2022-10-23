import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ModifyAccountTab from '../../components/views/Settings/ModifyAccountTab/index.component';
import ModifyLanguageTab from '../../components/views/Settings/ModifyLanguageTab/index.component';

export interface ISettingsProps {}

const Settings: NextPage = (props: ISettingsProps) => {
  const router = useRouter();
  const { tab } = router.query;
  
  if (tab === 'account') {
    return <ModifyAccountTab />
  }
  else {
    return <ModifyLanguageTab />
  }
};

export default Settings;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
