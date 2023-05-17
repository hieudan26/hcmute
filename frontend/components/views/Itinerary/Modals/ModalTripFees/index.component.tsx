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

export interface IModalTripFeesProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ModalTripFees(props: IModalTripFeesProps) {
  const { isOpen, onOpen, onClose } = props;

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Quản lý chi tiêu chi tiết</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button>Lưu</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
