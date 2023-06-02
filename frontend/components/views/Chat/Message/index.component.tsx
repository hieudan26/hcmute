import { Avatar, Box, Flex, Text, useColorMode } from '@chakra-ui/react';
import { useAppSelector } from '../../../../hooks/redux';
import { IMessage } from '../../../../models/chat/chat.model';
import { addAMPM } from '../../../../utils';

export interface IMessageProps {
  message: string;
  userId: string;
  data: IMessage;
  type: string;
}

export default function Message(props: IMessageProps) {
  const { message, userId, data, type } = props;
  const { colorMode } = useColorMode();
  const auth = useAppSelector((state) => state.auth.value);
  const bgColor = { light: 'gray.300', dark: 'gray.600' };
  const textColor = { light: 'black', dark: 'white' };

  return (
    <Flex
      maxW='60%'
      margin={2}
      ml={auth?.id === userId ? 'auto' : '0'}
      position='relative'
      // align='center'
      gap='2'
      wordBreak='break-word'
      color={auth?.id === userId ? 'white' : textColor[colorMode]}
    >
      {type === 'GROUP' && auth?.id !== userId && <Avatar size='sm' name={data.fullName} src={data.avatar} />}
      <Flex flexDirection='column' alignItems={auth?.id === userId ? 'end' : 'start'} textAlign='justify' wordBreak='break-word'>
        {type === 'GROUP' && (
          <Text as='sub' color='black' mb='3' mx='1'>
            {data.fullName}, {addAMPM(data.time.split(' ')[1])}
          </Text>
        )}
        {type === 'SINGLE' && (
          <Text as='sub' color='black' mb='3' mx='1'>
            {addAMPM(data.time.split(' ')[1])}
          </Text>
        )}
        <Box bg={auth?.id === userId ? '#D0637C' : bgColor[colorMode]} rounded='xl' w='fit-content' py={1} px={3}>
          <Text>{message}</Text>
        </Box>
      </Flex>
    </Flex>
  );
}
