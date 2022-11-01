import { Box, Center, Divider, Heading } from '@chakra-ui/react';
import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';

export interface ILayoutTabProps {
  children: ReactNode;
  title: string;
}

export default function LayoutTab(props: ILayoutTabProps) {
  const { children, title } = props;
  const [clientWindowHeight, setClientWindowHeight] = useState<number>(0);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  return (
    <Box boxShadow='md' rounded='md' minW='6xl' bg='white' minH='300px' py='10' px='8'>
      <Heading as='h4' size='md' pb='4'>
        {title}
      </Heading>
      <Center mx='28' pb='4' zIndex='1'>
        <Divider hidden={clientWindowHeight >= 650} variant='dashed' orientation='horizontal' zIndex='1' />
      </Center>
      <Box pl='14' maxW='full'>
        {children}
      </Box>
    </Box>
  );
}
