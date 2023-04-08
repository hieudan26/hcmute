import { Box, Container, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { AiFillFlag } from 'react-icons/ai';
import { BiCheckDouble } from 'react-icons/bi';
import { BsCheckAll } from 'react-icons/bs';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { IoMapOutline } from 'react-icons/io5';

export interface IFeatureProps {}

export default function Feature(props: IFeatureProps) {
  return (
    <Box mt='24'>
      <Heading size='xl' textAlign='center'>
        Các bước tạo lịch trình
      </Heading>
      <Container maxW='6xl' mt='10'>
        <Flex align='center' justify='space-between'>
          <Flex direction='column' align='center' justify='center' gap='3'>
            <Icon as={IoMapOutline} fontSize='xxx-large' />
            <Text fontWeight='semibold' fontSize='lg'>
              Tạo lịch trình
            </Text>
            <Text maxW='52' textAlign='center'>
              Tự tạo lịch trình chuyến đi hoặc tìm kiếm đề xuất từ các Lumiere - khác
            </Text>
          </Flex>
          <Flex direction='column' align='center' justify='center' gap='3'>
            <Icon as={HiOutlinePencilAlt} fontSize='xxx-large' />
            <Text fontWeight='semibold' fontSize='lg'>
              Tùy chỉnh
            </Text>
            <Text maxW='52' textAlign='center'>
              Tuỳ chỉnh dựa trên nhu cầu, ngân sách, thời gian của bạn
            </Text>
          </Flex>
          <Flex direction='column' align='center' justify='center' gap='3'>
            <Icon as={BiCheckDouble} fontSize='xxx-large' />
            <Text fontWeight='semibold' fontSize='lg'>
              Hoàn tất
            </Text>
            <Text maxW='52' textAlign='center'>
              Hoàn tất lịch trình và thông tin liên quan: các booking đặt chổ. Lưu và quản lý thật tiện lợi.
            </Text>
          </Flex>
          <Flex direction='column' align='center' justify='center' gap='3'>
            <Icon as={AiFillFlag} fontSize='xxx-large' />
            <Text fontWeight='semibold' fontSize='lg'>
              Let&apos;s go
            </Text>
            <Text maxW='52' textAlign='center'>
              Sử dụng app để lưu và quản lý nhận được các thông báo liên quan đến lịch trình
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
