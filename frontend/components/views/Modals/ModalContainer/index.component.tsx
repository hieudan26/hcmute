import {
  Modal,
  ModalContent,
  ModalOverlay,
  ResponsiveValue,
  useColorModeValue,
  useDisclosure,
  ModalProps,
} from '@chakra-ui/react';

export interface IModalContainerProps {
  children: any;
  isOpen: boolean;
  size:
    | ResponsiveValue<'sm' | (string & {}) | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'xs' | '3xl' | '4xl' | '5xl' | '6xl'>
    | undefined;
  haveFooter?: boolean;
  scrollBehavior?: 'inside' | 'outside';
}

export default function ModalContainer(props: IModalContainerProps) {
  const { children, isOpen, size, haveFooter, scrollBehavior } = props;
  const { onClose } = useDisclosure();
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');

  return (
    <Modal
      motionPreset='slideInRight'
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior={scrollBehavior ? scrollBehavior : 'inside'}
    >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent
        bg={bgModalContent}
        pb={!haveFooter ? '4' : '0'}
        // width={{ base: 'sm', md: 'xl' }}
      >
        {children}
      </ModalContent>
    </Modal>
  );
}
