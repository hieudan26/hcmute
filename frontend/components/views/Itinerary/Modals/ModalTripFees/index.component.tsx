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
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { PropsConfigs } from 'chakra-dayzed-datepicker/dist/utils/commonTypes';
import { useEffect, useState } from 'react';
import { ITripUpdate, useCUDTrip } from '../../../../../hooks/queries/trip';
import {
  ITripPlaceFeesResponseModel,
  ITripPlaceResponseModel,
  ITripRequestModel,
  ITripsResponseModel,
} from '../../../../../models/trip/trip.model';
import { formatCurrencyVND, formatDate, formatDateddMMYYYYtoDate, getMaxDate, getMinDate } from '../../../../../utils';
import { useAppSelector } from '../../../../../hooks/redux';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { MdCancel } from 'react-icons/md';
import ItemFee from './ItemFee/index.component';

export interface IModalTripFeesProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  tripPlace: ITripPlaceResponseModel | undefined;
  onEdit: (item: ITripPlaceFeesResponseModel) => void;
  saveChanges: () => Promise<void>;
  onDeleteFee: (item: ITripPlaceFeesResponseModel) => void;
  resetTrip: () => void;
  addTripPlaceFee: (item: ITripPlaceResponseModel) => void;
}

export default function ModalTripFees(props: IModalTripFeesProps) {
  const { isOpen, onOpen, onClose, tripPlace, onEdit, saveChanges, onDeleteFee, resetTrip, addTripPlaceFee } = props;
  const [statusIsEdit, setStatusIsEdit] = useState<boolean>(false);

  const addNew = () => {
    if (tripPlace) {
      addTripPlaceFee(tripPlace);
    }
  };

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='2xl' scrollBehavior='inside'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Quản lý chi tiêu chi tiết</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY='auto'>
          {tripPlace &&
            tripPlace.tripPlaceFees.map((item, index) => (
              <ItemFee statusIsEdit={statusIsEdit} onEdit={onEdit} onDeleteFee={onDeleteFee} key={item.id} item={item} />
            ))}
        </ModalBody>

        <ModalFooter>
          <Button background='blue.500' _hover={{ bg: 'blue.600' }} mr={3} onClick={addNew}>
            Thêm
          </Button>
          <Button
            background='gray.600'
            _hover={{ bg: 'black' }}
            mr={3}
            onClick={() => {
              onClose();
              resetTrip();
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              setStatusIsEdit(true);
              saveChanges();
              setStatusIsEdit(false);
            }}
          >
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
