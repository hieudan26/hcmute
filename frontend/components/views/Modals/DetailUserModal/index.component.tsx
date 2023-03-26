import {
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Center,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  SimpleGrid,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { IUserFirstLoginRequest } from '../../../../models/user/user.model';
import ModalContainer from '../ModalContainer/index.component';

export interface IDetailUserModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUserFirstLoginRequest | undefined;
}

export default function DetailUserModal(props: IDetailUserModalProps) {
  const { isOpen, setIsOpen, user } = props;
  // const bg = useColorModeValue('white', 'gray.800');

  return (
    <ModalContainer isOpen={isOpen} size='xl'>
      <ModalHeader display='flex' flexDirection='column' alignItems='center'>
        Thông tin: {`${user?.firstName} ${user?.lastName}`}
      </ModalHeader>
      <ModalCloseButton
        onClick={() => {
          setIsOpen(false);
        }}
      />
      <ModalBody>
        {!user ? (
          <Center>
            <Spinner size='md' />
          </Center>
        ) : (
          <form>
            <VStack spacing={4} maxW='4xl' p={6} mx='auto'>
              <SimpleGrid columns={2} gap={4} w='full'>
                <FormControl id='firstname'>
                  <FormLabel>Tên</FormLabel>
                  <Input readOnly type='text' value={user.firstName} />
                </FormControl>
                <FormControl id='lastname'>
                  <FormLabel>Họ tên lót</FormLabel>
                  <Input readOnly type='text' value={user.lastName} />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} gap={4} w='full'>
                <FormControl id='gender'>
                  <FormLabel>Giới tính</FormLabel>
                  <Input readOnly type='text' value={user.gender} />
                </FormControl>
                <FormControl id='dob'>
                  <FormLabel>Ngày sinh</FormLabel>
                  <Input readOnly type='text' value={user.dob} />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={1} w='full'>
                <FormControl id='email'>
                  <FormLabel>Địa chỉ email</FormLabel>
                  <Input readOnly type='email' value={user.email} />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} w='full' gap={4}>
                <FormControl id='phone'>
                  <FormLabel>Số điện thoại</FormLabel>
                  <Input readOnly type='text' value={user.phoneNumber} />
                </FormControl>
                <FormControl id='country'>
                  <FormLabel>Quốc gia</FormLabel>
                  <Input readOnly type='text' value={user.country ? user.country : 'Không có'} />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={3} w='full' gap={1}>
                <FormControl id='city'>
                  <FormLabel>Thành phố</FormLabel>
                  <Input readOnly type='text' value={user.city ? user.city : 'Không có'} />
                </FormControl>
                <FormControl id='phone'>
                  <FormLabel>Quận</FormLabel>
                  <Input readOnly type='text' value={user.district ? user.district : 'Không có'} />
                </FormControl>
                <FormControl id='phone'>
                  <FormLabel>Xã - Thị trấn</FormLabel>
                  <Input readOnly type='text' value={user.village ? user.village : 'Không có'} />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </form>
        )}
      </ModalBody>
    </ModalContainer>
  );
}
