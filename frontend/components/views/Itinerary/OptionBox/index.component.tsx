import { Button, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiOutlineRollback } from 'react-icons/ai';
import { IoIosSave } from 'react-icons/io';
import { IoImages } from 'react-icons/io5';
import { RiUserAddFill } from 'react-icons/ri';
import ModalCoverItinerary from '../Modals/ModalCoverItinerary/index.component';
import ModalFindMember from '../Modals/ModalFindMember/index.component';

export interface IOptionBoxProps {}

export default function OptionBox(props: IOptionBoxProps) {
  const { isOpen: isOpenCover, onOpen: onOpenCover, onClose: onCloseCover } = useDisclosure();
  const { isOpen: isOpenMember, onOpen: onOpenMember, onClose: onCloseMember } = useDisclosure();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <>
      <ModalFindMember isOpen={isOpenMember} onClose={onCloseMember} onOpen={onOpenMember} />
      <ModalCoverItinerary isOpen={isOpenCover} onClose={onCloseCover} onOpen={onOpenCover} />
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
          <IconButton fontSize='md' title='Thêm ảnh nền' aria-label='Cover Image' icon={<IoImages />} onClick={onOpenCover} />
          <IconButton
            fontSize='md'
            title='Thêm bạn đồng hành'
            aria-label='Add Member'
            icon={<RiUserAddFill />}
            onClick={onOpenMember}
          />
          <IconButton fontSize='md' title='Lưu hành trình' aria-label='Save' icon={<IoIosSave />} />
        </Flex>
        <Flex>
          <IconButton fontSize='md' title='Quay trở lại' aria-label='Back' icon={<AiOutlineRollback />} onClick={goBack} />
        </Flex>
      </Flex>
    </>
  );
}
