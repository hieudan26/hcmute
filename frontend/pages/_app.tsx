import { Amplify } from '@aws-amplify/core';
import { ChakraProvider, ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/react';
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Auth } from 'aws-amplify';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store, { wrapper } from '../app/store';
import { theme } from '../components/chakra/theme.chakra';
import SetLayout from '../components/layouts/SetLayout';
import Goodbye from '../components/views/Goodbye/index.component';
import Loading from '../components/views/Loading/index.component';
import Message from '../components/views/Message/index.component';
import awsConfig from '../configurations/aws-configs';
import '../public/styles/globals.scss';
import { configReactQuery } from '../utils';
import NextNProgress from 'nextjs-progressbar';
import { LocalUtils } from '../utils/local.utils';
import { AuthService } from '../services/auth/auth.service';
import { useAppDispatch } from '../hooks/redux';
import { logout } from '../app/slices/authSlice';
import { clearUserNotAuth } from '../app/slices/userNotAuthSlice';

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
  const ref: { current: NodeJS.Timeout | null } = useRef(null);
  const dispatch = useAppDispatch();
  let persistor = persistStore(store);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const currentSession = await Auth.currentSession();
  //       const idTokenExpire = currentSession.getIdToken().getExpiration();
  //       const refreshToken = currentSession.getRefreshToken();
  //       const currentTimeSeconds = Math.round(+new Date() / 1000);

  //       if (idTokenExpire < currentTimeSeconds) {
  //         const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
  //         currentAuthenticatedUser.refreshSession(refreshToken, (err: any, data: any) => {
  //           if (err) {
  //             handleUnAuthorize();
  //           } else {
  //             LocalUtils.storeAuthenticationData();
  //           }
  //         });
  //       }
  //     } catch (error: any) {
  //       handleUnAuthorize();
  //     }
  //   }, 10000);
  //   ref.current = interval;
  //   return () => {
  //     clearInterval(ref.current as NodeJS.Timeout);
  //   };
  // }, []);

  const handleUnAuthorize = async () => {
    await AuthService.logout();
    dispatch(logout());
    dispatch(clearUserNotAuth());

    if (typeof window !== 'undefined' && window.location.href.indexOf('/login') === -1) {
      window.location.href = `/login?url=${window.location.pathname}`;
    }
  };

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
                    <NextNProgress options={{ showSpinner: false }} color='#D0637C' />
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

export default wrapper.withRedux(appWithTranslation(MyApp));
