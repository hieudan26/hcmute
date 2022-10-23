import { Box, GridItem, Highlight, SimpleGrid, Switch, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { setThemeMode } from '../../../../app/themeSlice';
import { LangConstants, ThemeConstants } from '../../../../constants/settings.constant';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import ContainerTab from '../ContainerTab/index.component';

export interface IModifyLanguageTabProps {}

export default function ModifyLanguageTab(props: IModifyLanguageTabProps) {
  const router = useRouter();

  const changeLanguage = (): void => {
    if (router.locale === LangConstants.VI) {
      router.push(router.route, router.asPath, {
        locale: LangConstants.EN,
      });
    } else {
      router.push(router.route, router.asPath, {
        locale: LangConstants.VI,
      });
    }

    // trigger reload after push locale to refresh toast(if any) before
    router.events.on('routeChangeComplete', () => {
      router.reload();
    });
  };

  return (
    <ContainerTab title='Language and Region Settings'>
      <Box px='7'>
        <SimpleGrid justifyContent='center' columns={6} columnGap={3} rowGap={6}>
          <GridItem colSpan={6}>
            <Text as='b'>Lumiere language</Text>
          </GridItem>
          <GridItem colSpan={3} mr='3'>
            <Highlight query='https://lumiere.hcmute.me/' styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}>
              Language for buttons, titles and other text from Lumiere for this account on https://lumiere.hcmute.me/
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
