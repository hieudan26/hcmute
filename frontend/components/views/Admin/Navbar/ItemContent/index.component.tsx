import { Icon, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { MdUpgrade } from 'react-icons/md';

export function ItemContent(props: { info: string }) {
  const textColor = useColorModeValue('#1B254B', 'white');
  return (
    <>
      <Flex
        justify='center'
        align='center'
        borderRadius='10px'
        minH={{ base: '40px', md: '50px' }}
        h={{ base: '40px', md: '50px' }}
        minW={{ base: '40px', md: '50px' }}
        w={{ base: '40px', md: '50px' }}
        me='4'
        bg='linear-gradient(135deg, #fab1a0 0%, #D0637C 100%)'
      >
        <Icon as={MdUpgrade} color='white' w={8} h={14} />
      </Flex>
      <Flex flexDirection='column'>
        <Text mb='2px' fontWeight='bold' color={textColor} fontSize={{ base: 'md', md: 'md' }}>
          New Update: {props.info}
        </Text>
        <Flex alignItems='center'>
          <Text fontSize={{ base: 'sm', md: 'sm' }} lineHeight='100%' color={textColor}>
            A new update for your downloaded item is available!
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
