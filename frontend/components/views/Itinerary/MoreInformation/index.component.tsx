import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';

export interface IMoreInformationProps {}

export default function MoreInformation(props: IMoreInformationProps) {
  const [isReadMore, setIsReadMore] = useState<boolean>(false);

  const changeStatusShow = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <Box px='10' py='8' bg='white' rounded='md' shadow='md' mt='20'>
      <Box mb='4'>
        <Heading as='h2' size='lg' mb='2'>
          Tạo lịch trình du lịch dễ dàng
        </Heading>
        <Text>
          Tạo lịch trình du lịch theo mẫu một cách dễ dàng, nhanh chóng cho chuyến đi của bạn. Dùng để chia sẻ với bạn bè, để
          apply xin visa,...
        </Text>
      </Box>
      <Box mb='4'>
        <Heading as='h2' size='md' mb='2'>
          Lịch trình du lịch là gì?
        </Heading>
        <Text>
          Lịch trình du lịch là bản tóm tắt hành trình du lịch với các hoạt động trong chuyến đi đã lên kế hoạch. Trong lịch trình
          du lịch thông thường sẽ gồm các thông tin như điểm du lịch, điểm tham quan, hướng dẫn đi lại, các thông tin đặt chổ (vé
          máy bay, vé tàu, khách sạn, vé tham quan, vé xem show, visa điện tử (e-visa),...).
        </Text>
      </Box>
      <Box mb='4'>
        <Heading as='h2' size='md' mb='2'>
          Tại sao nên tạo lịch trình du lịch cho chuyến đi
        </Heading>
        <Text>
          Việc lên kế hoạch và tạo lịch trình cho chuyến du lịch gần như là việc phải làm của hầu hết khách du lịch. Nó giúp du
          khách có thể hình dung được về hành trình của mình, qua đó có thể điều chỉnh hay tối ưu được các trải nghiệm trong
          khoảng thời gian du lịch của bản thân, đồng thời có thể lưu trữ và quản lý được các thông tin đặt chổ liên quan đến
          chuyến đi một cách dễ dàng và tiện lợi.Một số du khách tạo lịch trình trước chuyến đi để chia sẻ và nhờ tư vấn từ bạn bè
          người thân hoặc cộng đồng. Với một số quốc gia việc có lịch trình du lịch là một thủ tục bắt buộc khi nộp hồ sơ xin visa
          du lịch hay khi nhập cảnh.
        </Text>
      </Box>
      {isReadMore && (
        <>
          <Box mb='4'>
            <Heading as='h2' size='md' mb='2'>
              Tại sao nên tạo lịch trình du lịch cho chuyến đi
            </Heading>
            <Text>
              Việc lên kế hoạch và tạo lịch trình cho chuyến du lịch gần như là việc phải làm của hầu hết khách du lịch. Nó giúp
              du khách có thể hình dung được về hành trình của mình, qua đó có thể điều chỉnh hay tối ưu được các trải nghiệm
              trong khoảng thời gian du lịch của bản thân, đồng thời có thể lưu trữ và quản lý được các thông tin đặt chổ liên
              quan đến chuyến đi một cách dễ dàng và tiện lợi.Một số du khách tạo lịch trình trước chuyến đi để chia sẻ và nhờ tư
              vấn từ bạn bè người thân hoặc cộng đồng. Với một số quốc gia việc có lịch trình du lịch là một thủ tục bắt buộc khi
              nộp hồ sơ xin visa du lịch hay khi nhập cảnh.
            </Text>
          </Box>
          <Box mb='4'>
            <Heading as='h2' size='md' mb='2'>
              Mẫu lịch trình du lịch
            </Heading>
            <Text>
              Về cơ bản mẫu lịch trình cho một chuyến du lịch nó không giống nhau dù các thông tin cần thì khá giống nhau. Đó sẽ
              là hành trình tóm tắt cho từng ngày trong chuyến đi: đi đâu, làm gì, ở đâu,... Cũng như các thông tin hướng dẫn đi
              lại, các thông tin đặt chổ liên quan của từng ngày hoặc của toàn bộ chuyến đi.
            </Text>
          </Box>
          <Box mb='4'>
            <Heading as='h2' size='md' mb='2'>
              Cách tạo lịch trình du lịch dễ dàng
            </Heading>
            <Text>
              Sử dụng công cụ tạo lịch trình du lịch của Gody du khách chỉ mất 3 - 5 phút là có ngay cho mình một bản hành trình
              với đầy đủ các thông tin cần thiết và hợp lý nhất. Rất nhanh chóng và dễ dàng, việc lưu trữ và quản lý các thông tin
              thì rất tiện lợn. Các nội dung trong công cụ tạo lịch trình du lịch của Gody được tổng hợp từ các blogger du lịch,
              từ các chuyên gia. Ngoài việc tạo lịch trình theo nhu cầu của mình, với công cụ tạo lịch trình của Gody du khách
              cũng có thể tham khảo các lịch trình của các du khách khác.
            </Text>
          </Box>
        </>
      )}
      <Flex justify='flex-end'>
        <Button variant='ghost' rightIcon={isReadMore ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={changeStatusShow}>
          {isReadMore ? 'Show less' : 'Show more'}
        </Button>
      </Flex>
    </Box>
  );
}
