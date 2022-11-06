import { Box, Flex, Image, Text, Icon, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { defaultAvatar } from '../../../../../utils';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

export interface ICommentRenderProps {}

export default function CommentRender(props: ICommentRenderProps) {
  return (
    <Flex gap='4'>
      <Flex gap='2'>
        <Image src={defaultAvatar} alt='Profile picture' w='10' h='10' rounded='full' />
        <Box>
          <Box bg='gray.100' p='3' rounded='xl' fontSize='sm'>
            <Text display='block' fontWeight='semibold'>
              John Doe
            </Text>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
          </Box>
          <Flex p='2' fontSize='xs' color='gray.500' gap='4'>
            <Text fontWeight='semibold' cursor='pointer'>
              Reply
            </Text>
            <Text>10m</Text>
          </Flex>
        </Box>
      </Flex>
      <Menu closeOnSelect>
        <MenuButton
          mt='2'
          transition='all 0.2s'
          as={IconButton}
          aria-label='Options'
          variant='outline'
          border='none'
          fontSize='md'
          icon={<Icon as={HiOutlineDotsHorizontal} />}
        />
        <MenuList minW='32'>
          <MenuItem>Delete</MenuItem>
          <MenuItem>Edit</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
