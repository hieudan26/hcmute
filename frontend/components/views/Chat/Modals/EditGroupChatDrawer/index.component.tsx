import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Center,
  Avatar,
  Heading,
  Box,
  Text,
  Link,
  Flex,
  Icon,
  Input,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAppSelector } from '../../../../../hooks/redux';
import { GoArrowSmallRight } from 'react-icons/go';
import { AiOutlineWarning } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { CloseIcon } from '@chakra-ui/icons';
import { RiAlarmWarningLine } from 'react-icons/ri';
import { useCUDChat } from '../../../../../hooks/queries/chat';
import ModalInforMembers from '../ModalInforMembers/index.component';
import { useRouter } from 'next/router';

export interface IEditGroupChatDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  room: any;
}

export interface IRoomMember {
  avatar: string;
  fullName: string;
  userId: string;
  isAdmin: boolean;
}

export default function EditGroupChatDrawer(props: IEditGroupChatDrawerProps) {
  const { isOpen, onOpen, onClose, room } = props;
  const router = useRouter();
  const { isOpen: isOpenInforMembers, onOpen: onOpenInforMembers, onClose: onCloseInforMembers } = useDisclosure();
  const auth = useAppSelector((state) => state.auth.value);
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [valueName, setValueName] = useState<string>('');
  const { mutationUpdateChat, mutationLeaveRoom, mutationDeleteRoom } = useCUDChat();

  useEffect(() => {
    if (room) {
      setValueName(room.name);
    }
  }, [room]);

  const changeValueName = (event: any) => {
    event && setValueName(event.target.value);
  };

  const saveName = async () => {
    if (room) {
      let params = { ...room, name: valueName, roomId: room.id };
      await mutationUpdateChat.mutateAsync(params);
      setIsEditName(false);
    }
  };

  const leaveRoom = async () => {
    if (room) {
      await mutationLeaveRoom.mutateAsync(room.id);
      router.push('/chats');
    }
  };

  const deleteRoom = async () => {
    if (room) {
      await mutationDeleteRoom.mutateAsync(room.id);
      router.push('/chats');
    }
  };

  return (
    <>
      <ModalInforMembers
        auth={auth}
        room={room}
        title={`${room && room.members.length} thành viên`}
        isOpen={isOpenInforMembers}
        onOpen={onOpenInforMembers}
        onClose={onCloseInforMembers}
      />
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='sm'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Thông tin nhóm chat</DrawerHeader>

          <DrawerBody>
            <Flex direction='column' h='full' justify='space-between'>
              <Box>
                <Center>
                  <Avatar size='2xl' name={room && room.name} src={room && room.name} />
                </Center>
                <Center my='6'>
                  {!isEditName ? (
                    <Heading
                      noOfLines={1}
                      cursor='pointer'
                      onDoubleClick={() => {
                        setIsEditName(true);
                      }}
                    >
                      {valueName}
                    </Heading>
                  ) : (
                    <Flex w='full' gap='4' align='center'>
                      <Input value={valueName} onChange={changeValueName} placeholder='Basic usage' />
                      <Flex gap='2'>
                        <IconButton onClick={saveName} aria-label='Search database' icon={<BsCheckLg />} />
                        <IconButton
                          onClick={() => {
                            room && setValueName(room.name);
                            setIsEditName(false);
                          }}
                          aria-label='Search database'
                          icon={<CloseIcon />}
                        />
                      </Flex>
                    </Flex>
                  )}
                </Center>
                <Text fontWeight='bold'>Phòng chat có: {room && room.members.length} thành viên</Text>
                {room && room.members.length > 1 && <Text my='2'>Danh sách một vài thành viên: </Text>}
                <Flex direction='column'>
                  {room &&
                    room.members.slice(0, 4).map((x: IRoomMember, index: number) => {
                      if (auth && auth.id !== x.userId) {
                        return (
                          <Link key={x.userId} as={NextLink} href={`/profile/${x.userId}/about`}>
                            <Text my='1' cursor='pointer'>
                              - {x.fullName}
                            </Text>
                          </Link>
                        );
                      }
                    })}
                </Flex>
                {room && room.members.length > 3 && <Text>...</Text>}
                <Flex align='center' fontSize='sm' my='2'>
                  <Icon as={GoArrowSmallRight} fontSize='xl' />
                  <Text onClick={onOpenInforMembers} fontStyle='italic' _hover={{ color: '#D0637C' }} cursor='pointer'>
                    Chi tiết thành viên
                  </Text>
                </Flex>
              </Box>
              <Box>
                {room && auth && room.owner.userId === auth.id && (
                  <Flex align='center' fontWeight='bold' gap='2' color='red.500' my='2'>
                    <Icon as={RiAlarmWarningLine} />
                    <Text cursor='pointer' onClick={deleteRoom}>
                      Xóa phòng trò chuyện
                    </Text>
                  </Flex>
                )}
                <Flex align='center' fontWeight='bold' gap='2' color='red.500'>
                  <Icon as={AiOutlineWarning} />
                  <Text cursor='pointer' onClick={leaveRoom}>
                    Rời cuộc trò chuyện
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
