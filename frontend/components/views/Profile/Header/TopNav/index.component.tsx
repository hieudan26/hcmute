import { useColorModeValue } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';

export interface ITopNavProps {
  userId: string;
  mainCurrentRoute: string;
  pushRoute: (link: string) => void;
  auth: IUserFirstLoginRequest | null;
}

export default function TopNav(props: ITopNavProps) {
  const { userId, mainCurrentRoute, pushRoute, auth } = props;
  const { t } = useTranslation('profile');
  const colorText = useColorModeValue('black', 'whtie');

  return (
    <>
      <NextLink href={`../${userId}/posts`} scroll={false}>
        <Button
          borderBottom={mainCurrentRoute === 'posts' ? '2px' : '0px'}
          borderBottomColor={mainCurrentRoute === 'posts' ? 'textColor.logo' : 'transparent'}
          bg='none'
          color={colorText}
          borderRadius='none'
          onClick={() => pushRoute('posts')}
        >
          {t('navbar.posts')}
        </Button>
      </NextLink>
      <NextLink href={`../${userId}/about`} scroll={false}>
        <Button
          borderBottom={mainCurrentRoute === 'about' ? '2px' : '0px'}
          borderBottomColor={mainCurrentRoute === 'about' ? 'textColor.logo' : 'transparent'}
          bg='none'
          color={colorText}
          borderRadius='none'
          onClick={() => pushRoute('about')}
        >
          {t('navbar.about')}
        </Button>
      </NextLink>
      <NextLink href={`../${userId}/friends`} scroll={false}>
        <Button
          borderBottom={mainCurrentRoute === 'friends' ? '2px' : '0px'}
          borderBottomColor={mainCurrentRoute === 'friends' ? 'textColor.logo' : 'transparent'}
          bg='none'
          color={colorText}
          borderRadius='none'
          onClick={() => pushRoute('friends')}
        >
          {t('navbar.friends')}
        </Button>
      </NextLink>
      <NextLink href={`../${userId}/photos`} scroll={false}>
        <Button
          borderBottom={mainCurrentRoute === 'photos' ? '2px' : '0px'}
          borderBottomColor={mainCurrentRoute === 'photos' ? 'textColor.logo' : 'transparent'}
          bg='none'
          color={colorText}
          borderRadius='none'
          onClick={() => pushRoute('photos')}
        >
          {t('navbar.photos')}
        </Button>
      </NextLink>
      {auth && auth.id === userId && (
        <NextLink href={`../${userId}/suggest-friends`} scroll={false}>
          <Button
            borderBottom={mainCurrentRoute === 'suggest-friends' ? '2px' : '0px'}
            borderBottomColor={mainCurrentRoute === 'suggest-friends' ? 'textColor.logo' : 'transparent'}
            bg='none'
            color={colorText}
            borderRadius='none'
            onClick={() => pushRoute('suggest-friends')}
          >
            Đề xuất kết bạn
          </Button>
        </NextLink>
      )}
      {auth && auth.id === userId && (
        <NextLink href={`../${userId}/itinerary`} scroll={false}>
          <Button
            borderBottom={mainCurrentRoute === 'itinerary' ? '2px' : '0px'}
            borderBottomColor={mainCurrentRoute === 'itinerary' ? 'textColor.logo' : 'transparent'}
            bg='none'
            color={colorText}
            borderRadius='none'
            onClick={() => pushRoute('itinerary')}
          >
            Hành trình
          </Button>
        </NextLink>
      )}
    </>
  );
}
