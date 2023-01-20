import { Box, Flex, Image, chakra, Icon, useColorModeValue, Avatar } from '@chakra-ui/react';
import { IPostResponseModel } from '../../../../models/post/post.model';
import { AiFillHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { useRouter } from 'next/router';

export interface IExperienceCardProps {
  data: IPostResponseModel;
}

export default function ExperienceCard(props: IExperienceCardProps) {
  const { data } = props;
  const footerbg = useColorModeValue('white', 'blackAlpha.400');
  const namebg = useColorModeValue('white', 'blackAlpha.400');
  const dividerbg = useColorModeValue('gray.300', 'blackAlpha.400');
  const router = useRouter();

  const navigateDetail = () => {
    router.push(`/detail-post/${data.id}`);
  };

  return (
    <Box w='2xs' mx='auto' my='4' bg='white' shadow='lg' rounded='lg' overflow='hidden'>
      <Box onClick={navigateDetail} title='Nhấn để xem chi tiết' cursor='pointer'>
        <Image
          _hover={{ transform: 'scale(1.42)' }}
          transition='transform .5s'
          transform='auto-gpu'
          w='full'
          h='44'
          fit='cover'
          objectPosition='center'
          src={data.images[0]}
          alt='avatar'
        />
        <Flex alignItems='center' px={4} py={2} bg='gray.700'>
          <chakra.h1 color='white' fontWeight='medium' fontSize='sm' noOfLines={1}>
            {data.title}
          </chakra.h1>
        </Flex>
        <Flex alignItems='center' px={4} py={2} bg={namebg} borderBottom='1px' borderBottomColor={dividerbg} gap={2}>
          <Avatar size='xs' name={data.fullName} src={data.avatar} />
          <chakra.h1 color='gray.700' fontWeight='medium' fontSize='sm' noOfLines={1}>
            {data.fullName}
          </chakra.h1>
        </Flex>
      </Box>
      <Flex py={4} px={6} alignItems='center' justify='space-around' color='gray.700' bg={footerbg}>
        <Flex alignItems='center'>
          <Icon as={AiFillHeart} h={6} w={6} />
          <chakra.h1 px={2} fontSize='sm'>
            {data.reactNumber}
          </chakra.h1>
        </Flex>

        <Flex alignItems='center'>
          <Icon as={BiCommentDetail} h={6} w={6} />
          <chakra.h1 px={2} fontSize='sm'>
            {data.commentNumber}
          </chakra.h1>
        </Flex>
      </Flex>
    </Box>
  );
}
