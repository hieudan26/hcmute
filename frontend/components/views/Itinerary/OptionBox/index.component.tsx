import { RepeatIcon } from '@chakra-ui/icons';
import { Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineRollback } from 'react-icons/ai';
import { BiCommentDetail, BiDetail } from 'react-icons/bi';
import { CgUserList } from 'react-icons/cg';
import { IoIosSave } from 'react-icons/io';
import { IoImages } from 'react-icons/io5';
import { RiUserAddFill } from 'react-icons/ri';
import { setCurrentTrip } from '../../../../app/slices/currentTripSlice';
import { ITripUpdate, useCUDTrip } from '../../../../hooks/queries/trip';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  ITripDayUpdateRequestModel,
  ITripRequestModel,
  ITripsResponseModel,
  responseToUpdateTripDay,
} from '../../../../models/trip/trip.model';
import { toggleMessage } from '../../Message/index.component';
import DrawerRequestJoin from '../Modals/DrawerRequestJoin/index.component';
import DrawerReviewTrip from '../Modals/DrawerReviewTrip/index.component';
import ModalCoverItinerary from '../Modals/ModalCoverItinerary/index.component';
import ModalFindMember from '../Modals/ModalFindMember/index.component';
import ModalUpdateDetail from '../Modals/ModalUpdateDetail/index.component';

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
  const { isOpen: isOpenRequest, onOpen: onOpenRequest, onClose: onCloseRequest } = useDisclosure();
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
      setIsLoadingSave(true);

      try {
        let data: ITripDayUpdateRequestModel[] = [];

        currentTrip.tripDays.map((x) => {
          data.push(responseToUpdateTripDay(x));
        });
        await mutationUpdateTripDays.mutateAsync({ tripId: currentTrip.id, params: data });
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
      } catch (ex: any) {
      } finally {
        setIsLoadingSave(false);
      }
    }
  };

  const handleAddMember = () => {
    if (currentTrip?.type === 'Adventure') {
      toggleMessage({
        type: 'warning',
        message: 'Chuyến đi đã hoàn thành không thể thêm thành viên',
      });
    } else {
      onOpenMember();
    }
  };

  return (
    <>
      <DrawerRequestJoin trip={trip} isOpen={isOpenRequest} onClose={onCloseRequest} onOpen={onOpenRequest} />
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
          {currentTrip?.type === 'Plan' && (
            <>
              <IconButton
                fontSize='md'
                title='Thêm bạn đồng hành'
                aria-label='Add Member'
                icon={<RiUserAddFill />}
                onClick={handleAddMember}
              />
              <IconButton
                fontSize='md'
                title='Quản lý yêu cầu tham gia hành trình'
                aria-label='list requests'
                icon={<CgUserList />}
                onClick={onOpenRequest}
              />
            </>
          )}
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
          <IconButton
            isLoading={isLoadingSave}
            fontSize='md'
            title='Reset'
            aria-label='Save'
            icon={<RepeatIcon />}
            onClick={resetTrip}
          />
          <IconButton fontSize='md' title='Quay trở lại' aria-label='Back' icon={<AiOutlineRollback />} onClick={goBack} />
        </Flex>
      </Flex>
    </>
  );
}
