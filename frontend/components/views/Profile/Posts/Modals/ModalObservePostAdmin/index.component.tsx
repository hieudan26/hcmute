import {
  Avatar,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { STATUS_POST } from '../../../../../../constants/global.constant';
import { IPostReportResponseModel, IPostResponseModel } from '../../../../../../models/post/post.model';
import postService from '../../../../../../services/post/post.service';

export interface IModalObservePostAdminProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  post: IPostResponseModel;
  onChangeStatusPost: (postId: string, type: string) => Promise<void>;
}

export default function ModalObservePostAdmin(props: IModalObservePostAdminProps) {
  const { isOpen, onOpen, onClose, post, onChangeStatusPost } = props;
  const [dataReports, setDataReports] = useState<IPostReportResponseModel[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchReports = async () => {
        const response = await postService.getReportsByPost(undefined, post.id);
        setDataReports(response.data.content);
      };
      fetchReports();
    }
  }, [post, isOpen]);

  return (
    <Modal motionPreset='slideInRight' isCentered isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='inside'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
      <ModalContent>
        <ModalHeader>Danh sách các báo cáo về bài viết</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY='auto'>
          <Flex w='full'>
            {dataReports.map((item, index) => (
              <Box key={item.id} border='1px' borderColor='gray.500' w='full' p='3'>
                <Flex align='center' gap='4'>
                  <Avatar size='sm' src={item.avatar} />
                  <Text fontWeight='bold'>{item.fullName}</Text>
                </Flex>
                <Box mx='4' mt='2'>
                  <Text noOfLines={1}>{item.content}</Text>
                </Box>
              </Box>
            ))}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            background='gray.600'
            _hover={{ bg: 'black' }}
            mr={3}
            onClick={() => {
              onChangeStatusPost(post.id, STATUS_POST.ACTIVE);
            }}
          >
            Mở bài viết trở lại
          </Button>
          <Button
            onClick={() => {
              onChangeStatusPost(post.id, STATUS_POST.BANNED);
            }}
          >
            Khóa bài viết
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
