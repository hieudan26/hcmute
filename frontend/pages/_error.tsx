import { Button, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ErrorImage from '../public/images/error.svg';
import styles from '../public/styles/error.module.scss';

interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  const router = useRouter();
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
    router.back();
  };

  return (
    <>
      <Head>
        <title>Oops! Something went wrong ~</title>
      </Head>
      <main className={styles.errorContainer}>
        <Image className={styles.image} src={ErrorImage} width={640} height={220} alt='error image' />
        <h1>{statusCode}</h1>
        <p>Opps! This page is lost in space.</p>
        <p>Opps! Trang này không tồn tại.</p>

        <Tooltip label='Quay lại'>
          <Button
            isLoading={isLoading}
            onClick={goHome}
            _hover={{ boxShadow: 'none', background: bgButtonHover }}
            bg={bgButton}
            color='textColor.primary_lightMode'
            fontSize='sm'
            borderRadius='14px'
            px='30px'
            display={{
              sm: 'none',
              lg: 'flex',
            }}
          >
            Go back
          </Button>
        </Tooltip>
      </main>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const currentStatusCode = res?.statusCode || 500;
  const throwedStatusCode = err?.statusCode;

  const statusCode = throwedStatusCode || currentStatusCode;

  if (res) {
    // Here is where the magic happens
    res.statusCode = statusCode;
  }

  return { statusCode };
};

export default ErrorPage;
