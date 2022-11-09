import {
  Divider,
  Flex,
  IconButton,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
  Image,
  Center,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import AutoResizeTextarea from '../../../../AutoResizeTextarea/index.component';
import ModalContainer from '../../../../Modals/ModalContainer/index.component';
import { AiFillTags } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { IoLocation } from 'react-icons/io5';
import { Carousel } from 'react-responsive-carousel';
import { IPostRequestModel, IPostResponseModel } from '../../../../../../models/post/post.model';
import useUploadFile from '../../../../../../hooks/useUploadFile';
import { formatTimePost } from '../../../../../../utils';

export interface IUpdatePostProps {
  type: 'experience' | 'faq';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: any) => Promise<void>;
  post: IPostResponseModel;
  currentUserId: string;
}

export default function UpdatePost(props: IUpdatePostProps) {
  const { type, isOpen, onClose, onSubmit, post, currentUserId } = props;
  const { uploadMultipleFiles, urlsRef } = useUploadFile();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [valuePost, setValuePost] = useState<string>(post.content);
  const [isDisabledBtnPost, setIsDisabledBtnPost] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (valuePost.length > 0 && valuePost !== post.content.trim()) {
      setIsDisabledBtnPost(false);
    } else {
      setIsDisabledBtnPost(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuePost]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClose = (isClear: boolean) => {
    if (!isClear) {
      onClose();
    } else {
      setSelectedFiles([]);
      setFilesToUpload([]);
      Array.from(selectedFiles).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    await uploadMultipleFiles(filesToUpload, 'post', currentUserId);
    const params: IPostRequestModel = {
      content: valuePost,
      images: [...urlsRef.current, ...post.images],
      type: type,
    };
    onSubmit(params);
    handleClose(true);
    setIsSubmitting(false);
    handleClose(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e?.target.files) {
      setFilesToUpload(Array.from(e.target.files).map((file) => file));
      const filesArray = Array.from(e?.target.files).map((file) => URL.createObjectURL(file));

      setSelectedFiles((prevImages) => prevImages.concat(filesArray));
    }
  };

  const changeValueTextarea = (e: ChangeEvent<HTMLTextAreaElement> | undefined) => {
    if (e) {
      setValuePost(e.target.value);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} size='2xl' haveFooter={true}>
      <ModalHeader fontWeight={700} textAlign={'center'}>
        Update {post.fullName}&apos;s {type}
      </ModalHeader>
      <Divider />
      <ModalCloseButton
        onClick={() => {
          handleClose(false);
        }}
      />
      <ModalBody>
        <AutoResizeTextarea
          maxH='80'
          border='1px'
          _focus={{ outline: '1px' }}
          minH='20vh'
          placeholder="what's on your mind ?"
          mb='2'
          value={valuePost}
          onChange={changeValueTextarea}
        />

        {post.images.length > 0 && (
          <Carousel infiniteLoop showArrows centerMode={post.images.length > 1} showThumbs={false}>
            {post.images.map((item, index) => (
              <Image width='100%' height='44' key={index} src={item} alt={item} />
            ))}
          </Carousel>
        )}
        <Center mt='5' hidden={selectedFiles.length <= 0}>
          New images -- Update to reset all images
        </Center>
        {selectedFiles.length > 0 && (
          <Carousel infiniteLoop showArrows centerMode={selectedFiles.length > 1} showThumbs={false}>
            {selectedFiles.map((item, index) => (
              <Image width='100%' height='44' key={index} src={item} alt={item} />
            ))}
          </Carousel>
        )}
        <Flex align='flex-start' w='full' gap='5' mt='2' mb='2'>
          <Input multiple type='file' display='none' ref={inputRef} onChange={handleFileChange} />
          <IconButton
            onClick={handleClick}
            w='full'
            bg='gray.200'
            _hover={{ bg: 'gray.500' }}
            color='gray.400'
            fontSize='xl'
            aria-label='Search database'
            icon={<BiImageAdd />}
          />
          <IconButton
            w='full'
            bg='gray.200'
            _hover={{ bg: 'gray.500' }}
            color='gray.400'
            fontSize='xl'
            aria-label='Search database'
            icon={<AiFillTags />}
          />
          <IconButton
            w='full'
            bg='gray.200'
            _hover={{ bg: 'gray.500' }}
            color='gray.400'
            fontSize='xl'
            aria-label='Search database'
            icon={<IoLocation />}
          />
        </Flex>
        <Flex gap='5'>
          <Button
            background='gray.600'
            _hover={{ bg: 'black' }}
            w={'100%'}
            disabled={selectedFiles.length <= 0}
            onClick={() => {
              handleClose(true);
            }}
          >
            Clear Images
          </Button>
          <Button w={'100%'} isLoading={isSubmitting} disabled={isDisabledBtnPost} onClick={submit}>
            Save changes
          </Button>
        </Flex>
      </ModalBody>
    </ModalContainer>
  );
}
