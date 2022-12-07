import { Box, Button, Divider, Flex, IconButton, Image, Input, ModalBody, ModalCloseButton, ModalHeader } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AiFillTags } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { IoLocation } from 'react-icons/io5';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import useUploadFile from '../../../../../../hooks/useUploadFile';
import { IPostRequestModel } from '../../../../../../models/post/post.model';
import { formatTimePost } from '../../../../../../utils';
import AutoResizeTextarea from '../../../../AutoResizeTextarea/index.component';
import ModalContainer from '../../../../Modals/ModalContainer/index.component';
import Select, { ActionMeta, MultiValue } from 'react-select';

export interface ICreateNewPostProps {
  type: 'experience' | 'faq';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: any) => Promise<void>;
  currentUserId: string;
}

const optionsWarna = [
  { value: 'biru', label: 'Biru' },
  { value: 'kuning', label: 'Kuning' },
  { value: 'hijau', label: 'Hijau' },
  { value: 'cokelat', label: 'Cokelat' },
  { value: 'merah', label: 'Merah' },
];

export default function CreateNewPost(props: ICreateNewPostProps) {
  const { type, isOpen, onClose, onSubmit, currentUserId } = props;
  const { uploadMultipleFiles, urlsRef } = useUploadFile();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [valuePost, setValuePost] = useState<string>('');
  const [isDisabledBtnPost, setIsDisabledBtnPost] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isOpenTags, setIsOpenTags] = useState<boolean>(false);

  useEffect(() => {
    if (valuePost.length > 0) {
      setIsDisabledBtnPost(false);
    } else {
      setIsDisabledBtnPost(true);
    }
  }, [valuePost]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClose = (isClear: boolean) => {
    if (!isClear) {
      setTags([]);
      setIsOpenTags(false);
      onClose();
    } else {
      setTags([]);
      setSelectedFiles([]);
      setFilesToUpload([]);
      setIsOpenTags(false);
      Array.from(selectedFiles).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    await uploadMultipleFiles(filesToUpload, 'post', currentUserId);
    console.log(urlsRef);
    const params: IPostRequestModel = {
      content: valuePost,
      images: urlsRef.current,
      time: formatTimePost(new Date()),
      type: type,
    };
    onSubmit(params);
    setValuePost('');
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

  const handleWarnaChange = async (
    selected: MultiValue<{
      value: string;
      label: string;
    }>,
    selectaction: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    const { action } = selectaction;
    if (action === 'clear') {
    } else if (action === 'select-option') {
    } else if (action === 'remove-value') {
      console.log('remove');
    }
    const arrValuesTag = selected.map((item) => {
      return item.value;
    });
    setTags(arrValuesTag);
  };

  return (
    <ModalContainer isOpen={isOpen} size='2xl' haveFooter={true}>
      <ModalHeader fontWeight={700} textAlign={'center'}>
        Creat new {type}
      </ModalHeader>
      <Divider />
      <ModalCloseButton
        onClick={() => {
          handleClose(false);
        }}
      />
      <ModalBody maxH='90vh'>
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

        {selectedFiles.length > 0 && (
          <Carousel infiniteLoop showArrows centerMode={selectedFiles.length > 1} showThumbs={false}>
            {selectedFiles.map((item, index) => (
              <Image width='100%' height='44' key={index} src={item} alt={item} />
            ))}
          </Carousel>
        )}

        {isOpenTags && (
          <Box mt='2'>
            <Select
              id='selectWarna'
              instanceId='selectWarna'
              isMulti
              name='colors'
              className='basic-multi-select'
              classNamePrefix='select'
              options={optionsWarna}
              onChange={handleWarnaChange}
              placeholder='Pilih Warna'
            />
          </Box>
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
            onClick={() => {
              setIsOpenTags(!isOpenTags);
            }}
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
            Post
          </Button>
        </Flex>
      </ModalBody>
    </ModalContainer>
  );
}
