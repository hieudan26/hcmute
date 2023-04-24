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
} from '@chakra-ui/react';

export interface IModalDetailChooseBoxProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ModalDetailChooseBox(props: IModalDetailChooseBoxProps) {
  const { isOpen, onOpen, onClose } = props;

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Chỉnh sửa thông tin địa điểm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading as='h5' size='sm' color='#D0637C'>
            Thời gian tham quan
          </Heading>
          <Flex my='4' align='center' justify='space-between'>
            <Flex direction='column'>
              <Text fontSize='sm'>Thời gian đến</Text>
              <Flex gap='2'>
                <Input w='36' />
                <Input w='36' />
              </Flex>
            </Flex>

            <Flex direction='column'>
              <Text fontSize='sm'>Thời gian đến</Text>
              <Flex gap='2'>
                <Input w='36' />
                <Input w='36' />
              </Flex>
            </Flex>
          </Flex>

          <Heading mb='4' as='h5' size='sm' color='#D0637C'>
            Phương tiện di chuyển
          </Heading>

          <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Xe buýt</Checkbox>
            </GridItem>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Tàu hỏa</Checkbox>
            </GridItem>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Xe hơi</Checkbox>
            </GridItem>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Xe đạp</Checkbox>
            </GridItem>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Tàu thủy</Checkbox>
            </GridItem>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Máy bay</Checkbox>
            </GridItem>
            <GridItem w='100%'>
              <Checkbox defaultChecked>Đi bộ</Checkbox>
            </GridItem>
          </Grid>

          <Heading my='4' as='h5' size='sm' color='#D0637C'>
            Ghi chú
          </Heading>
          <Textarea placeholder='Here is a sample placeholder' size='sm' resize='none' />
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
