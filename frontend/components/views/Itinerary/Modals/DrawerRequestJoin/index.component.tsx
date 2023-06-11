import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ITripRequestJoinResponse, ITripsResponseModel } from '../../../../../models/trip/trip.model';
import tripService from '../../../../../services/trip/trip.service';

export interface IDrawerRequestJoinProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  trip: ITripsResponseModel | undefined;
}

export default function DrawerRequestJoin(props: IDrawerRequestJoinProps) {
  const { isOpen, onOpen, onClose, trip } = props;
  const router = useRouter();
  const [data, setData] = useState<ITripRequestJoinResponse[]>([]);
  const [refresh, setRefresh] = useState<number>(0);

  const fetchData = async () => {
    if (trip) {
      const resp = await tripService.getAllRequestsJoinTrip(trip.id, 'PENDING', undefined);
      setData(resp.data.content);
    }
  };

  useEffect(() => {
    if (trip && isOpen && refresh >= 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip, isOpen, refresh]);

  const update = async (status: string, userId: string) => {
    if (trip) {
      await tripService.updateRequestStatus(trip.id, {
        status: status,
        userId: userId,
      });
      await fetchData();
    }
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size='md'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Danh sách các yêu cầu tham gia hành trình</DrawerHeader>
        <DrawerBody>
          {data.map((item, index) => (
            <Box key={item.id} w='full' border='1px' borderColor='gray.400' py='1' px='2'>
              <Flex align='center' gap='3'>
                <Avatar
                  cursor='pointer'
                  name={`${item.user.firstName} ${item.user.lastName}`}
                  src={item.user.avatar}
                  onClick={() => {
                    router.push(`/profile/${item.user.id}/about`);
                  }}
                />
                <Text>{`${item.user.firstName} ${item.user.lastName}`}</Text>
              </Flex>
              <Flex mt='2' align='end' justify='end' gap='3'>
                <Button
                  background='gray.600'
                  _hover={{ bg: 'black' }}
                  onClick={async () => {
                    await update('REJECTED', item.user.id);
                    setRefresh(refresh + 1);
                  }}
                >
                  Từ chối
                </Button>
                <Button
                  onClick={async () => {
                    await update('APPROVED', item.user.id);
                    setRefresh(refresh + 1);
                  }}
                >
                  Chấp thuận
                </Button>
              </Flex>
            </Box>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
