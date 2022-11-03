import { Amplify } from '@aws-amplify/core';
import { ChakraProvider, ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/react';
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Auth } from 'aws-amplify';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store, { wrapper } from '../app/store';
import { theme } from '../components/chakra/theme.chakra';
import HistoryProvider from '../components/contexts/History';
import SetLayout from '../components/layouts/SetLayout';
import Goodbye from '../components/views/Goodbye/index.component';
import Loading from '../components/views/Loading/index.component';
import Message from '../components/views/Message/index.component';
import awsConfig from '../configurations/aws-configs';
import '../public/styles/globals.scss';
import { configReactQuery } from '../utils';

const oauth = {
  domain: 'lumiere.auth.ap-southeast-1.amazoncognito.com',
  scope: ['email', 'profile', 'openid'],
  redirectSignIn: 'http://localhost:3000/experiences',
  redirectSignOut: 'http://localhost:3000/experiences',
  responseType: 'code',
};

// if (process.env.NODE_ENV === 'production') {
//   disableReactDevTools();
// }

if (
  typeof window !== 'undefined' &&
  typeof window.navigator !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  navigator.userAgent &&
  process.env.NODE_ENV === 'production'
) {
  const disableDevtool = require('disable-devtool');
  disableDevtool();
}

Amplify.configure({ ...awsConfig, ssr: true });
Auth.configure({ oauth });
Amplify.Logger.LOG_LEVEL = 'INFO';

function MyApp({ Component, pageProps }: AppProps | any) {
  const [queryClient] = useState(() => new QueryClient(configReactQuery));
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <ColorModeProvider>
              <CSSReset />
              <Head>
                <title>Lumière</title>
              </Head>
              <QueryClientProvider client={queryClient} contextSharing={true}>
                <Hydrate state={pageProps.dehydratedState}>
                  <HistoryProvider>
                    <Loading />
                    <Message />
                    <Goodbye />
                    <SetLayout>
                      {/* <Goodbye /> */}
                      <NextNProgress options={{ showSpinner: false }} color='#D0637C' />
                      <Component {...pageProps} />
                    </SetLayout>
                  </HistoryProvider>
                </Hydrate>
                <ReactQueryDevtools initialIsOpen={false} />
              </QueryClientProvider>
            </ColorModeProvider>
          </ThemeProvider>
        </PersistGate>
      </ChakraProvider>
    </Provider>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp));
