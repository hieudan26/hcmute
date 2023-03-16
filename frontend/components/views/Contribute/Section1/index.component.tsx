import { Box, Checkbox, Flex, SimpleGrid, Text, useColorMode } from '@chakra-ui/react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { ISelectOption, styleSelect } from '../../../../pages/admin/places-management/create';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export interface ISection1Props {
  checkCountry: boolean;
  setCheckCountry: Dispatch<SetStateAction<boolean>>;
  dataArea: ISelectOption[];
  selectAreaRef: MutableRefObject<any>;
  handleSelectAreaChange: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => void;
  dataCategory: ISelectOption[];
  handleSelectCategoryChange: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => void;
}

export default function Section1(props: ISection1Props) {
  const {
    checkCountry,
    setCheckCountry,
    dataArea,
    selectAreaRef,
    handleSelectAreaChange,
    dataCategory,
    handleSelectCategoryChange,
  } = props;
  const { colorMode } = useColorMode();

  return (
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
  );
}
