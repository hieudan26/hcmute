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
  IconButton,
} from '@chakra-ui/react';
import { useFriends, useUsers } from '../../../../../hooks/queries/friend';
import { FriendStatus } from '../../../../../constants/global.constant';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { IFriendResponse, IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { UIEventHandler, useEffect, useRef, useState } from 'react';
import { AddIcon, DeleteIcon, MinusIcon, SearchIcon } from '@chakra-ui/icons';
import { useCUDTrip, useTripMembers } from '../../../../../hooks/queries/trip';
import { ITripUpdateMemberModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';
import UserBox from '../../UserBox/index.component';

export interface IModalFindMemberProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  trip: ITripsResponseModel | undefined;
}

export default function ModalFindMember(props: IModalFindMemberProps) {
  const { isOpen, onOpen, onClose, trip } = props;
  const auth = useAppSelector((state) => state.auth.value);
  const containerUsersRef = useRef<HTMLDivElement>(null);
  const containerFriendsRef = useRef<HTMLDivElement>(null);
  const containerMembersRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [idsMember, setIdsMember] = useState<string[]>([]);
  const { mutatuionUpdateTripMembers } = useCUDTrip();
  const friends = useFriends(
    {
      key: key !== '' ? key : undefined,
      status: FriendStatus.FRIEND,
      userId: auth ? auth.id : '86ce8572-3c92-4cca-89e3-060c35e613be',
      pageNumber: 0,
      pageSize: 10,
      sortBy: 'time',
      sortType: 'DESC',
    },
    tabIndex === 1 && isOpen && trip !== undefined
  );
  const users = useUsers(
    {
      paging: {
        pageNumber: 0,
        pageSize: 10,
      },
      searchFirstName: key !== '' ? key : undefined,
      searchLastName: key !== '' ? key : undefined,
    },
    tabIndex === 2 && isOpen && trip !== undefined
  );
  const members = useTripMembers(
    {
      params: {
        pageNumber: undefined,
        pageSize: undefined,
      },
      tripId: trip ? trip.id : 1,
      key: key !== '' ? key : undefined,
    },
    isOpen && trip !== undefined
  );

  useEffect(() => {
    let array: string[] = [];
    members.data?.pages[0].data.content.map((x: IUserFirstLoginRequest) => {
      array.push(x.id);
    });

    setIdsMember(array);
  }, [members.data?.pages]);

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

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setSearch(event.target.value);
  };

  const searching = () => {
    setKey(search);
  };

  const updateArrayMembers = async (id: string) => {
    if (idsMember.includes(id)) {
      let arr = [...idsMember];
      const filteredId = arr.filter((value) => value !== id);
      setIdsMember(filteredId);
    } else {
      let arr = [...idsMember];
      arr.push(id);
      setIdsMember(arr);
    }
  };

  const reset = () => {
    let array: string[] = [];
    members.data?.pages[0].data.content.map((x: IUserFirstLoginRequest) => {
      array.push(x.id);
    });

    setIdsMember(array);
  };

  const updateMembers = async () => {
    console.log(idsMember);
    if (trip) {
      let arr: ITripUpdateMemberModel[] = [];
      idsMember.map((item) => {
        arr.push({
          role: 'member',
          userId: item,
        });
      });
      await mutatuionUpdateTripMembers.mutateAsync({
        tripId: trip.id,
        members: arr,
      });
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
            <Flex gap='4'>
              <Input type='text' placeholder='Tìm kiếm' value={search} onChange={changeSearch} />
              <IconButton colorScheme='blue' aria-label='Search database' icon={<SearchIcon />} onClick={searching} />
            </Flex>
          </FormControl>
          <Tabs
            isFitted
            variant='line'
            colorScheme='pink'
            onChange={(index) => {
              setTabIndex(index);
              search !== '' && setSearch('');
              key !== '' && setKey('');
            }}
          >
            <TabList mb='1em'>
              <Tab>Danh sách thành viên</Tab>
              <Tab>Danh sách bạn bè</Tab>
              <Tab>Tất cả mọi người</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex
                  direction='column'
                  w='full'
                  h='xs'
                  overflowY='auto'
                  ref={containerMembersRef}
                  onScroll={() => {
                    handleScroll('USERS');
                  }}
                >
                  {members.data?.pages[0].data.content.length === 0 ? (
                    <Text py='2'>Không có dữ liệu</Text>
                  ) : (
                    members.data?.pages.map((page) =>
                      page.data.content.map(
                        (item: IUserFirstLoginRequest, index: number) =>
                          idsMember.includes(item.id) && (
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
                                <Avatar ml='6' size='sm' name={`${item.firstName} ${item.lastName}`} src={item.avatar} />
                                <Text ml='2' fontSize='sm'>
                                  {item.firstName + ' ' + item.lastName}
                                </Text>
                              </Flex>
                              <Flex mr='4'>
                                <DeleteIcon
                                  _hover={{ color: '#D0637C' }}
                                  cursor='pointer'
                                  onClick={() => {
                                    updateArrayMembers(item.id);
                                  }}
                                />
                              </Flex>
                            </Flex>
                          )
                      )
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
                            <Checkbox colorScheme='pink' isChecked={idsMember.includes(item.userId)} />
                            <Avatar ml='6' size='sm' name={item.fullName} src={item.avatar} />
                            <Text ml='2' fontSize='sm'>
                              {item.fullName}
                            </Text>
                          </Flex>
                          <Flex mr='4'>
                            {idsMember.includes(item.userId) ? (
                              <MinusIcon
                                _hover={{ color: '#D0637C' }}
                                cursor='pointer'
                                onClick={() => {
                                  updateArrayMembers(item.userId);
                                }}
                              />
                            ) : (
                              <AddIcon
                                _hover={{ color: '#D0637C' }}
                                cursor='pointer'
                                onClick={() => {
                                  updateArrayMembers(item.userId);
                                }}
                              />
                            )}
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
                            <Checkbox colorScheme='pink' isChecked={idsMember.includes(item.id)} />
                            <Avatar ml='6' size='sm' name={`${item.firstName} ${item.lastName}`} src={item.avatar} />
                            <Text ml='2' fontSize='sm'>
                              {item.firstName + ' ' + item.lastName}
                            </Text>
                          </Flex>
                          <Flex mr='4'>
                            {idsMember.includes(item.id) ? (
                              <MinusIcon
                                _hover={{ color: '#D0637C' }}
                                cursor='pointer'
                                onClick={() => {
                                  updateArrayMembers(item.id);
                                }}
                              />
                            ) : (
                              <AddIcon
                                _hover={{ color: '#D0637C' }}
                                cursor='pointer'
                                onClick={() => {
                                  updateArrayMembers(item.id);
                                }}
                              />
                            )}
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
          <Flex gap='6' align='center'>
            <Text>Số lượng thành viên: {idsMember.length}</Text>
            <Flex>
              <Button onClick={reset} background='gray.600' _hover={{ bg: 'black' }} mr={3}>
                Hủy
              </Button>
              <Button onClick={updateMembers}>Lưu</Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
