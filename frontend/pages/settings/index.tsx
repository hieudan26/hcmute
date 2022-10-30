import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ModifyAccountTab from '../../components/views/Settings/ModifyAccountTab/index.component';
import ModifyLanguageTab from '../../components/views/Settings/ModifyLanguageTab/index.component';

export interface ISettingsProps {}

const Settings: NextPage = (props: ISettingsProps) => {
  const router = useRouter();
  const [queryTab, setQueryTab] = useState<string>('account');

  useEffect(() => {
    const { tab } = router.query;
    console.log('check: ', tab);
    if (tab) {
      setQueryTab(tab as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  if (queryTab === 'account') {
    return <ModifyAccountTab />;
  } else {
    return <ModifyLanguageTab />;
  }
};

export default Settings;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'settings', 'header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
