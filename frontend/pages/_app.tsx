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
