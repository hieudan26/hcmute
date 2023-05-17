import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { useEffect, useState } from 'react';
import { ITripUpdate, useCUDTrip } from '../../../../../hooks/queries/trip';
import { ITripRequestModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';
import { formatDate, formatDateddMMYYYYtoDate, getMaxDate, getMinDate } from '../../../../../utils';
import { useAppSelector } from '../../../../../hooks/redux';

export interface IModalUpdateDetailProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  trip: ITripsResponseModel | undefined;
}

export default function ModalUpdateDetail(props: IModalUpdateDetailProps) {
  const { isOpen, onOpen, onClose, trip } = props;
  const currentTrip = useAppSelector((state) => state.currentTrip.value);
  const noColorProps = useColorModeValue('black', 'white');
  const [name, setName] = useState<string>(currentTrip ? currentTrip.title : '');
  const [quantityMember, setQuantityMember] = useState<number>(currentTrip ? currentTrip.maxMember : 0);
  const [totalPrice, setTotalPrice] = useState<number>(currentTrip ? currentTrip.totalPrice : 0);
  const [description, setDescription] = useState<string>(currentTrip ? currentTrip.description : '');
  const [date, setDate] = useState<Date>(getMaxDate());
  const [type, setType] = useState<string>(currentTrip ? currentTrip.type : 'Plan');
  const { mutationUpdateTrip } = useCUDTrip();

  const propsConfigs: PropsConfigs = {
    dateNavBtnProps: {
      color: noColorProps,
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        color: noColorProps,
      },
      selectedBtnProps: {
        background: '#D0637C',
        color: '#f6f6f6',
      },
    },
  };

  useEffect(() => {
    if (currentTrip) {
      let tempDate = currentTrip.startTime.split(' ')[0];
      var dateObject = formatDateddMMYYYYtoDate(tempDate);
      setDate(dateObject);
    }
  }, [currentTrip]);

  const onUpdateTrip = async () => {
    if (currentTrip) {
      let _update: ITripRequestModel = {
        title: name,
        maxDay: currentTrip.maxDay,
        maxMember: quantityMember,
        totalPrice: totalPrice,
        description: description,
        startTime: `${formatDate(date)} 00:00:00`,
        startingPlace: currentTrip.startingPlace,
        status: currentTrip.status as 'Public' | 'Private',
        type: type as 'Plan' | 'Adventure',
        endTime: currentTrip.endTime,
        shortDescription: currentTrip.shortDescription,
      };
      let params: ITripUpdate = {
        id: currentTrip.id,
        params: _update,
      };

      await mutationUpdateTrip.mutateAsync(params);
      onClose();
    }
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setName(event.target.value);
  };

  const changeQuantityMember = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setQuantityMember(Number(event.target.value));
  };

  const onChangeTotalPrice = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    event && setTotalPrice(Number(event.target.value));
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement> | undefined) => {
    event && setDescription(event.target.value);
  };

  const changeType = () => {
    type === 'Plan' ? setType('Adventure') : setType('Plan');
  };

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Chỉnh sửa thông tin chi tiết</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex w='full' my='2' align='center' gap='6'>
            <Heading as='h5' size='sm'>
              Thay đổi loại hành trình: <span className='font-normal'>{type === 'Plan' ? 'Dự định' : 'Đã trải nghiệm'}</span>
            </Heading>
            <Switch colorScheme='pink' isChecked={type === 'Plan' ? true : false} onChange={changeType} />
          </Flex>
          <Flex w='full' my='4' align='center' gap='6'>
            <Flex w='full' direction='column'>
              <Heading as='h5' mb='2' size='sm'>
                Tên hành trình
              </Heading>
              <Flex gap='2'>
                <Input w='full' value={name} onChange={changeTitle} />
              </Flex>
            </Flex>

            <Flex w='full' direction='column'>
              <Heading as='h5' mb='2' size='sm'>
                Ngày bắt đầu
              </Heading>
              <Flex gap='2'>
                <SingleDatepicker
                  propsConfigs={propsConfigs}
                  name='date-input'
                  date={date}
                  minDate={currentTrip && currentTrip.type === 'Plan' ? getMinDate() : undefined}
                  maxDate={currentTrip && currentTrip.type === 'Plan' ? undefined : new Date()}
                  onDateChange={setDate}
                />
              </Flex>
            </Flex>
          </Flex>

          <Flex w='full' my='4' align='center' gap='6'>
            <Flex w='full' direction='column'>
              <Heading as='h5' mb='2' size='sm'>
                Số lượng thành viên tối đa
              </Heading>
              <Flex gap='2'>
                <Input w='full' value={quantityMember} onChange={changeQuantityMember} />
              </Flex>
            </Flex>

            <Flex w='full' direction='column'>
              <Heading as='h5' mb='2' size='sm'>
                Tổng tiền (dự định)
              </Heading>
              <Flex gap='2'>
                <Input w='full' value={totalPrice} onChange={onChangeTotalPrice} />
              </Flex>
            </Flex>
          </Flex>

          <Flex w='full' direction='column'>
            <Heading as='h5' mb='2' size='sm'>
              Mô tả
            </Heading>
            <Flex gap='2'>
              <Textarea
                value={description}
                placeholder='Mô tả ngắn (ít nhất 5 kí tự)'
                size='sm'
                resize='vertical'
                bg='white'
                _dark={{ color: 'black' }}
                borderColor='gray.400'
                onChange={onChangeDescription}
              />
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onUpdateTrip}>Lưu</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
