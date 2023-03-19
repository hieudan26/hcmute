import { Box, Checkbox, Flex, Input, SimpleGrid, Text, useColorMode } from '@chakra-ui/react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ISelectOption, styleSelect } from '../../../../../pages/admin/places-management/create';

export interface IDiscoveryContributeSection1Props {
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
  areaName: string | undefined;
}

export default function DiscoveryContributeSection1(props: IDiscoveryContributeSection1Props) {
  const { colorMode } = useColorMode();
  const { dataCategory, handleSelectCategoryChange, areaName } = props;

  return (
    <SimpleGrid columns={2} spacing='40px'>
      <Flex direction='column'>
        <Text fontSize='sm' mb='2'>
          Tên khu vực
        </Text>
        <Input value={areaName ? areaName : ''} readOnly />
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
