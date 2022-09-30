import { ChakraProvider, ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '../app/store';
import { theme } from '../components/chakra/theme.chakra';
import SetLayout from '../components/layouts/SetLayout';
import Loading from '../components/views/Loading/index.component';
import Message from '../components/views/Message/index.component';
import '../public/styles/globals.scss';
import { Amplify } from '@aws-amplify/core';
import awsConfig from '../configurations/aws-configs';
import { Auth } from 'aws-amplify';

const oauth = {
  domain: 'lumiere.auth.ap-southeast-1.amazoncognito.com',
  scope: ['email', 'profile', 'openid'],
  redirectSignIn: 'http://localhost:3000/register',
  redirectSignOut: 'http://localhost:3000/',
  responseType: 'code',
};

Amplify.configure({ ...awsConfig, ssr: true });
Auth.configure({ oauth });
Amplify.Logger.LOG_LEVEL = 'INFO';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <ColorModeProvider>
            <CSSReset />
            <Head>
              <title>Lumière</title>
            </Head>
            <Loading />
            <Message />
            <SetLayout>
              <Component {...pageProps} />
            </SetLayout>
          </ColorModeProvider>
        </ThemeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default appWithTranslation(MyApp);
