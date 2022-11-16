import { ArrowBackIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Heading, IconButton, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export interface ISingleChatHeaderProps {}

export default function SingleChatHeader(props: ISingleChatHeaderProps) {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Flex
      align='center'
      width='100%'
      height='71px'
      p='10px'
      overflow='hidden'
      borderBottom='1px solid'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      maxWidth='100%'
    >
      <IconButton
        // colorScheme='blue'
        aria-label='Go Back'
        icon={<ArrowBackIcon />}
        mr='10px'
        size='md'
        onClick={() => router.push('/')}
        isRound
      />
      {
        // foundUser?.length ? (
        //   <Avatar mr={4} name={foundUser?.[0].displayName} src={foundUser?.[0].photoURL} />
        // ) : (
        <Avatar mr={4} name='Thang Duong' bg={colorMode === 'light' ? 'teal.600' : 'teal.500'} />
        // )
      }
      <Box maxWidth='70%'>
        <Heading size='md' noOfLines={1}>
          Dương Đức thắng
        </Heading>
        <Text>Last Active: Duong Duc Thang</Text>
      </Box>
    </Flex>
  );
}
