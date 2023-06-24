import { Flex, Icon, Text } from '@chakra-ui/react';
import { GoDash, GoPrimitiveDot } from 'react-icons/go';
import { RoleConstants } from '../../../../../constants/roles.constant';
import { useAppSelector } from '../../../../../hooks/redux';
import { INotificationResponse } from '../../../../../models/notification/notification.model';

export interface IItemContentProps {
  data: INotificationResponse;
}

export function ItemContent(props: IItemContentProps) {
  const { data } = props;
  const auth = useAppSelector((state) => state.auth.value);

  const generateContent = () => {
    if (auth?.role === RoleConstants.ADMIN) {
      switch (data.type) {
        case 'place_status':
          return 'đã đóng góp một địa điểm du lịch mới cho hệ thống';
        case 'message':
          return 'Không có ý kiến';
        case 'post':
          return 'không có ý kiến';
        case 'react':
          return 'không có ý kiến';
        case 'comment':
          return 'không có ý kiến';
        case 'comment_reply':
          return 'không có ý kiến';
        default:
          return 'không có ý kiến';
      }
    } else {
      switch (data.type) {
        case 'place_status':
          return 'đã phê duyệt một đóng góp địa điểm du lịch của bạn';
        case 'message':
          return 'abc';
        case 'post':
          return 'không có ý kiến';
        case 'report_observe':
          return 'Bài đăng của bạn được tạm ẩn không công khai để xem xét, bạn vẫn có thể truy cập tại đây để chỉnh sửa';
        case 'report_active':
          return 'Bài đăng của bạn được Admin phê duyệt';
        case 'report_banned':
          return 'Bài đăng của bạn vi phạm yếu tố cộng đồng và bị khóa vĩnh viễn';
        case 'react':
          return 'đã thả cảm xúc cho bài đăng của bạn';
        case 'comment':
          return 'đã bình luận bài đăng của bạn';
        case 'comment_reply':
          return 'đã phản hồi bình luận của bạn trong một bài đăng';
        case 'trip_request_owner':
          return 'đã gửi yêu cầu tham gia hành trình cùng bạn. Hãy kiểm tra ngay nào';
        case 'trip_request_rejected':
          return 'của hành trình đã từ chối yêu cầu tham gia hành trình cùng bạn. Liên hệ với chủ hành trình để có thể trao đổi thêm';
        case 'trip_request_approved':
          return 'của hành trình đã chấp thuận yêu cầu tham gia hành trình cùng bạn, bạn có thể tham gia trò chuyện cùng mọi người ngay bây giờ';
        default:
          return 'không có ý kiến';
      }
    }
  };

  return (
    <Flex justify='space-between' w='full'>
      <Flex>
        <Flex justify='center' align='center' me='2'>
          <Icon as={GoDash} fontSize='md' color='gray.600' />
        </Flex>
        <Flex flexDirection='column' mt='-1'>
          <Text mb='1' fontWeight='bold' lineHeight='5' fontSize={{ base: 'small', md: 'small' }}>
            {data.fullName}{' '}
            <Text as='span' fontWeight='normal'>
              {generateContent()}
            </Text>
          </Text>
          <Flex alignItems='center'>
            <Text fontSize={{ base: 'xs', md: 'xs' }} lineHeight='100%' color={data.status === false ? '#D0637C' : 'gray.400'}>
              {data.creationDate}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Icon display={data.status === true ? 'none' : 'block'} as={GoPrimitiveDot} fontSize='md' color='#D0637C' ml='2' mr='1' />
    </Flex>
  );
}
