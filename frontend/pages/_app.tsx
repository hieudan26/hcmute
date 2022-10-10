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
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { configReactQuery } from '../utils';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Goodbye from '../components/views/Goodbye/index.component';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// const oauth = {
//   domain: 'lumiere.auth.ap-southeast-1.amazoncognito.com',
//   scope: ['email', 'profile', 'openid'],
//   redirectSignIn: 'http://localhost:3000/register',
//   redirectSignOut: 'http://localhost:3000/',
//   responseType: 'code',
// };

Amplify.configure({ ...awsConfig, ssr: true });
// Auth.configure({ oauth });
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
                  <Loading />
                  <Message />
                  <Goodbye />
                  <SetLayout>
                    {/* <Goodbye /> */}
                    <Component {...pageProps} />
                  </SetLayout>
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

export default appWithTranslation(MyApp);
