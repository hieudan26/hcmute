import { Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';

export default function ModalContainer({ children, isOpen }: any) {
  const { onClose } = useDisclosure();

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size='md'>
        <ModalOverlay />
        <ModalContent width={{ base: 'sm', md: 'xl' }}>{children}</ModalContent>
      </Modal>
    </>
  );
}
