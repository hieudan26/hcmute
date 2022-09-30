import {
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link as LinkChakra,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { SiFacebook, SiGithub, SiLinkedin, SiTwitter } from 'react-icons/si';
import { getCurrentYear } from '../../../utils';
import Logo from '../Navbar/Logo/index.component';

export interface IFooterProps {}

export default function Footer(props: IFooterProps) {
  const bg = useColorModeValue('gray.100', 'header.primary_darkMode');
  const { t } = useTranslation('footer');

  return (
    <footer>
      <VStack position='absolute' spacing={4} w='full' align='center' px={6} py={4} bg={bg}>
        <Flex direction={['column', 'column', 'row']}>
          <VStack spacing={2} align='flex-start' w={{ base: 'full', lg: 2 / 5 }} mr={8}>
            <Logo />
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, nisi! Id.</Text>
            <HStack spacing={1}>
              <IconButton aria-label='Facebook' icon={<SiFacebook />}></IconButton>
              <IconButton aria-label='Twitter' icon={<SiTwitter />}></IconButton>
              <IconButton aria-label='LinkedIn' icon={<SiLinkedin />}></IconButton>
              <IconButton aria-label='Github' icon={<SiGithub />}></IconButton>
            </HStack>
          </VStack>
          <SimpleGrid columns={[2, 3, 3, 4]} w='full' gap={6} justifyContent='space-between'>
            <VStack align='flex-start'>
              <Heading size='sm' textTransform='uppercase'>
                {t('about')}
              </Heading>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Company</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Community</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Careers</LinkChakra>
              </Link>
            </VStack>
            <VStack align='flex-start'>
              <Heading size='sm' textTransform='uppercase'>
                {t('blog')}
              </Heading>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Tech</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Music</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Videos</LinkChakra>
              </Link>
            </VStack>
            <VStack align='flex-start'>
              <Heading size='sm' textTransform='uppercase'>
                {t('products')}
              </Heading>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Rosely</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Ashley</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>Primula</LinkChakra>
              </Link>
            </VStack>
            <VStack align='flex-start'>
              <Heading size='sm' textTransform='uppercase'>
                {t('contact')}
              </Heading>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>+1 555 123 4567</LinkChakra>
              </Link>
              <Link href='/' passHref>
                <LinkChakra fontSize='sm'>info@Lumière.com</LinkChakra>
              </Link>
            </VStack>
          </SimpleGrid>
        </Flex>
        <Divider borderColor='gray.500' mx='auto' />
        <Text fontSize='base'>
          {t('copyright')} &copy; {getCurrentYear} Lumière, Inc.
        </Text>
      </VStack>
    </footer>
  );
}
