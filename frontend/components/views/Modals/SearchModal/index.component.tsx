/* eslint-disable react/no-children-prop */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Code,
  Icon,
} from '@chakra-ui/react';
import { IoSearch } from 'react-icons/io5';

export interface ISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal(props: ISearchModalProps) {
  const { isOpen, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset='scale' size='xl'>
      <ModalOverlay />
      <ModalContent py='4' px='2'>
        <ModalBody>
          <InputGroup>
            <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em' children={<Icon as={IoSearch} />} />
            <Input focusBorderColor='#D0637C' placeholder='Tìm kiếm hành trình, trải nghiệm, ...' />
            <InputRightElement
              children={
                <Code rounded='md' colorScheme='pink'>
                  Esc
                </Code>
              }
            />
          </InputGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
