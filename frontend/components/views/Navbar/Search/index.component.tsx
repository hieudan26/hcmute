import { Search2Icon } from '@chakra-ui/icons';
import { Input, InputGroup, InputGroupProps, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export interface ISearchProps {}

export default function Search(props: ISearchProps | InputGroupProps) {
  const { t } = useTranslation('header');
  const bgInput = useColorModeValue('white', '#4b4b4b');

  return (
    <InputGroup {...props}>
      <InputLeftElement
        pointerEvents='none'
        // eslint-disable-next-line react/no-children-prop
        children={<Search2Icon color='gray.300' />}
      />
      <Input
        bg={bgInput}
        readOnly
        type='search'
        cursor='pointer'
        placeholder={t('navbar.search')}
        border='1px'
        _hover={{
          borderColor: 'backgroundButton.primary',
        }}
      />
    </InputGroup>
  );
}
