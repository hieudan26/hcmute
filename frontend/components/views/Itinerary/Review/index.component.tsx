import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useCUDTrip, useTripReviews } from '../../../../hooks/queries/trip';
import { useEffect, useState } from 'react';
import { ITripReviewResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import { StarIcon } from '@chakra-ui/icons';

export interface IReviewProps {
  tripData: undefined | any;
}

export default function Review(props: IReviewProps) {
  const { tripData } = props;
  const [trip, setTrip] = useState<undefined | ITripsResponseModel>(undefined);
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutationCreateReviewTrip } = useCUDTrip();

  useEffect(() => {
    tripData && setTrip(tripData.data);
  }, [tripData]);

  const reviews = useTripReviews(
    {
      idTrip: trip ? trip.id : 0,
      paramsPagination: {
        pageNumber: 0,
        pageSize: 20,
      },
    },
    trip !== undefined
  );

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const changeValue = (event: any) => {
    setContent(event.target.value);
  };

  const submit = async () => {
    if (trip) {
      setIsLoading(true);
      try {
        await mutationCreateReviewTrip.mutateAsync({
          idTrip: trip.id,
          params: {
            content: content,
            rate: rating,
          },
        });
        setContent('');
        setRating(0);
      } catch (ex: any) {
        console.log(ex);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Heading textAlign='center' mb='10'>
        Cảm nhận về hành trình
      </Heading>
      <Flex px='28' align='flex-start' gap={6} w='full' mb='10'>
        <Box position='sticky' top={32} left={0} zIndex={4}>
          <Box bg='white' shadow='md' w='full' borderWidth='1px' borderRadius='lg' overflow='hidden' mt='2' p='6' fontSize='sm'>
            <Text mb='1'>Để lại cảm nhận của bạn về chuyến đi này 😘😘</Text>
            <Box my='1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Box
                  as='button'
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  color={star <= rating ? 'pink.500' : 'gray.300'}
                  _hover={{ color: 'pink.500' }}
                >
                  <StarIcon w={5} h={5} />
                </Box>
              ))}
            </Box>
            <FormControl isRequired w='full' mb='1'>
              <FormLabel fontWeight='bold' fontSize='sm'>
                Nội dung
              </FormLabel>
              <Textarea
                value={content}
                onChange={changeValue}
                fontSize='sm'
                placeholder='Cảm nhận của bạn'
                size='sm'
                resize='none'
              />
            </FormControl>
            <Center>
              <Button isLoading={isLoading} fontSize='sm' w='40%' onClick={submit}>
                Gửi
              </Button>
            </Center>
          </Box>
        </Box>
        <Box w='full'>
          <Grid gap='8' templateColumns='repeat(2, 1fr)' mb='12'>
            {reviews.data &&
              reviews.data.pages.map((page) =>
                page.data.content.map((item: ITripReviewResponseModel, index: number) => (
                  <Box bg='white' shadow='md' key={item.id} w='full' borderWidth='1px' borderRadius='lg' overflow='hidden' mt='2'>
                    <Box p='6'>
                      <Flex align='center' gap='4' mb='2'>
                        <Avatar size='sm' name={`${item.owner.firstName} ${item.owner.lastName}`} src={item.owner.avatar} />
                        <Heading as='h5' size='sm'>
                          {item.owner.firstName} {item.owner.lastName}
                        </Heading>
                      </Flex>
                      <Box fontWeight='semibold' as='h4' lineHeight='tight'>
                        {item.content}
                      </Box>

                      <Box as='span' color='gray.600' fontSize='sm'>
                        {item.reviewAt}
                      </Box>

                      <Box display='flex' mt='2' alignItems='center'>
                        {Array(5)
                          .fill('')
                          .map((_, i) => (
                            <StarIcon key={i} color={i < item.rate ? 'pink.500' : 'gray.300'} />
                          ))}
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
          </Grid>
          {reviews.hasNextPage && (
            <Center>
              <Button
                onClick={() => {
                  reviews.fetchNextPage();
                }}
              >
                Tải thêm
              </Button>
            </Center>
          )}
        </Box>
      </Flex>
    </>
  );
}
