import { Button, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiOutlineRollback } from 'react-icons/ai';
import { IoIosSave } from 'react-icons/io';
import { IoImages } from 'react-icons/io5';
import { RiUserAddFill } from 'react-icons/ri';
import ModalCoverItinerary from '../Modals/ModalCoverItinerary/index.component';
import ModalFindMember from '../Modals/ModalFindMember/index.component';
import { BiCommentDetail, BiDetail } from 'react-icons/bi';
import ModalUpdateDetail from '../Modals/ModalUpdateDetail/index.component';
import {
  ITripDayUpdateRequestModel,
  ITripRequestModel,
  ITripsResponseModel,
  responseToUpdateTripDay,
} from '../../../../models/trip/trip.model';
import { RepeatIcon } from '@chakra-ui/icons';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { setCurrentTrip } from '../../../../app/slices/currentTripSlice';
import { ITripUpdate, useCUDTrip } from '../../../../hooks/queries/trip';
import { useState } from 'react';
import DrawerReviewTrip from '../Modals/DrawerReviewTrip/index.component';
import { toggleMessage } from '../../Message/index.component';

export interface IOptionBoxProps {
  trip: ITripsResponseModel | undefined;
}

export default function OptionBox(props: IOptionBoxProps) {
  const { trip } = props;
  const currentTrip = useAppSelector((state) => state.currentTrip.value);
  const { isOpen: isOpenCover, onOpen: onOpenCover, onClose: onCloseCover } = useDisclosure();
  const { isOpen: isOpenMember, onOpen: onOpenMember, onClose: onCloseMember } = useDisclosure();
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenReview, onOpen: onOpenReview, onClose: onCloseReview } = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutationUpdateTripDays, mutationUpdateTrip } = useCUDTrip();
  const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false);

  const goBack = () => {
    // router.push('/itinerary');
    router.back();
  };

  const resetTrip = () => {
    trip && dispatch(setCurrentTrip(trip));
  };

  const save = async () => {
    if (currentTrip) {
      // setIsLoadingSave(true);
      let data: ITripDayUpdateRequestModel[] = [];

      currentTrip.tripDays.map((x) => {
        data.push(responseToUpdateTripDay(x));
      });
      console.log(data);
      await mutationUpdateTripDays.mutateAsync({ tripId: currentTrip.id, params: data });
      // setIsLoadingSave(false);
      let _update: ITripRequestModel = {
        title: currentTrip.title,
        maxDay: currentTrip.maxDay,
        maxMember: currentTrip.maxMember,
        totalPrice: currentTrip.totalPrice,
        description: currentTrip.description,
        startTime: currentTrip.startTime,
        startingPlace: currentTrip.startingPlace,
        status: currentTrip.tripDays.length ? 'Public' : (currentTrip.status as 'Public' | 'Private'),
        type: currentTrip.type as 'Plan' | 'Adventure',
        endTime: currentTrip.endTime,
        shortDescription: currentTrip.shortDescription,
      };
      let params: ITripUpdate = {
        id: currentTrip.id,
        params: _update,
      };

      await mutationUpdateTrip.mutateAsync(params);

      toggleMessage({
        type: 'success',
        message: 'Cập nhật thành công',
      });
    }
  };

  return (
    <>
      <ModalFindMember trip={trip} isOpen={isOpenMember} onClose={onCloseMember} onOpen={onOpenMember} />
      <ModalCoverItinerary isOpen={isOpenCover} onClose={onCloseCover} onOpen={onOpenCover} />
      <ModalUpdateDetail trip={trip} isOpen={isOpenDetail} onClose={onCloseDetail} onOpen={onOpenDetail} />
      <DrawerReviewTrip trip={trip} isOpen={isOpenReview} onClose={onCloseReview} onOpen={onOpenReview} />
      <Flex
        shadow='md'
        ml='2'
        direction='column'
        py='3'
        align='center'
        h='full'
        overflowY='auto'
        bg='white'
        justify='space-between'
      >
        <Flex direction='column' gap='3'>
          <IconButton
            fontSize='md'
            title='Chỉnh sửa chi tiết'
            aria-label='Cover Image'
            icon={<BiDetail />}
            onClick={onOpenDetail}
          />
          <IconButton fontSize='md' title='Thêm ảnh nền' aria-label='Cover Image' icon={<IoImages />} onClick={onOpenCover} />
          <IconButton
            fontSize='md'
            title='Thêm bạn đồng hành'
            aria-label='Add Member'
            icon={<RiUserAddFill />}
            onClick={onOpenMember}
          />
          <IconButton fontSize='md' title='Xem đánh giá' aria-label='Review' icon={<BiCommentDetail />} onClick={onOpenReview} />
          <IconButton
            isLoading={false}
            fontSize='md'
            title='Lưu hành trình'
            aria-label='Save'
            icon={<IoIosSave />}
            onClick={save}
          />
        </Flex>
        <Flex direction='column' gap='3'>
          <IconButton fontSize='md' title='Reset' aria-label='Save' icon={<RepeatIcon />} onClick={resetTrip} />
          <IconButton fontSize='md' title='Quay trở lại' aria-label='Back' icon={<AiOutlineRollback />} onClick={goBack} />
        </Flex>
      </Flex>
    </>
  );
}
