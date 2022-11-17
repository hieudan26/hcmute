import { useColorModeValue } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';

export interface ITopNavProps {
  userId: string;
  mainCurrentRoute: string;
  pushRoute: (link: string) => void;
}

export default function TopNav(props: ITopNavProps) {
  const { userId, mainCurrentRoute, pushRoute } = props;
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
          Posts
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
          About
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
          Friends
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
          Photos
        </Button>
      </NextLink>
    </>
  );
}
