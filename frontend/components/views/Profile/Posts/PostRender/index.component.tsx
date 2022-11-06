import { Box, Flex, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { BiCommentDetail } from 'react-icons/bi';
import { Carousel } from 'react-responsive-carousel';
import { defaultAvatar } from '../../../../../utils';
import ModalDetailPost from '../Modals/ModalDetailPost/index.component';

export interface IPostRenderProps {}

export default function PostRender(props: IPostRenderProps) {
  const staticData = [defaultAvatar, defaultAvatar, defaultAvatar, defaultAvatar];
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);

  return (
    <Box bg='white' rounded='lg' mb='5' px='4' shadow='md'>
      <ModalDetailPost
        isOpen={isOpenDetail}
        onClose={() => {
          setIsOpenDetail(false);
        }}
      />
      <Flex justify='space-between' align='center' px='4' py='2'>
        <Flex gap='2' align='center'>
          <Box position='relative'>
            <Image src={defaultAvatar} alt='Profile picture' w='10' h='10' rounded='full' />
            <span className='bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2'></span>
          </Box>
          <Box>
            <Box fontWeight='semibold'>John Doe</Box>
            <Text fontSize='sm' color='gray.500'>
              38m
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Menu closeOnSelect>
            <MenuButton
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
              <MenuItem>Copy link</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Text textAlign='justify' px='4' py='2'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, autem earum cum ullam odio, molestias maxime aperiam
        in id aspernatur vel ratione odit molestiae minus ipsa obcaecati quia! Doloribus, illum.
      </Text>

      <Box px='4' py='2' h='xs'>
        <Carousel infiniteLoop showArrows centerMode={staticData.length > 1} showThumbs={false}>
          {staticData.map((item, index) => (
            <Image w='3xs' h='xs' key={index} src={item} alt={item} />
          ))}
        </Carousel>
      </Box>

      <Box px='4' py='2' pt='6'>
        <Flex align='center' justify='space-between'>
          <Flex direction='row-reverse' align='center'>
            <Text fontSize='xs' ml='2' color='gray.500'>
              999
            </Text>
            <Icon color='#D0637C' fontSize='xl' as={AiFillHeart} />
          </Flex>
          <Box fontSize='xs' color='gray.500'>
            <Text>90 comments</Text>
          </Box>
        </Flex>
      </Box>

      <Box px='4' py='2'>
        <Box border='1px' borderColor='gray.200' borderX='0' py='1'>
          <Flex gap='2' fontSize='xs' width='100%'>
            <Flex
              w='100%'
              justify='center'
              align='center'
              bg='transparent'
              _hover={{ bg: 'gray.100' }}
              py='2'
              cursor='pointer'
              rounded='lg'
              color='gray.500'
            >
              <Icon color='#D0637C' as={AiFillHeart} />
              &nbsp;
              <Text fontSize='md'>Love</Text>
            </Flex>
            <Flex
              w='100%'
              justify='center'
              align='center'
              bg='transparent'
              _hover={{ bg: 'gray.100' }}
              py='2'
              cursor='pointer'
              rounded='lg'
              color='gray.500'
              onClick={() => {
                setIsOpenDetail(true);
              }}
            >
              <Icon color='#D0637C' as={BiCommentDetail} />
              &nbsp;
              <Text fontSize='md'>Comment</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
