import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { noImage } from '../../../../utils';
import { TiCancel } from 'react-icons/ti';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { Option, components } from '../../../../pages/admin/places-management/create';
import CreatableSelect from 'react-select/creatable';
import { Dispatch, KeyboardEventHandler, MutableRefObject, SetStateAction } from 'react';

export interface ISection2Props {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  uploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFileAvatar: File | undefined;
  previewAvatar: string | undefined;
  setSelectedFileAvatar: (value: SetStateAction<File | undefined>) => void;
  valueName: string;
  handleChangeName: (event: React.ChangeEvent<HTMLInputElement> | undefined) => void;
  inputValueHashTag: string;
  setValueHashTags: Dispatch<SetStateAction<readonly Option[]>>;
  setInputValueHashTag: (value: SetStateAction<string>) => void;
  handleKeyDown: KeyboardEventHandler;
  valueHashTags: readonly Option[];
}

export default function Section2(props: ISection2Props) {
  const {
    inputRef,
    uploadImage,
    selectedFileAvatar,
    previewAvatar,
    setSelectedFileAvatar,
    valueName,
    handleChangeName,
    inputValueHashTag,
    setValueHashTags,
    setInputValueHashTag,
    handleKeyDown,
    valueHashTags,
  } = props;

  return (
    <SimpleGrid columns={3} spacing='40px'>
      <Flex direction='row' gap='2' justify='center' align='center'>
        <input onChange={uploadImage} type='file' accept='image/*' ref={inputRef} style={{ display: 'none' }} />
        <Image
          boxSize='140px'
          objectFit='cover'
          src={selectedFileAvatar ? previewAvatar : noImage}
          fallbackSrc='https://via.placeholder.com/150'
          alt='Image Category'
          rounded='md'
          shadow='md'
        />
        <Flex direction='column' gap='2'>
          <IconButton
            title='Cancel'
            aria-label='Cancel'
            onClick={() => {
              setSelectedFileAvatar(undefined);
            }}
            background='gray.600'
            _hover={{ bg: 'black' }}
            icon={<TiCancel />}
          />
          <IconButton
            title='Upload'
            onClick={() => {
              inputRef.current?.click();
            }}
            aria-label='Upload'
            icon={<AiOutlineCloudUpload />}
          />
        </Flex>
      </Flex>
      <Flex direction='column' justify='flex-start'>
        <FormControl isRequired>
          <FormLabel fontSize='sm'>Tên địa danh</FormLabel>
          <Input type='text' value={valueName} onChange={handleChangeName} />
          <FormHelperText>Số nhận dạng của khu vực địa điểm tương ứng</FormHelperText>
        </FormControl>
      </Flex>
      <Flex direction='column'>
        <Text fontSize='sm' mb='2'>
          Tạo hashtag cho địa điểm này
        </Text>
        <Box w='full'>
          <CreatableSelect
            components={components}
            inputValue={inputValueHashTag}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(newValue) => setValueHashTags(newValue)}
            onInputChange={(newValue) => setInputValueHashTag(newValue)}
            onKeyDown={handleKeyDown}
            placeholder='Nhập nội dung và nhấn enter...'
            value={valueHashTags}
          />
        </Box>
      </Flex>
    </SimpleGrid>
  );
}
