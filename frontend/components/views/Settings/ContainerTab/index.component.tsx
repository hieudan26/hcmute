import { useColorModeValue } from '@chakra-ui/react';
import { Box, Divider, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface IContainerTabProps {
  children: ReactNode;
  title: string;
}

export default function ContainerTab(props: IContainerTabProps) {
  const { children, title } = props;
  const bgContainerTab = useColorModeValue('white', 'backgroundBox.primary_darkMode');

  return (
    <Box minW='full' px='20' py='4' bg={bgContainerTab} borderRadius='md'>
      <Text fontSize='2xl' fontWeight='bold' pb='0'>
        {title}
      </Text>
      <Divider pb='1' />
      <Box pt='5'>{children}</Box>
    </Box>
  );
}
