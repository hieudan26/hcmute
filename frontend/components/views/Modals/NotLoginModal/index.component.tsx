import { ModalBody, ModalHeader } from '@chakra-ui/react';
import ModalContainer from '../ModalContainer/index.component';

export interface INotLoginModalProps {}

export default function NotLoginModal(props: INotLoginModalProps) {
  return (
    <ModalContainer isOpen={false} size='xl'>
      <ModalHeader display='flex' flexDirection='column' alignItems='center'>
        You must login !!!
      </ModalHeader>
      <ModalBody>NotLoginModal</ModalBody>
    </ModalContainer>
  );
}
