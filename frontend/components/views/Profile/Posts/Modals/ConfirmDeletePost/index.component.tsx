import {
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Divider,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useColorModeValue,
  Modal,
} from '@chakra-ui/react';

export interface IConfirmDeletePostProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ConfirmDeletePost(props: IConfirmDeletePostProps) {
  const { isOpen, title, content, onClose, onSubmit } = props;
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent bg={bgModalContent} pb='0' width='2xl'>
        <ModalHeader fontWeight={700} textAlign={'center'}>
          {title}
        </ModalHeader>
        <Divider />
        <ModalCloseButton onClick={onClose} />
        <ModalBody>{content}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr='3' background='gray.600' _hover={{ bg: 'black' }}>
            Cancel
          </Button>
          <Button onClick={onSubmit} colorScheme='blue' mr={3}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
