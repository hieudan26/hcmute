import { Box, Text, useColorMode } from '@chakra-ui/react';
import { useAppSelector } from '../../../../hooks/redux';

export interface IMessageProps {
  message: string;
  userId: string;
}

export default function Message(props: IMessageProps) {
  const { message, userId } = props;
  const { colorMode } = useColorMode();
  const auth = useAppSelector((state) => state.auth.value);
  const bgColor = { light: 'gray.300', dark: 'gray.600' };
  const textColor = { light: 'black', dark: 'white' };

  return (
    <Box
      bg={auth?.id === userId ? '#D0637C' : bgColor[colorMode]}
      w='fit-content'
      maxW='60%'
      py={1}
      px={3}
      rounded='xl'
      margin={2}
      ml={auth?.id === userId ? 'auto' : '0'}
      position='relative'
      textAlign='justify'
      // textAlign={auth?.id === userId ? 'right' : 'left'}
      wordBreak='break-word'
      color={auth?.id === userId ? 'white' : textColor[colorMode]}
    >
      <Text>{message}</Text>
    </Box>
  );
}
