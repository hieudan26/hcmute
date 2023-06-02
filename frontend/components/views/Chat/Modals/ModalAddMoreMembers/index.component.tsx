import { SearchIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  chakra,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useUsers } from '../../../../../hooks/queries/friend';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { IRoomMember } from '../EditGroupChatDrawer/index.component';
import CardMember from './CardMember/index.component';
import { useCUDChat } from '../../../../../hooks/queries/chat';

export interface IModalAddMoreMembersProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  room: any;
}

export default function ModalAddMoreMembers(props: IModalAddMoreMembersProps) {
  const { isOpen, onOpen, onClose, room } = props;
  const [search, setSearch] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [listIds, setListIds] = useState<string[]>([]);
  const [listView, setListView] = useState<IUserFirstLoginRequest[]>([]);
  const { mutationUpdateChat } = useCUDChat();
  const users = useUsers(
    {
      paging: { pageNumber: 0, pageSize: 200 },
      searchFirstName: key === '' ? undefined : key,
      searchLastName: key === '' ? undefined : key,
    },
    isOpen
  );

  const changeSearch = (event: any) => {
    event && setSearch(event.target.value);
  };

  const add = (item: IUserFirstLoginRequest) => {
    const temp = [...listIds, item.id];
    const tempView = [...listView, item];
    setListIds(temp);
    setListView(tempView);
  };

  const remove = (item: IUserFirstLoginRequest) => {
    const temp = listIds.filter((x) => x !== item.id);
    const tempView = listView.filter((x) => x.id !== item.id);
    setListIds(temp);
    setListView(tempView);
  };

  const save = async () => {
    if (room) {
      const mems = room.members.map((x: IRoomMember) => {
        return x.userId;
      });
      let params = { ...room, friends: [...mems, ...listIds], roomId: room.id };
      await mutationUpdateChat.mutateAsync(params);
    }
  };

  return (
    <Modal blockScrollOnMount motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Thêm thành viên</ModalHeader>
        <ModalBody mb='4'>
          {listView.length > 0 && (
            <Flex mx='4' minH='12' direction='row' gap='6' overflowX='auto'>
              {listView.map((item, index) => (
                <Avatar title={item.fullName} key={item.id} src={item.avatar} name={item.firstName} size='sm'>
                  <AvatarBadge
                    cursor='pointer'
                    bg='pink.500'
                    boxSize='1.4em'
                    onClick={() => {
                      remove(item);
                    }}
                  >
                    X
                  </AvatarBadge>
                </Avatar>
              ))}
            </Flex>
          )}

          <Flex align='center' gap='2' mb='4'>
            <Input value={search} onChange={changeSearch} placeholder='Tìm kiếm theo tên, họ lót' />
            <IconButton
              onClick={() => {
                setKey(search);
              }}
              aria-label='Search database'
              icon={<SearchIcon />}
            />
          </Flex>

          <Box maxH='xs' minH='xs' overflowY='auto' mx='2'>
            {users.data?.pages.map((page) =>
              page.data.content.map(
                (item: IUserFirstLoginRequest, index: number) =>
                  room &&
                  !room.members.some((mem: IRoomMember) => mem.userId === item.id) &&
                  !item.disable && <CardMember add={add} remove={remove} listIds={listIds} key={item.id} item={item} />
              )
            )}
          </Box>
          <Center mt='10' hidden={!users.hasNextPage}>
            <Button
              bg='transparent'
              variant='link'
              onClick={() => {
                users.fetchNextPage();
              }}
            >
              Tải thêm
            </Button>
          </Center>
        </ModalBody>

        <ModalFooter>
          <Flex gap='4' w='full'>
            <Button
              w='full'
              background='gray.600'
              _hover={{ bg: 'black' }}
              onClick={() => {
                setListView([]);
                setListIds([]);
                onClose();
              }}
            >
              Hủy
            </Button>
            <Button w='full' onClick={save}>
              Lưu
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
