import { Modal, ModalContent, ModalOverlay, ResponsiveValue, useColorModeValue, useDisclosure } from '@chakra-ui/react';

export interface IModalContainerProps {
  children: any;
  isOpen: boolean;
  size:
    | ResponsiveValue<'sm' | (string & {}) | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' | '6xl'>
    | undefined;
}

export default function ModalContainer(props: IModalContainerProps) {
  const { children, isOpen, size } = props;
  const { onClose } = useDisclosure();
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent bg={bgModalContent} pb='4' width={{ base: 'sm', md: 'xl' }}>
        {children}
      </ModalContent>
    </Modal>
  );
}
