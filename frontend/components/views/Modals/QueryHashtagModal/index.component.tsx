import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { removeHashtag } from '../../../../utils';

export interface IQueryHashtagModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export default function QueryHashtagModal(props: IQueryHashtagModalProps) {
  const { isOpen, onClose, query } = props;
  const bgModalContent = useColorModeValue('white', 'header.primary_darkMode');
  const router = useRouter();
  const [value, setValue] = useState<string>('experience');

  const changeRadioButton = (val: string) => {
    setValue(val);
  };

  const filter = () => {
    const handleQuery = removeHashtag(query);
    if (value === 'experience') {
      router.push(`/experiences/${handleQuery}`);
    } else {
      router.push(`/faq/${handleQuery}`);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={true}
      motionPreset='slideInRight'
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
      scrollBehavior='inside'
    >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent bg={bgModalContent}>
        <ModalCloseButton />
        <ModalBody mt='4'>
          <Text fontSize='xl'>Filter post with hashtag. Choose type:</Text>
          <RadioGroup mt='4' colorScheme='pink' onChange={changeRadioButton} value={value}>
            <Stack direction='column'>
              <Radio value='experience'>Experience</Radio>
              <Radio value='faq'>Faq</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button onClick={filter}>Filter</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
