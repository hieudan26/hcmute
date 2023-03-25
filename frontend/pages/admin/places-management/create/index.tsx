import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { TiCancel } from 'react-icons/ti';
import 'react-quill/dist/quill.snow.css';
import Select, { ActionMeta, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toggleMessage } from '../../../../components/views/Message/index.component';
import useUploadFile from '../../../../hooks/useUploadFile';
import { ICountryResponse } from '../../../../models/area/country.model';
import { ICategoryResponse, IPlaceRequest } from '../../../../models/place/place.model';
import areaService from '../../../../services/area/area.service';
import placeService from '../../../../services/place/place.service';
import { noImage, formatsQuill, modulesQuill } from '../../../../utils';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading ...</p> });

export interface IAdminPlacesManagementCreatePageProps {}

export const components = {
  DropdownIndicator: null,
};

export interface Option {
  readonly label: string;
  readonly value: string;
}

export const createOption = (label: string) => ({
  label,
  value: label,
});

export interface ISelectOption {
  value: string;
  label: string;
}

export const styleSelect: any = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#dfe4ea' }),
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => ({
    ...styles,
    backgroundColor: isDisabled ? undefined : isSelected ? 'black' : isFocused ? 'black' : undefined,
  }),
  menu: (base: any) => ({
    ...base,
    background: '#2f3542',
  }),
  multiValueLabel: (styles: any, { data }: any) => ({
    ...styles,
    background: '#dfe4ea',
  }),
};

const AdminPlacesManagementCreatePage: NextPage = (props: IAdminPlacesManagementCreatePageProps) => {
  const { colorMode } = useColorMode();
  const boxBg = useColorModeValue('backgroundBox.primary_lightMode', 'backgroundBox.primary_darkMode');
  const { upload, urlRef } = useUploadFile();
  const selectAreaRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [checkCountry, setCheckCountry] = useState<boolean>(true);
  const [valueContent, setValueContent] = useState<string>('');
  const [inputValueHashTag, setInputValueHashTag] = useState<string>('');
  const [valueHashTags, setValueHashTags] = useState<readonly Option[]>([]);
  const [valueArea, setValueArea] = useState<string>('');
  const [dataArea, setDataArea] = useState<ISelectOption[]>([]);
  const [dataCategory, setDataCategory] = useState<ISelectOption[]>([]);
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [valueDescription, setValueDescription] = useState<string>('');
  const [valueName, setValueName] = useState<string>('');
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      selectedArea.trim() === '' ||
      selectedCategory.trim() === '' ||
      !selectedFileAvatar ||
      valueName.trim() === '' ||
      valueHashTags.length < 0 ||
      valueDescription.trim() === '' ||
      valueContent.trim() === '' ||
      valueContent.trim() === '<p><br></p>'
    ) {
      setIsDisableSubmit(true);
    } else {
      setIsDisableSubmit(false);
    }
  }, [selectedArea, selectedCategory, selectedFileAvatar, valueContent, valueDescription, valueHashTags.length, valueName]);

  useEffect(() => {
    const fetchDataCategories = async () => {
      const response = await placeService.getCategories(undefined);
      const tempArr: {
        value: string;
        label: string;
      }[] = [];
      response.data.content.map((item: ICategoryResponse) => {
        tempArr.push({ value: item.id.toString(), label: item.name });
      });
      setDataCategory(tempArr);
    };
    fetchDataCategories();
  }, []);

  useEffect(() => {
    if (checkCountry) {
      const fetchCountry = async () => {
        selectAreaRef.current.setValue(null);
        const response = await areaService.getCountriesPagination(undefined);
        const tempArr: {
          value: string;
          label: string;
        }[] = [];
        response.data.content.map((item: ICountryResponse) => {
          tempArr.push({ value: item.id.toString(), label: item.name });
        });
        setDataArea(tempArr);
      };
      fetchCountry();
    } else {
      const fetchProvince = async () => {
        selectAreaRef.current.setValue(null);
        const response = await areaService.getProvinces(undefined);
        const tempArr: {
          value: string;
          label: string;
        }[] = [];
        response.data.content.map((item: ICountryResponse) => {
          tempArr.push({ value: item.id.toString(), label: item.name });
        });
        setDataArea(tempArr);
      };
      fetchProvince();
    }
  }, [checkCountry]);

  useEffect(() => {
    if (!selectedFileAvatar) {
      setPreviewAvatar(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileAvatar);
    setPreviewAvatar(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileAvatar]);

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFileAvatar(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileAvatar(event.target.files[0]);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValueHashTag) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const value = `#${inputValueHashTag}`;
        setValueHashTags((prev) => [...prev, createOption(value)]);
        setInputValueHashTag('');
        event.preventDefault();
    }
  };

  const handleSelectAreaChange = (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    newValue && setSelectedArea(newValue.value);
  };

  const handleSelectCategoryChange = (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    newValue && setSelectedCategory(newValue.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement> | undefined) => {
    event && setValueDescription(event.target.value);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setValueName(event.target.value);
  };

  const clear = () => {
    setSelectedArea('');
    setSelectedCategory('');
    setSelectedFileAvatar(undefined);
    setValueName('');
    setValueHashTags([]);
    setValueDescription('');
    setValueContent('');
  };

  const onSubmit = async () => {
    if (
      selectedArea.trim() === '' ||
      selectedCategory.trim() === '' ||
      !selectedFileAvatar ||
      valueName.trim() === '' ||
      valueHashTags.length < 0 ||
      valueDescription.trim() === '' ||
      valueContent.trim() === '' ||
      valueContent.trim() === '<p><br></p>'
    ) {
      toggleMessage({
        message: 'Please fill in the blanks',
        type: 'warning',
      });
    } else {
      const arrHashTags: string[] = [];
      valueHashTags.map((item) => {
        arrHashTags.push(item.value);
      });
      await upload(selectedFileAvatar, 'places', 'places');
      const params: IPlaceRequest = {
        area: Number(selectedArea),
        category: Number(selectedCategory),
        content: valueContent.trim(),
        description: valueDescription.trim(),
        hashTags: arrHashTags,
        image: urlRef.current,
        name: valueName.trim(),
      };
      const response = await placeService.createPlace(params, setSubmitting);
      queryClient.invalidateQueries();
      clear();
    }
  };

  return (
    <Box mb='10' w='full' bg={boxBg} shadow='md' rounded='md' p='8'>
      {/* columns={[2, null, 3]} */}
      <SimpleGrid columns={3} spacing='40px'>
        <Flex direction='column'>
          <Text fontSize='sm' mb='2'>
            Nếu bạn muốn tạo một quốc gia hoặc tỉnh - thành phố, thì hãy tích vào đây. Nếu bạn muốn tạo một địa điểm du lịch, bạn
            không cần phải chọn box này
          </Text>
          <Checkbox
            size='md'
            colorScheme='pink'
            isChecked={checkCountry}
            onChange={() => {
              setCheckCountry(!checkCountry);
            }}
          >
            {checkCountry ? 'Quốc gia' : 'Tỉnh - Thành phố'}
          </Checkbox>
        </Flex>
        <Flex direction='column' justify='flex-start' w='full'>
          <Text fontSize='sm' mb='2'>
            Lựa chọn khu vực: {checkCountry ? 'Quốc gia' : 'Tỉnh - Thành phố'}
          </Text>
          <Box w='full'>
            <Select
              styles={colorMode === 'dark' ? styleSelect : undefined}
              onChange={handleSelectAreaChange}
              ref={selectAreaRef}
              id='selectArea'
              instanceId='selectArea'
              name='colors'
              className='basic-multi-select'
              classNamePrefix='select'
              options={dataArea}
              placeholder={checkCountry ? 'Việt Nam' : 'An Giang'}
            />
          </Box>
        </Flex>
        <Flex direction='column'>
          <Text fontSize='sm' mb='2'>
            Chọn loại địa điểm
          </Text>
          <Box w='full'>
            <Select
              styles={colorMode === 'dark' ? styleSelect : undefined}
              onChange={handleSelectCategoryChange}
              id='selectCategory'
              instanceId='selectCategory'
              name='colors'
              className='basic-multi-select'
              classNamePrefix='select'
              options={dataCategory}
              placeholder='country'
            />
          </Box>
        </Flex>
      </SimpleGrid>
      <Divider my='8' />
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
              disabled={selectedFileAvatar === undefined}
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
              disabled={selectedFileAvatar !== undefined}
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
            <FormHelperText>Nhận dạng của khu vực địa điểm tương ứng</FormHelperText>
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
      <Divider my='8' />
      <FormControl>
        <FormLabel fontSize='sm'>Mô tả: </FormLabel>
        <Textarea value={valueDescription} onChange={handleDescriptionChange} placeholder='Mô tả về địa điểm' size='sm' />
        <FormHelperText fontSize='xs'>Nhận dạng của khu vực địa điểm tương ứng</FormHelperText>
      </FormControl>
      <Divider my='8' />
      <Text fontSize='sm' ml='2' mb='4'>
        Nội dung:
      </Text>
      <ReactQuill value={valueContent} onChange={setValueContent} modules={modulesQuill} formats={formatsQuill} theme='snow' />
      <Divider my='8' />
      <Flex w='full' justify='center' align='center' direction='column' gap='3'>
        {isDisableSubmit && (
          <Text fontStyle='italic' fontSize='smaller' color='red.500'>
            * Vui lòng điền vào chỗ trống
          </Text>
        )}
        <Flex w='full' gap='6' justify='center' align='center'>
          <Button w='20%' disabled={isDisableSubmit} bg='gray.600' _hover={{ bg: 'black' }} onClick={clear}>
            Xóa tất cả
          </Button>
          <Button w='20%' disabled={isDisableSubmit} isLoading={submitting} onClick={onSubmit}>
            Đóng góp
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminPlacesManagementCreatePage;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
