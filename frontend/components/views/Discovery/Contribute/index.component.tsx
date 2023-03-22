import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import { KeyboardEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { ISelectOption, Option, createOption } from '../../../../pages/admin/places-management/create';
import useUploadFile from '../../../../hooks/useUploadFile';
import { ActionMeta, SingleValue } from 'react-select';
import { ICountryResponse } from '../../../../models/area/country.model';
import areaService from '../../../../services/area/area.service';
import { ICategoryResponse, IPlaceRequest } from '../../../../models/place/place.model';
import placeService from '../../../../services/place/place.service';
import Section2 from '../../Contribute/Section2/index.component';
import Section3 from '../../Contribute/Section3/index.component';
import DiscoveryContributeSection1 from './Section1/index.component';
import { scrollToTop } from '../../../../utils';

export interface IDiscoveryContributeProps {
  areaData: any | undefined;
}

export default function DiscoveryContribute(props: IDiscoveryContributeProps) {
  const { areaData } = props;
  const { upload, urlRef } = useUploadFile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
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
  }, [selectedCategory, selectedFileAvatar, valueContent, valueDescription, valueHashTags.length, valueName]);

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
    setSelectedCategory('');
    setSelectedFileAvatar(undefined);
    setValueName('');
    setValueHashTags([]);
    setValueDescription('');
    setValueContent('');
  };

  const onSubmit = async () => {
    let areaId = 1;
    var dataArea;
    if (areaData && areaData.category.id !== 2) {
      dataArea = await areaService.getProvinces(undefined);
    } else {
      dataArea = await areaService.getCountriesPagination(undefined);
    }

    for (var i = 0; i < dataArea.data.content.length; i++) {
      if (areaData && (areaData.name === dataArea.data.content[i].name || areaData.name === dataArea.data.content[i].enName)) {
        areaId = dataArea.data.content[i].id;
        break;
      }
    }
    const arrHashTags: string[] = [];
    valueHashTags.map((item) => {
      arrHashTags.push(item.value);
    });
    selectedFileAvatar && (await upload(selectedFileAvatar, 'places', 'places'));
    const params: IPlaceRequest = {
      area: areaId,
      category: Number(selectedCategory),
      content: valueContent.trim(),
      description: valueDescription.trim(),
      hashTags: arrHashTags,
      image: urlRef.current,
      name: valueName.trim(),
    };
    const response = await placeService.createPlace(params, setSubmitting);
    scrollToTop();
    // queryClient.invalidateQueries();
    clear();
  };

  return (
    <Box>
      <DiscoveryContributeSection1
        dataCategory={dataCategory}
        handleSelectCategoryChange={handleSelectCategoryChange}
        areaName={areaData ? areaData.name : ''}
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
        isDiscovery
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
          <Button w='20%' disabled={isDisableSubmit} isLoading={submitting} onClick={onSubmit}>
            Đóng góp
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
