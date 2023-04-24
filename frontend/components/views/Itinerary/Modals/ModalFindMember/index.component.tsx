import {
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useFriends, useUsers } from '../../../../../hooks/queries/friend';
import { FriendStatus } from '../../../../../constants/global.constant';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { IFriendResponse, IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { UIEventHandler, useEffect, useRef, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';

export interface IModalFindMemberProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ModalFindMember(props: IModalFindMemberProps) {
  const { isOpen, onOpen, onClose } = props;
  const auth = useAppSelector((state) => state.auth.value);
  const containerUsersRef = useRef<HTMLDivElement>(null);
  const containerFriendsRef = useRef<HTMLDivElement>(null);
  const friends = useFriends(
    {
      status: FriendStatus.FRIEND,
      userId: auth ? auth.id : '86ce8572-3c92-4cca-89e3-060c35e613be',
      pageNumber: 0,
      pageSize: 10,
      sortBy: 'time',
      sortType: 'DESC',
    },
    isOpen
  );
  const users = useUsers(
    {
      paging: {
        pageNumber: 0,
        pageSize: 10,
      },
      searchFirstName: undefined,
      searchLastName: undefined,
    },
    isOpen
  );

  const handleScroll = (type: string) => {
    var container;

    if (type === 'USERS') {
      container = containerUsersRef.current;
    } else {
      container = containerFriendsRef.current;
    }

    if (container) {
      const scrollPosition = container.scrollTop + container.offsetHeight;
      if (scrollPosition === container.scrollHeight) {
        if (type === 'USERS' && users.hasNextPage) {
          users.fetchNextPage();
        }

        if (type === 'FRIENDS' && friends.hasNextPage) {
          friends.fetchNextPage();
        }
      }
    }
  };

  return (
    <Modal blockScrollOnMount={true} motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Thêm thành viên</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl px='14' pb='2'>
            <FormLabel>Tìm kiếm theo tên</FormLabel>
            <Input type='text' placeholder='Tìm kiếm' />
          </FormControl>
          <Tabs isFitted variant='line' colorScheme='pink'>
            <TabList mb='1em'>
              <Tab>Danh sách thành viên</Tab>
              <Tab>Danh sách bạn bè</Tab>
              <Tab>Tất cả mọi người</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex rounded='md' border='1px' borderColor='gray.400' p='4' my='2' mx='4' align='center' justify='space-between'>
                  <Flex align='center'>
                    <Checkbox colorScheme='pink' />
                    <Avatar ml='6' size='sm' name='a' src='a' />
                    <Text ml='2' fontSize='sm'>
                      a
                    </Text>
                  </Flex>
                  <Flex mr='4'>
                    <DeleteIcon _hover={{ color: '#D0637C' }} cursor='pointer' />
                  </Flex>
                </Flex>
                <Flex rounded='md' border='1px' borderColor='gray.400' p='4' my='2' mx='4' align='center' justify='space-between'>
                  <Flex align='center'>
                    <Checkbox colorScheme='pink' />
                    <Avatar ml='6' size='sm' name='a' src='a' />
                    <Text ml='2' fontSize='sm'>
                      a
                    </Text>
                  </Flex>
                  <Flex mr='4'>
                    <DeleteIcon _hover={{ color: '#D0637C' }} cursor='pointer' />
                  </Flex>
                </Flex>
                <Flex rounded='md' border='1px' borderColor='gray.400' p='4' my='2' mx='4' align='center' justify='space-between'>
                  <Flex align='center'>
                    <Checkbox colorScheme='pink' />
                    <Avatar ml='6' size='sm' name='a' src='a' />
                    <Text ml='2' fontSize='sm'>
                      a
                    </Text>
                  </Flex>
                  <Flex mr='4'>
                    <DeleteIcon _hover={{ color: '#D0637C' }} cursor='pointer' />
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex
                  direction='column'
                  w='full'
                  h='xs'
                  overflowY='auto'
                  ref={containerFriendsRef}
                  onScroll={() => {
                    handleScroll('FRIENDS');
                  }}
                >
                  {friends.data?.pages[0].data.content.length === 0 ? (
                    <Text py='2'>Không có dữ liệu</Text>
                  ) : (
                    friends.data?.pages.map((page) =>
                      page.data.content.map((item: IFriendResponse, index: number) => (
                        <Flex
                          key={index}
                          rounded='md'
                          border='1px'
                          borderColor='gray.400'
                          p='4'
                          my='2'
                          mx='4'
                          align='center'
                          justify='space-between'
                        >
                          <Flex align='center'>
                            <Checkbox colorScheme='pink' />
                            <Avatar ml='6' size='sm' name={item.fullName} src={item.avatar} />
                            <Text ml='2' fontSize='sm'>
                              {item.fullName}
                            </Text>
                          </Flex>
                          <Flex mr='4'>
                            <DeleteIcon _hover={{ color: '#D0637C' }} cursor='pointer' />
                          </Flex>
                        </Flex>
                      ))
                    )
                  )}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex
                  direction='column'
                  w='full'
                  h='xs'
                  overflowY='auto'
                  ref={containerUsersRef}
                  onScroll={() => {
                    handleScroll('USERS');
                  }}
                >
                  {users.data?.pages[0].data.content.length === 0 ? (
                    <Text py='2'>Không có dữ liệu</Text>
                  ) : (
                    users.data?.pages.map((page) =>
                      page.data.content.map((item: IUserFirstLoginRequest, index: number) => (
                        <Flex
                          key={index}
                          rounded='md'
                          border='1px'
                          borderColor='gray.400'
                          p='4'
                          my='2'
                          mx='4'
                          align='center'
                          justify='space-between'
                        >
                          <Flex align='center'>
                            <Checkbox colorScheme='pink' />
                            <Avatar ml='6' size='sm' name={`${item.firstName} ${item.lastName}`} src={item.avatar} />
                            <Text ml='2' fontSize='sm'>
                              {item.firstName + ' ' + item.lastName}
                            </Text>
                          </Flex>
                          <Flex mr='4'>
                            <DeleteIcon _hover={{ color: '#D0637C' }} cursor='pointer' />
                          </Flex>
                        </Flex>
                      ))
                    )
                  )}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button>Lưu</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
