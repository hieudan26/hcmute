import { StarIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useTripReviews } from '../../../../../hooks/queries/trip';
import { ITripReviewResponseModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';

export interface IDrawerReviewTripProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  trip: ITripsResponseModel | undefined;
}

export default function DrawerReviewTrip(props: IDrawerReviewTripProps) {
  const { isOpen, onOpen, onClose, trip } = props;
  const drawerBodyRef = useRef<HTMLDivElement>(null);
  const reviews = useTripReviews(
    {
      idTrip: trip ? trip.id : 0,
      paramsPagination: {
        pageNumber: 0,
        pageSize: 20,
      },
    },
    isOpen && trip !== undefined
  );

  const handleScroll = () => {
    if (drawerBodyRef.current) {
      const bottom =
        drawerBodyRef.current.scrollHeight - drawerBodyRef.current.scrollTop - drawerBodyRef.current.clientHeight <= 0.42;
      if (bottom && reviews.hasNextPage) {
        reviews.fetchNextPage();
      }
    }
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size='md' finalFocusRef={drawerBodyRef}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Danh sách các đánh giá chuyến đi</DrawerHeader>
        <DrawerBody ref={drawerBodyRef} onScroll={handleScroll}>
          {reviews.data &&
            reviews.data.pages.map((page) =>
              page.data.content.map((item: ITripReviewResponseModel, index: number) => (
                <Box key={item.id} w='full' borderWidth='1px' borderRadius='lg' overflow='hidden' my='4'>
                  <Box p='6'>
                    <Flex align='center' gap='4' mb='2'>
                      <Avatar size='sm' name={`${item.owner.firstName} ${item.owner.lastName}`} src={item.owner.avatar} />
                      <Heading as='h5' size='sm'>
                        {item.owner.firstName} {item.owner.lastName}
                      </Heading>
                    </Flex>
                    <Box fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1}>
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
