import {
  Button,
  Box,
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
  Center,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

export interface IModalCoverItineraryProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ModalCoverItinerary(props: IModalCoverItineraryProps) {
  const { isOpen, onOpen, onClose } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (file) {
      setUrl(URL.createObjectURL(file));
    }
  }, [file]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const remove = () => {
    setFile(null);
    URL.revokeObjectURL(url);
    setUrl('');
  };

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Thêm cover cho hành trình</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Box
              h={200}
              w='full'
              borderStyle='dashed'
              borderWidth={2}
              borderColor='gray.300'
              rounded='md'
              overflow='hidden'
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
            >
              {file ? (
                <Box as='img' src={url} h='full' w='full' />
              ) : (
                <Text textAlign='center' lineHeight='200px'>
                  Kéo và thả hoặc nhấp để tải ảnh lên
                </Text>
              )}
              <input type='file' accept='image/*' ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            </Box>
          </Center>
        </ModalBody>

        <ModalFooter>
          <Button disabled={!file} background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={remove}>
            Hủy
          </Button>
          <Button disabled={file !== null}>Lưu</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
