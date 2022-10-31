import { Button, Text, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ErrorImage from '../public/images/error.svg';
import styles from '../public/styles/error.module.scss';

interface ErrorPageProps {}

const FourOhFourPage: NextPage<ErrorPageProps> = () => {
  const router = useRouter();
  const { t } = useTranslation<'error', undefined>('error');
  const [isLoading, setIsLoading] = useState(false);

  const bgButton = useColorModeValue(
    'linear-gradient(135deg, #ffcccc 0%, #D0637C 100%)',
    'linear-gradient(135deg, #ffcccc 0%, #D0637C 100%)'
  );

  const bgButtonHover = useColorModeValue(
    'linear-gradient(135deg, #D0637C 0%, #ffcccc 100%)',
    'linear-gradient(135deg, #D0637C 0%, #ffcccc 100%)'
  );

  const goHome = () => {
    setIsLoading(true);
    router.replace('/experiences');
  };

  return (
    <>
      <Head>
        <title>Oops! Something went wrong ~</title>
      </Head>
      <main className={styles.errorContainer}>
        <Image className={styles.image} src={ErrorImage} width={640} height={250} alt='error image' />
        <Text my='5' as='b' fontSize='7xl'>
          404
        </Text>
        <p>{t('text_error')}</p>
        <Button
          isLoading={isLoading}
          onClick={goHome}
          _hover={{ boxShadow: 'none', background: bgButtonHover }}
          bg={bgButton}
          color='textColor.primary_lightMode'
          fontSize='sm'
          borderRadius='lg'
          px='30px'
          minH='10'
          display={{
            sm: 'none',
            lg: 'flex',
          }}
        >
          {t('btn_error')}
        </Button>
      </main>
    </>
  );
};

export default FourOhFourPage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'common', 'error'])),
      // Will be passed to the page component as props
    },
  };
};
