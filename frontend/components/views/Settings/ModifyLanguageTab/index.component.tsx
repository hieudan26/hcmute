import { Box, GridItem, Highlight, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { LangConstants } from '../../../../constants/settings.constant';
import ContainerTab from '../ContainerTab/index.component';

export interface IModifyLanguageTabProps {}

export default function ModifyLanguageTab(props: IModifyLanguageTabProps) {
  const router = useRouter();
  const { t } = useTranslation<'settings', undefined>('settings');

  const changeLanguage = (): void => {
    const { pathname, asPath, query, locale } = router;
    if (locale === LangConstants.VI) {
      router.push({ pathname, query }, asPath, {
        locale: LangConstants.EN,
      });
    } else {
      router.push({ pathname, query }, asPath, {
        locale: LangConstants.VI,
      });
    }

    // trigger reload after push locale to refresh toast(if any) before
    router.events.on('routeChangeComplete', () => {
      router.reload();
    });
  };

  return (
    <ContainerTab title={t('title_tab_sidebar02')}>
      <Box px='7'>
        <SimpleGrid justifyContent='center' columns={6} columnGap={3} rowGap={6}>
          <GridItem colSpan={6}>
            <Text as='b'>{t('sb02_title01')}</Text>
          </GridItem>
          <GridItem colSpan={3} mr='3'>
            {t('sb02_text01')}
            <Highlight query='https://lumiere.hcmute.me/' styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}>
              https://lumiere.hcmute.me/
            </Highlight>
          </GridItem>
          <GridItem colSpan={2}>
            <Text textAlign='center'>{router.locale === LangConstants.EN ? 'English' : 'Việt Nam'}</Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Switch
              colorScheme='pink'
              size='md'
              isChecked={router.locale === LangConstants.EN ? false : true}
              onChange={changeLanguage}
            />
          </GridItem>
        </SimpleGrid>
      </Box>
    </ContainerTab>
  );
}
