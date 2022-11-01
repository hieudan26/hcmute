import { Box, Center, Divider, Heading, Text, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import { formatDate } from '../../../../utils';

export interface ILayoutTabProps {
  children: ReactNode;
  title: string;
  lastModified?: number;
}

export default function LayoutTab(props: ILayoutTabProps) {
  const { children, title, lastModified } = props;
  const datetimeLastModified = lastModified ? new Date(lastModified) : undefined;
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
      <Flex gap='4' align='center' pb='4'>
        <Heading as='h4' size='md'>
          {title}
        </Heading>
        <Text hidden={!lastModified} fontSize='xx-small' as='i' pt='1'>
          Last modified at: {datetimeLastModified?.toUTCString()}
        </Text>
      </Flex>
      <Center mx='28' pb='4' zIndex='1'>
        <Divider hidden={clientWindowHeight >= 650} variant='dashed' orientation='horizontal' zIndex='1' />
      </Center>
      <Box pl='14' maxW='full'>
        {children}
      </Box>
    </Box>
  );
}
