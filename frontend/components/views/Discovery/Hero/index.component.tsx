import { SearchIcon } from '@chakra-ui/icons';
import { Box, chakra, Flex, FormControl, Heading, IconButton, Input, Stack, useColorModeValue } from '@chakra-ui/react';
import { useRef } from 'react';

export interface IHeroProps {}

export default function Hero(props: IHeroProps) {
  const refSection = useRef<HTMLElement | null>(null);

  const scorllToBottom = () => {
    window.scrollTo({
      top: refSection.current?.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <chakra.header pt='72px' ref={refSection}>
      <Box
        w='full'
        h='container.sm'
        backgroundImage='url(https://images.unsplash.com/photo-1467226632440-65f0b4957563?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=787&q=80)'
        bgPos='center'
        bgSize='cover'
      >
        <Flex align='center' pos='relative' justify='center' boxSize='full' bg='blackAlpha.700'>
          <Stack textAlign='center' alignItems='center' spacing={6} w='40%'>
            <Heading fontSize={['lg', '2xl']} fontWeight='semibold' color='white' textTransform='uppercase'>
              Bạn muốn khám phá nơi đâu
            </Heading>
            <Flex align='center' justify='space-between' direction='row' w='full' onClick={scorllToBottom}>
              <FormControl>
                <Input type='email' w='full' readOnly focusBorderColor='none' cursor='pointer' />
              </FormControl>
              <IconButton title='Search' aria-label='Search database' icon={<SearchIcon />} />
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </chakra.header>
  );
}
