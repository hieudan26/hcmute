import { Flex, Grid, GridItem } from '@chakra-ui/react';
import PlaceCard from '../Card/index.component';

export interface IPlacesListProps {}

export default function PlacesList(props: IPlacesListProps) {
  return (
    <Flex flexWrap='wrap' py='3' gap='3' justify='center' align='center' h='86.5vh' overflowY='auto'>
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
      <PlaceCard />
    </Flex>
  );
}
