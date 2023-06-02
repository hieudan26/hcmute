import {
  Button,
  Box,
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
  Center,
  RadioGroup,
  Stack,
  Radio,
  Avatar,
  Spinner,
  FormControl,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  useDisclosure,
} from '@chakra-ui/react';
import { IRoomMember } from '../EditGroupChatDrawer/index.component';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { BsThreeDots } from 'react-icons/bs';
import { useRouter } from 'next/router';
import ModalAddMoreMembers from '../ModalAddMoreMembers/index.component';
import { useEffect, useState } from 'react';
import { useCUDChat } from '../../../../../hooks/queries/chat';

export interface IModalEditMembersProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  room: any;
  auth: IUserFirstLoginRequest | null;
}

export default function ModalInforMembers(props: IModalEditMembersProps) {
  const { isOpen, onOpen, onClose, title = '', room, auth } = props;
  const { isOpen: isOpenAddMembers, onOpen: onOpenAddMembers, onClose: onCloseAddMembers } = useDisclosure();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { mutationKickMember, mutationLeaveRoom } = useCUDChat();

  useEffect(() => {
    if (auth && room && room.owner.userId === auth.id) {
      setIsAdmin(true);
    }
  }, [auth, room]);

  const kickMem = async (userId: string) => {
    if (room) {
      await mutationKickMember.mutateAsync({ roomId: room.id, userId: userId });
    }
  };

  const leaveRoom = async () => {
    if (room) {
      await mutationLeaveRoom.mutateAsync(room.id);
      onClose();
      router.push('/chats');
    }
  };

  return (
    <>
      <ModalAddMoreMembers room={room} isOpen={isOpenAddMembers} onOpen={onOpenAddMembers} onClose={onCloseAddMembers} />
      <Modal
        blockScrollOnMount
        // scrollBehavior='inside'
        motionPreset='slideInRight'
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
      >
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb='4'>
            <Tabs isFitted colorScheme='pink'>
              <TabList>
                <Tab>Tất cả</Tab>
                <Tab>Quản trị viên</Tab>
              </TabList>

              <TabPanels maxH='xs' minH='xs' overflowY='auto'>
                <TabPanel>
                  {room &&
                    room.members.map((x: IRoomMember, index: number) => {
                      if (auth && !x.isAdmin) {
                        return (
                          <Box key={x.userId} my='2' mx='2'>
                            <Flex justify='space-between' my='2' align='center'>
                              <Flex gap='4' align='center'>
                                <Avatar size='sm' name={x.fullName} src={x.avatar} />
                                <Text>{x.fullName}</Text>
                              </Flex>
                              <Menu>
                                <MenuButton>
                                  <Icon cursor='pointer' as={BsThreeDots} />
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      router.push(`/profile/${x.userId}/about`);
                                    }}
                                  >
                                    Xem trang cá nhân
                                  </MenuItem>
                                  {auth.id === x.userId && <MenuItem onClick={leaveRoom}>Rời cuộc trò chuyện</MenuItem>}
                                  {isAdmin && auth.id !== x.userId && (
                                    <MenuItem
                                      onClick={() => {
                                        kickMem(x.userId);
                                      }}
                                    >
                                      Đuổi khỏi cuộc trò chuyện
                                    </MenuItem>
                                  )}
                                </MenuList>
                              </Menu>
                            </Flex>
                            <Divider />
                          </Box>
                        );
                      }
                    })}
                </TabPanel>
                <TabPanel>
                  {room && room.owner && (
                    <Box my='2' mx='2'>
                      <Flex justify='space-between' my='2' align='center'>
                        <Flex gap='4' align='center'>
                          <Avatar size='sm' name={room.owner.fullName} src={room.owner.avatar} />
                          <Text>{room.owner.fullName}</Text>
                        </Flex>
                        <Menu>
                          <MenuButton>
                            <Icon cursor='pointer' as={BsThreeDots} />
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                router.push(`/profile/${room.owner.userId}/about`);
                              }}
                            >
                              Xem trang cá nhân
                            </MenuItem>
                            {auth && auth.id === room.owner.userId && (
                              <MenuItem onClick={leaveRoom}>Rời cuộc trò chuyện</MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Flex>
                      <Divider />
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button w='full' onClick={onOpenAddMembers}>
              Thêm thành viên
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
