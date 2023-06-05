import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import postService from '../../../../../../services/post/post.service';
import { IPostResponseModel } from '../../../../../../models/post/post.model';
import { toggleMessage } from '../../../../Message/index.component';

export interface IReportPostProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPostResponseModel;
}

export default function ReportPost(props: IReportPostProps) {
  const { isOpen, onClose, post } = props;
  const [content, setContent] = useState<string | undefined>(undefined);

  const changeContent = (e: any) => {
    setContent(e.target.value);
  };

  const report = async () => {
    if (content) {
      const response = await postService.reportPost(post.id, content);
      if (response.data.reportCount === 10) {
        toggleMessage({
          type: 'warning',
          message: 'Bài viết này đã được ẩn đi để xem xét',
        });
      }
      onClose();
    }
  };

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Báo cáo bài đăng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={content === ''}>
            <FormLabel>Nội dung báo cáo: </FormLabel>
            <Textarea placeholder='Nội dung tại đây' size='sm' resize='vertical' onChange={changeContent} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button background='gray.600' _hover={{ bg: 'black' }} mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button isDisabled={content === '' || content === undefined} onClick={report}>
            Lưu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
