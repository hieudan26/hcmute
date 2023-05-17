import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ITripPlaceResponseModel } from '../../../../../models/trip/trip.model';
import { useEffect, useState } from 'react';
import { distanceTime } from '../../../../../utils';

export interface IModalDetailChooseBoxProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  tripPlace: ITripPlaceResponseModel | undefined;
  saveDetailBox: (tripPlace: ITripPlaceResponseModel) => void;
}

export default function ModalDetailChooseBox(props: IModalDetailChooseBoxProps) {
  const { isOpen, onOpen, onClose, tripPlace, saveDetailBox } = props;
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [travelPrice, setTravelPrice] = useState<number>(0);
  const [transport, setTransport] = useState('Xe buýt');

  useEffect(() => {
    if (tripPlace) {
      const startTimeTripPlace = tripPlace.startTime.split(' ')[1];
      setStartTime(startTimeTripPlace);
      const endTimeTripPlace = tripPlace.endTime.split(' ')[1];
      setEndTime(endTimeTripPlace);
      setTravelPrice(Number(tripPlace.travelPrice));
      setTransport(tripPlace.transport);
    }
  }, [tripPlace]);

  const changeStartTime = (event: any) => setStartTime(event.target.value);
  const changeEndTime = (event: any) => setEndTime(event.target.value);
  const changeTravelPrice = (event: any) => setTravelPrice(event.target.value);

  const save = () => {
    if (tripPlace) {
      let tempTripPlace = { ...tripPlace };
      tempTripPlace.startTime = `${tripPlace.startTime.split(' ')[0]} ${startTime}`;
      tempTripPlace.endTime = `${tripPlace.endTime.split(' ')[0]} ${endTime}`;
      tempTripPlace.transport = transport;
      tempTripPlace.travelPrice = travelPrice.toString();
      tempTripPlace.travelTime = distanceTime(startTime, endTime);
      saveDetailBox(tempTripPlace);
      onClose();
    }
  };

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='3xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Chỉnh sửa thông tin địa điểm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading as='h5' size='sm' color='#D0637C'>
            Thông tin chuyến đi
          </Heading>
          <Flex my='4' align='center' gap='4'>
            <Flex direction='column' w='full'>
              <Text fontSize='sm'>Thời gian đến</Text>
              <Input w='full' type='time' value={startTime} step='1' onChange={changeStartTime} />
            </Flex>
            <Flex direction='column' w='full'>
              <Text fontSize='sm'>Thời gian về</Text>
              <Input w='full' type='time' value={endTime} step='1' onChange={changeEndTime} />
            </Flex>
            <Flex direction='column' w='full'>
              <Text fontSize='sm'>Số tiền dự chi</Text>
              <Input w='full' value={travelPrice} onChange={changeTravelPrice} />
            </Flex>
          </Flex>

          <Heading mb='4' as='h5' size='sm' color='#D0637C'>
            Phương tiện di chuyển
          </Heading>

          <RadioGroup onChange={setTransport} value={transport}>
            <Grid templateColumns='repeat(5, 1fr)' gap={6}>
              <GridItem w='100%'>
                <Radio value='Xe buýt'>Xe buýt</Radio>
              </GridItem>
              <GridItem w='100%'>
                <Radio value='Tàu hỏa'>Tàu hỏa</Radio>
              </GridItem>
              <GridItem w='100%'>
                <Radio value='Xe hơi'>Xe hơi</Radio>
              </GridItem>
              <GridItem w='100%'>
                <Radio value='Xe đạp'>Xe đạp</Radio>
              </GridItem>
              <GridItem w='100%'>
                <Radio value='Tàu thủy'>Tàu thủy</Radio>
              </GridItem>
              <GridItem w='100%'>
                <Radio value='Máy bay'>Máy bay</Radio>
              </GridItem>
              <GridItem w='100%'>
                <Radio value='Đi bộ'>Đi bộ</Radio>
              </GridItem>
            </Grid>
          </RadioGroup>
          {/* <Heading my='4' as='h5' size='sm' color='#D0637C'>
            Chi phí chi tiết
          </Heading> */}
          {/* <Box>
            <Flex w='full' gap='4' mb='2'>
              <Flex direction='column' w='full'>
                <Text fontSize='sm'>Loại phí</Text>
                <Input w='full' />
              </Flex>

              <Flex direction='column' w='full'>
                <Text fontSize='sm'>Giá trị</Text>
                <Input w='full' />
              </Flex>
            </Flex>
            <Text fontSize='sm'>Ghi chú</Text>
            <Textarea placeholder='Here is a sample placeholder' size='md' />
          </Box> */}
        </ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={save}>Lưu</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
