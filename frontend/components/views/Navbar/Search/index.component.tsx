import { Search2Icon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  useColorModeValue,
  InputRightElement,
  Kbd,
  chakra,
  useEventListener,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import SearchModal from '../../Modals/SearchModal/index.component';

export interface ISearchProps {}

const ACTION_KEY_DEFAULT = ['Ctrl', 'Control'];
const ACTION_KEY_APPLE = ['⌘', 'Command'];

export default function Search(props: ISearchProps | InputGroupProps) {
  const { t } = useTranslation('header');
  const bgInput = useColorModeValue('white', '#4b4b4b');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [actionKey, setActionKey] = useState(ACTION_KEY_APPLE);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
    if (!isMac) {
      setActionKey(ACTION_KEY_DEFAULT);
    }
  }, []);

  useEventListener('keydown', (event) => {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.userAgent);
    const hotkey = isMac ? 'metaKey' : 'ctrlKey';
    if (event.key.toLowerCase() === 'k' && event[hotkey]) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <SearchModal isOpen={isOpen} onClose={closeModal} />
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
          onClick={() => {
            setIsOpen(true);
          }}
        />
        <InputRightElement
          mr='5'
          cursor='pointer'
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Kbd color='gray.500' rounded='2px'>
            <chakra.div fontSize='2xs' as='abbr' title='Control' textDecoration='none !important'>
              Ctrl + K
            </chakra.div>
          </Kbd>
        </InputRightElement>
      </InputGroup>
    </>
  );
}
