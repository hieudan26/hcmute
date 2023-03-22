import { Badge, Box, Button, Flex, Image, SimpleGrid, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';

export interface IHeroProps {}

export default function Hero(props: IHeroProps) {
  const refSection = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const scorllToBottom = () => {
    window.scrollTo({
      top: refSection.current?.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <SimpleGrid
      _dark={{
        bg: 'backgroundPage.primary_darkMode',
      }}
      bg='gray.100'
      ref={refSection}
      pt='71px'
      columns={{
        base: 1,
        md: 2,
      }}
      spacing={0}
      _after={{
        bg: 'gray.100',
        opacity: 0.25,
        pos: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
        content: '" "',
      }}
    >
      <Flex
        direction='column'
        alignItems='start'
        justifyContent='center'
        px={{
          base: 4,
          lg: 20,
        }}
        py={24}
      >
        <Badge color='black' px={3} py={1} mb={3} variant='solid' bg='#fce2dc' rounded='lg'>
          Góc đóng góp điểm đến
        </Badge>
        <chakra.h1
          mb={6}
          fontSize={{
            base: '4xl',
            md: '4xl',
            lg: '5xl',
          }}
          fontWeight='bold'
          color='brand.600'
          _dark={{
            color: 'gray.300',
          }}
          lineHeight='shorter'
        >
          Hãy đóng góp địa điểm du lịch - cộng đồng ..
        </chakra.h1>
        <Flex w='full' gap='2' pr='6'>
          <Button w='full' onClick={scorllToBottom}>
            Đóng góp tại đây
          </Button>
          <Button
            w='full'
            onClick={() => {
              router.push('/contribute/list-of-previous-contributions');
            }}
          >
            Các địa điểm đã đóng góp
          </Button>
        </Flex>
      </Flex>
      <Box>
        <Image
          roundedBottomLeft='lg'
          src='https://static.toiimg.com/photo/86650932.cms'
          alt='hero'
          fit='cover'
          w='full'
          h={{
            base: 64,
            md: 'full',
          }}
          bg='gray.100'
          loading='lazy'
        />
      </Box>
    </SimpleGrid>
  );
}
