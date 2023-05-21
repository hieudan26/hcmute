import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { ITripPlaceFeesResponseModel } from '../../../../../../models/trip/trip.model';
import { formatCurrencyVND } from '../../../../../../utils';
import { CheckCircleIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { MdCancel } from 'react-icons/md';
import { BiReset } from 'react-icons/bi';

export interface IItemFeeProps {
  item: ITripPlaceFeesResponseModel;
  onEdit: (item: ITripPlaceFeesResponseModel) => void;
  onDeleteFee: (item: ITripPlaceFeesResponseModel) => void;
  statusIsEdit: boolean;
}

export default function ItemFee(props: IItemFeeProps) {
  const { item, onEdit, onDeleteFee, statusIsEdit } = props;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueName, setValueName] = useState<string>(item.name);
  const [valuePrice, setValuePrice] = useState<number>(item.value);
  const [valueDescription, setValueDescription] = useState<string>(item.description);
  const [isReset, setIsReset] = useState<boolean>(false);

  useEffect(() => {
    if (statusIsEdit) {
      setIsEdit(false);
    }
  }, [statusIsEdit]);

  useEffect(() => {
    if (valueName !== item.name || valuePrice !== item.value || valueDescription !== item.description) {
      setIsReset(true);
    } else {
      setIsReset(false);
    }
  }, [valueName, valuePrice, valueDescription, item]);

  const changeName = (event: any) => setValueName(event.target.value);
  const changePrice = (event: any) => setValuePrice(event.target.value);
  const changeDescription = (event: any) => setValueDescription(event.target.value);

  const reset = () => {
    setValueName(item.name);
    setValuePrice(item.value);
    setValueDescription(item.description);
  };

  const saveEdit = () => {
    if (isReset) {
      let temp = { ...item };
      temp.name = valueName;
      temp.value = valuePrice;
      temp.description = valueDescription;
      onEdit(temp);
    }
  };

  return (
    <Flex mb='2' w='full' align='center' gap='2' px='2'>
      <Box w='full'>
        <Flex gap='4' mb='1' align='center'>
          {!isEdit ? (
            <>
              <Text>- Chi phí dịch vụ: </Text>
              <Text>{valueName}</Text>
              <Text>/</Text>
              <Text>{formatCurrencyVND(valuePrice.toString())}</Text>
            </>
          ) : (
            <>
              <Input placeholder='Loại phí' value={valueName} w='fit-content' onChange={changeName} />
              <Text>/</Text>
              <Input placeholder='Giá trị' type='number' value={valuePrice.toString()} w='fit-content' onChange={changePrice} />
            </>
          )}
        </Flex>
        <Textarea
          disabled={!isEdit}
          placeholder='Mô tả về chi phí này'
          size='sm'
          resize='none'
          value={valueDescription}
          onChange={changeDescription}
        />
      </Box>
      <Flex direction='column' gap='4' fontSize='sm'>
        {isEdit && isReset && (
          <CheckCircleIcon
            fontSize='xs'
            cursor='pointer'
            _hover={{ color: '#D0637C' }}
            onClick={() => {
              saveEdit();
              setIsEdit(false);
            }}
          />
        )}
        {!isEdit ? (
          <EditIcon
            cursor='pointer'
            _hover={{ color: '#D0637C' }}
            onClick={() => {
              setIsEdit(true);
            }}
          />
        ) : (
          <Icon
            as={MdCancel}
            cursor='pointer'
            _hover={{ color: '#D0637C' }}
            onClick={() => {
              setIsEdit(false);
            }}
          />
        )}
        <DeleteIcon
          cursor='pointer'
          _hover={{ color: '#D0637C' }}
          onClick={() => {
            onDeleteFee(item);
          }}
        />
        {isReset && <Icon as={BiReset} cursor='pointer' _hover={{ color: '#D0637C' }} onClick={reset} />}
      </Flex>
    </Flex>
  );
}
