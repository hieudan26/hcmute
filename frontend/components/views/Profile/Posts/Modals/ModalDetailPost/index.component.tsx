import {
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
  ModalFooter,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { BiCommentDetail } from 'react-icons/bi';
import { Carousel } from 'react-responsive-carousel';
import ModalContainer from '../../../../Modals/ModalContainer/index.component';
import { defaultAvatar } from '../../../../../../utils';
import CommentRender from '../../CommentRender/index.component';
import TreeCommentRender from '../../TreeCommentRender/index.component';
import CommentForm from './CommentForm/index.component';

export interface IModalDetailPostProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDetailPost(props: IModalDetailPostProps) {
  const { isOpen, onClose } = props;
  const commentsEndRef = useRef<null | HTMLDivElement>(null);
  const commentInputRef = useRef<null | HTMLInputElement>(null);
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');
  const staticData = [defaultAvatar, defaultAvatar, defaultAvatar, defaultAvatar];

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const recursiveData = {
    name: 'Name1-1',
    partner: 'Name1-2',
    birthDay: '01/02/1803',
    dob: '02/03/1874',
    childrens: [
      {
        name: 'Name2-1',
        partner: 'Name2-2',
        birthDay: '05/04/1823',
        dob: '06/05/1904',
        childrens: [
          {
            name: 'Name3-1',
            partner: 'Name3-2',
            birthDay: '19/07/1841',
            dob: '22/03/1924',
            childrens: [
              {
                name: 'Name4-1',
                partner: 'Name4-2',
                birthDay: '15/09/1873',
                dob: '21/06/1954',
              },
              {
                name: 'Name4-3',
                partner: 'Name4-4',
              },
            ],
          },
          {
            name: 'Name3-2',
            partner: '3-4',
            birthDay: '01/02/1803',
            dob: '02/03/1874',
            childrens: [],
          },
        ],
      },
      {
        name: 'Name2-3',
        partner: 'Name2-4',
        birthDay: '01/02/1803',
        dob: '02/03/1874',
        childrens: [
          {
            name: 'Name3-3',
            partner: 'Name2',
            birthDay: '01/02/1803',
            dob: '02/03/1874',
            childrens: [],
          },
        ],
      },
    ],
  };

  const onSubmitComment = (value: string) => {
    console.log(value);
    scrollToBottom();
  };

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent bg={bgModalContent} pb='0' width='2xl'>
        <ModalHeader fontWeight={700} textAlign={'center'}>
          Thắng Dương&apos;s Post
        </ModalHeader>
        <Divider />
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Box overflowY='auto' minH='60vh' maxH='60vh'>
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, autem earum cum ullam odio, molestias maxime
              aperiam in id aspernatur vel ratione odit molestiae minus ipsa obcaecati quia! Doloribus, illum.
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
                      commentInputRef.current?.focus();
                    }}
                  >
                    <Icon color='#D0637C' as={BiCommentDetail} />
                    &nbsp;
                    <Text fontSize='md'>Comment</Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>

            {/* <CommentRender /> */}
            <TreeCommentRender a={recursiveData} />
            <div ref={commentsEndRef} />
          </Box>
          <ModalFooter bg='gray.50' rounded='md' justifyContent='flex-start'>
            <CommentForm _onSumbit={onSubmitComment} _ref={commentInputRef} />
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
