import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';

export interface IModalDeleteChooseBoxProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ModalDeleteChooseBox(props: IModalDeleteChooseBoxProps) {
  const { isOpen, onOpen, onClose } = props;

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Xóa địa điểm này ?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Button w='full' background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button w='full'>Lưu</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
