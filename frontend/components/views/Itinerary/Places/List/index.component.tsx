import { Box, Center, Flex, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import PlaceCard from '../Card/index.component';
import { ITripDayResponseModel, ITripPlaceResponseModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';
import { useGetPlaceById, usePlacesPlacesByCountryProvince } from '../../../../../hooks/queries/place';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { ArrayTenTemp } from '../../../../../pages/experiences';
import { IPlaceCountryResponse } from '../../../../../models/place/place.model';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { setCurrentTrip } from '../../../../../app/slices/currentTripSlice';
import { addDaysToDate, formatDateddMMYYYYtoDate, formatTimePost } from '../../../../../utils';

export interface IPlacesListProps {
  trip: ITripsResponseModel | undefined;
  countryData: IPlaceCountryResponse | undefined;
  tripDayChoose: ITripDayResponseModel;
}

export default function PlacesList(props: IPlacesListProps) {
  const { trip, countryData, tripDayChoose } = props;
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [urlCountry, setUrlCountry] = useState<string>('');
  const [urlProvinceOne, setUrlProvinceOne] = useState<string>('');
  const [urlProvinceTwo, setUrlProvinceTwo] = useState<string>('');
  const [currentTripPlaces, setCurrentTripPlace] = useState<ITripPlaceResponseModel[]>([]);
  const currentTrip = useAppSelector((state) => state.currentTrip.value);
  const placesOne = usePlacesPlacesByCountryProvince(
    {
      pagination: undefined,
      type: undefined,
      urlCountry: urlCountry,
      urlProvince: urlProvinceOne,
    },
    urlCountry !== '' && urlProvinceOne !== ''
  );
  const placesTwo = usePlacesPlacesByCountryProvince(
    {
      pagination: undefined,
      type: undefined,
      urlCountry: urlCountry,
      urlProvince: urlProvinceTwo,
    },
    urlCountry !== '' && urlProvinceTwo !== ''
  );

  useEffect(() => {
    if (currentTrip) {
      currentTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          setCurrentTripPlace(x.tripPlaces);
        }
      });
    }
  }, [currentTrip, tripDayChoose]);

  useEffect(() => {
    if (currentTrip) {
      currentTrip.tripDays.map((item) => {
        if (item.id === tripDayChoose.id) {
          if (item.provinces.length >= 1) {
            setUrlProvinceOne(item.provinces[0].url);
          } else {
            setUrlProvinceOne('');
          }

          if (item.provinces.length >= 2) {
            setUrlProvinceTwo(item.provinces[1].url);
          } else {
            setUrlProvinceTwo('');
          }
        }
      });
    }
  }, [currentTrip, tripDayChoose]);

  useEffect(() => {
    countryData && setUrlCountry(countryData.url);
  }, [countryData]);

  const handleScroll = () => {
    // const { scrollTop, clientHeight, scrollHeight } = ref.current!;
    // const newPosition = scrollTop + clientHeight;
    // if (newPosition === scrollHeight && placesOne.hasNextPage) {
    //   placesOne.fetchNextPage();
    // }
  };

  const selectPlace = (item: IPlaceCountryResponse) => {
    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          let tempDate = currentTrip.startTime.split(' ')[0];
          var dateObject = formatDateddMMYYYYtoDate(tempDate);
          var startTime = `${addDaysToDate(dateObject, x.tripPlaces.length === 0 ? 0 : x.tripPlaces.length - 1)} 00:00:00`;
          const newTripPlace: ITripPlaceResponseModel = {
            id: x.tripPlaces.length === 0 ? 1 : x.tripPlaces[x.tripPlaces.length - 1].id + 1,
            dayId: x.id,
            endTime: startTime,
            startTime: startTime,
            ordinal: x.tripPlaces.length === 0 ? 1 : x.tripPlaces[x.tripPlaces.length - 1].ordinal + 1,
            place: item,
            transport: 'Xe buýt',
            travelPrice: '100000',
            travelTime: '5 hour',
            tripPlaceFees: [],
          };
          const newX = { ...x, tripPlaces: [...x.tripPlaces, newTripPlace] };
          return newX;
        } else {
          return x;
        }
      });
      dispatch(setCurrentTrip(tempTrip));
    }
  };

  return (
    <Flex
      ref={ref}
      flexWrap='wrap'
      py='3'
      gap='3'
      justify={
        (urlProvinceOne !== '' &&
          placesOne.data &&
          placesOne.data.pages.length > 0 &&
          placesOne.data.pages[0].data.content.length > 0) ||
        (urlProvinceTwo !== '' &&
          placesTwo.data &&
          placesTwo.data.pages.length > 0 &&
          placesTwo.data.pages[0].data.content.length > 0)
          ? 'flex-start'
          : 'center'
      }
      align={
        (urlProvinceOne !== '' &&
          placesOne.data &&
          placesOne.data.pages.length > 0 &&
          placesOne.data.pages[0].data.content.length > 0) ||
        (urlProvinceTwo !== '' &&
          placesTwo.data &&
          placesTwo.data.pages.length > 0 &&
          placesTwo.data.pages[0].data.content.length > 0)
          ? 'start'
          : 'center'
      }
      h='86vh'
      overflowY='auto'
      onScroll={handleScroll}
    >
      {urlProvinceOne !== '' &&
      placesOne.data &&
      placesOne.data.pages.length > 0 &&
      placesOne.data.pages[0].data.content.length > 0 ? (
        placesOne.data?.pages
          .concat(
            urlProvinceTwo !== '' &&
              placesTwo.data &&
              placesTwo.data.pages.length > 0 &&
              placesTwo.data.pages[0].data.content.length > 0
              ? placesTwo.data.pages
              : []
          )
          .flatMap((page) => page.data.content)
          .map((item: IPlaceCountryResponse, index: number) => {
            const isPlaceAlreadySelected = currentTripPlaces.some((place) => place.place.id === item.id);
            return isPlaceAlreadySelected ? null : <PlaceCard place={item} key={item.id} selectPlace={selectPlace} />;
          })
      ) : (
        <Text textAlign='center'>Không có dữ liệu</Text>
      )}
    </Flex>
  );
}
