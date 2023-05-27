import { DeleteIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import CardPerson from './CardPerson/index.component';
import { useUsers } from '../../../../../hooks/queries/friend';
import { IUserFirstLoginRequest } from '../../../../../models/user/user.model';
import { toggleMessage } from '../../../Message/index.component';
import chatService from '../../../../../services/chat/chat.service';
import { formatTimePost } from '../../../../../utils';
import { useAppSelector } from '../../../../../hooks/redux';
import { useQueryClient } from '@tanstack/react-query';

export interface ICreateChatModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function CreateChatModal(props: ICreateChatModalProps) {
  const { isOpen, onOpen, onClose } = props;
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth.value);
  const boxRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<'SINGLE' | 'GROUP'>('GROUP');
  const [search, setSearch] = useState<string>('');
  const [name, setName] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<IUserFirstLoginRequest[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const users = useUsers(
    {
      paging: { pageNumber: 0, pageSize: 15 },
      searchFirstName: search === '' ? undefined : search,
      searchLastName: search === '' ? undefined : search,
    },
    true
  );

  useEffect(() => {
    if (name === undefined || name === '' || selected.length < 2) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, selected]);

  useEffect(() => {
    setSelected([]);
  }, [value]);

  useEffect(() => {
    const boxElement = boxRef.current;

    const handleScroll = () => {
      if (
        boxElement &&
        boxElement.scrollTop + boxElement.clientHeight - boxElement.scrollHeight >= 0 &&
        boxElement.scrollTop + boxElement.clientHeight - boxElement.scrollHeight <= 0.4 &&
        users.hasNextPage
      ) {
        users.fetchNextPage();
      }
    };

    if (boxElement) {
      boxElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (boxElement) {
        boxElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [users]);

  const add = (user: IUserFirstLoginRequest) => {
    if (selected.length >= 1 && value === 'SINGLE') {
      toggleMessage({
        type: 'warning',
        message: 'Chat đơn chỉ có tối đa 2 thành viên bao gồm cả bạn',
      });
      return;
    }
    const newSelected = [...selected];
    newSelected.push(user);
    setSelected(newSelected);
  };

  const remove = (user: IUserFirstLoginRequest) => {
    const newSelected = selected.filter((x) => x.id !== user.id);
    setSelected(newSelected);
  };

  const searching = (event: any) => {
    setSearch(event.target.value);
  };

  const changeName = (event: any) => {
    setName(event.target.value);
  };

  const createNewRoom = async () => {
    if (name && name !== '' && selected.length > 1 && auth) {
      const listId = selected.map((x) => {
        return x.id;
      });
      const response = await chatService.createRooms({
        friends: listId,
        time: formatTimePost(new Date()),
        ownerId: auth.id,
        type: value,
        name: name,
      });
      queryClient.invalidateQueries(['chats']);
      onClose();
    }
  };

  return (
    <Modal blockScrollOnMount motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='4xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Tạo phòng chat nhóm ngay thoaiii 😗</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb='4'>
          {value === 'GROUP' && (
            <FormControl isRequired isInvalid={name === ''}>
              <Input value={name} onChange={changeName} my='2' placeholder='Tên nhóm chat' />
            </FormControl>
          )}
          <Flex maxH='80' minH='80' w='full' gap='4' mb={value === 'SINGLE' ? '6' : undefined}>
            <Box w='full'>
              <Heading as='h5' size='sm' my={value === 'GROUP' ? undefined : '4'}>
                Thêm bạn bè chat tại đây:
              </Heading>
              <Input my='1.5' w='98%' placeholder='Tìm theo tên, họ lót' onChange={searching} />

              <Box ref={boxRef} maxH='16.8rem' minH='64' overflowY='auto' css={{ '&::-webkit-scrollbar': { width: '0' } }}>
                {users.data?.pages.map((page) =>
                  page.data.content.map(
                    (item: IUserFirstLoginRequest, index: number) =>
                      !selected.some((x) => x.id === item.id) &&
                      !item.disable && <CardPerson data={item} key={item.id} isAdd add={add} />
                  )
                )}
                {users.isFetching && (
                  <Center>
                    <Spinner />
                  </Center>
                )}
              </Box>
            </Box>
            <Box w='full'>
              <Heading as='h5' size='sm' my={value === 'GROUP' ? undefined : '4'}>
                Danh sách thành viên hiện tại
              </Heading>
              <Box maxH='80' minH='80' overflowY='auto' css={{ '&::-webkit-scrollbar': { width: '0' } }}>
                {selected.map((item, index) => (
                  <CardPerson key={`${item.id} - ${index}`} data={item} remove={remove} />
                ))}
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button disabled={isDisable} onClick={createNewRoom}>
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
