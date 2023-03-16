import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import Section1 from '../Section1/index.component';
import Section2 from '../Section2/index.component';
import Section3 from '../Section3/index.component';
import { KeyboardEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import useUploadFile from '../../../../hooks/useUploadFile';
import areaService from '../../../../services/area/area.service';
import { ICountryResponse } from '../../../../models/area/country.model';
import { ISelectOption, Option, createOption } from '../../../../pages/admin/places-management/create';
import { ActionMeta, SingleValue } from 'react-select';
import placeService from '../../../../services/place/place.service';
import { ICategoryResponse, IPlaceRequest } from '../../../../models/place/place.model';
import { toggleMessage } from '../../Message/index.component';

export interface ICreateProps {}

export default function Create(props: ICreateProps) {
  const { upload, urlRef } = useUploadFile();
  const selectAreaRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkCountry, setCheckCountry] = useState<boolean>(true);
  const [dataArea, setDataArea] = useState<ISelectOption[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [dataCategory, setDataCategory] = useState<ISelectOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFileAvatar, setSelectedFileAvatar] = useState<File | undefined>(undefined);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
  const [valueName, setValueName] = useState<string>('');
  const [inputValueHashTag, setInputValueHashTag] = useState<string>('');
  const [valueHashTags, setValueHashTags] = useState<readonly Option[]>([]);
  const [valueDescription, setValueDescription] = useState<string>('');
  const [valueContent, setValueContent] = useState<string>('');

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

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFileAvatar(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileAvatar(event.target.files[0]);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setValueName(event.target.value);
  };

  const handleKeyDown: KeyboardEventHandler = (event: KeyboardEvent<Element>) => {
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

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement> | undefined) => {
    event && setValueDescription(event.target.value);
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
    const arrHashTags: string[] = [];
    valueHashTags.map((item) => {
      arrHashTags.push(item.value);
    });
    selectedFileAvatar && await upload(selectedFileAvatar, 'places', 'places');
    const params: IPlaceRequest = {
      area: Number(selectedArea),
      category: Number(selectedCategory),
      content: valueContent.trim(),
      description: valueDescription.trim(),
      hashTags: arrHashTags,
      image: urlRef.current,
      name: valueName.trim(),
    };
    // const response = await placeService.createPlace(params, setSubmitting);
    // queryClient.invalidateQueries();
    clear();
  };

  return (
    <Box>
      <Section1
        checkCountry={checkCountry}
        setCheckCountry={setCheckCountry}
        dataArea={dataArea}
        selectAreaRef={selectAreaRef}
        handleSelectAreaChange={handleSelectAreaChange}
        dataCategory={dataCategory}
        handleSelectCategoryChange={handleSelectCategoryChange}
      />
      <Divider my='8' />
      <Section2
        inputRef={inputRef}
        previewAvatar={previewAvatar}
        selectedFileAvatar={selectedFileAvatar}
        setSelectedFileAvatar={setSelectedFileAvatar}
        uploadImage={uploadImage}
        valueName={valueName}
        handleChangeName={handleChangeName}
        handleKeyDown={handleKeyDown}
        inputValueHashTag={inputValueHashTag}
        setInputValueHashTag={setInputValueHashTag}
        setValueHashTags={setValueHashTags}
        valueHashTags={valueHashTags}
      />
      <Divider my='8' />
      <Section3
        valueDescription={valueDescription}
        handleDescriptionChange={handleDescriptionChange}
        valueContent={valueContent}
        setValueContent={setValueContent}
      />
      <Divider my='8' />
      <Flex w='full' justify='center' align='center' direction='column' gap='3'>
        {isDisableSubmit && (
          <Text fontStyle='italic' fontSize='smaller' color='red.500'>
            * Vui lòng điền vào chỗ trống
          </Text>
        )}
        <Flex w='full' gap='6' justify='center' align='center'>
          <Button w='20%' bg='gray.600' disabled={isDisableSubmit} _hover={{ bg: 'black' }} onClick={clear}>
            Xóa tất cả
          </Button>
          <Button w='20%' disabled={isDisableSubmit} isLoading={submitting}>
            Đóng góp
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
