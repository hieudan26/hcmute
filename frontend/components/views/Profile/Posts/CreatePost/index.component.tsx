import { useColorModeValue } from '@chakra-ui/react';
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { AiFillFileImage, AiFillSmile, AiFillYoutube } from 'react-icons/ai';
import { ChakraNextImageGlobal } from '../../../ChakraNextImageGlobal/index.component';

export interface ICreatePostProps {
  avatar: string;
  fullname?: string;
  onCreate: () => void;
}

export default function CreatePost(props: ICreatePostProps) {
  const { onCreate, avatar, fullname } = props;
  const bgInput = useColorModeValue('gray.100', 'blackAlpha.300');

  return (
    <>
      <Flex align='center' gap='2' borderBottom='1px' borderBottomColor='gray.200' pb='3' mb='2'>
        <Box w='10' h='10'>
          <ChakraNextImageGlobal
            w='40px'
            h='40px'
            width='40px'
            height='40px'
            rounded='full'
            overflow='hidden'
            alt='avatar'
            src={avatar}
          />
        </Box>
        <Button
          onClick={onCreate}
          _focus={{ outline: 'none', bg: 'gray.300' }}
          _hover={{ bg: 'gray.200' }}
          bg={bgInput}
          color='gray.500'
          rounded='full'
          h='10'
          pl='5'
          w='100%'
          display='inline-flex'
          flexDir='column'
          alignItems='flex-start'
        >
          {fullname ? `What's on your mind, ${fullname}?` : 'How are you today?'}
        </Button>
      </Flex>
      <Flex direction='row' align='center' fontSize='sm' color='gray.600' mb='-1' justify='center'>
        <Button
          w='100%'
          bg='transparent'
          color='gray.600'
          h='8'
          gap='2'
          rounded='md'
          _hover={{ bg: 'gray.100' }}
          _focus={{ outline: 'none', bg: 'gray.200' }}
        >
          <Box>
            <Icon fontSize='lg' color='red.400' as={AiFillYoutube} />
          </Box>
          <Box>
            <Text fontWeight='semibold'>Create Video</Text>
          </Box>
        </Button>
        <Button
          w='100%'
          bg='transparent'
          color='gray.600'
          h='8'
          gap='2'
          rounded='md'
          _hover={{ bg: 'gray.100' }}
          _focus={{ outline: 'none', bg: 'gray.200' }}
        >
          <Box>
            <Icon fontSize='lg' color='green.500' as={AiFillFileImage} />
          </Box>
          <Box>
            <Text fontWeight='semibold'>Photos / Video</Text>
          </Box>
        </Button>
        <Button
          w='100%'
          bg='transparent'
          color='gray.600'
          h='8'
          gap='2'
          rounded='md'
          _hover={{ bg: 'gray.100' }}
          _focus={{ outline: 'none', bg: 'gray.200' }}
        >
          <Box>
            <Icon fontSize='lg' color='yellow.500' as={AiFillSmile} />
          </Box>
          <Box>
            <Text fontWeight='semibold'>Feeling / Activity</Text>
          </Box>
        </Button>
      </Flex>
    </>
  );
}
