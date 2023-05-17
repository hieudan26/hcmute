import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Icon, IconButton } from '@chakra-ui/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { ITripDayResponseModel, ITripsResponseModel } from '../../../../../models/trip/trip.model';
import { useAppSelector } from '../../../../../hooks/redux';
import { useGetPlaceById } from '../../../../../hooks/queries/place';
import { useGetLatLon } from '../../../../../hooks/queries/trip';
import utilService from '../../../../../services/util/util.service';

export interface ICreateMapProps {
  trip: ITripsResponseModel | undefined;
  tripDayChoose: ITripDayResponseModel;
}

export default function CreateMap(props: ICreateMapProps) {
  const { trip, tripDayChoose } = props;
  const currentTrip = useAppSelector((state) => state.currentTrip.value);
  const mapRef = useRef<HTMLDivElement>(null);
  const [nameCountry, setNameCountry] = useState<string>('');
  const [coordinatesCountry, setCoordinatesCountry] = useState<number[]>([10.577834750475034, 105.26873437056963]);
  const [markLocations, setMarkLocations] = useState<
    {
      name: string;
      latlng: string[];
    }[]
  >([]);
  const country = useGetPlaceById(currentTrip ? currentTrip.startingPlace.toString() : '', currentTrip !== undefined);
  const dataCoordinatesCountry = useGetLatLon(nameCountry, nameCountry !== '');

  useEffect(() => {
    if (currentTrip) {
      let locations: {
        name: string;
        latlng: string[];
      }[] = [];
      for (const day of currentTrip.tripDays) {
        if (day.id === tripDayChoose.id) {
          for (const place of day.tripPlaces) {
            const fetch = async () => {
              const dataCoor = ((await utilService.getLatLon(place.place.name)) as any)[0];
              locations.push({
                name: place.place.name,
                latlng: [dataCoor.lat, dataCoor.lon],
              });
            };
            fetch();
          }
        }
      }
      setMarkLocations(locations);
    }
  }, [currentTrip, tripDayChoose]);

  useEffect(() => {
    if (dataCoordinatesCountry.data) {
      let temp = (dataCoordinatesCountry.data as any)[0];
      let data: number[] = [];
      data.push(temp.lat, temp.lon);
      setCoordinatesCountry(data);
    }
  }, [dataCoordinatesCountry.data]);

  useEffect(() => {
    if (currentTrip && country.data) {
      setNameCountry(country.data.data.name);
    }
  }, [currentTrip, country.data]);

  useEffect(() => {
    if (mapRef.current !== null && currentTrip) {
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = null;
        // mapRef.current.innerHTML = '';
      }

      const map = L.map(mapRef.current).setView([coordinatesCountry[0], coordinatesCountry[1]], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const markerIcon = L.icon({
        iconUrl: '/images/markermap.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -35],
      });

      const locations = [
        { name: 'Miếu Bà Chúa Xứ', latlng: [10.677556078646532, 105.07645580885931] },
        { name: 'Chợ Châu Đốc', latlng: [10.711033411490188, 105.11856182605734] },
        { name: 'Lăng Thoại Ngọc Hầu', latlng: [10.682126976104312, 105.07911155304006] },
      ];

      locations.forEach((location, index) => {
        const latlng = L.latLng(location.latlng[0], location.latlng[1]);
        L.marker(latlng, { icon: markerIcon })
          .addTo(map)
          .bindTooltip(`${index + 1}. ${location.name}`, {
            permanent: true,
            direction: 'bottom',
            className: 'custom-tooltip',
          });
      });

      const latlngs = locations.map((location) => {
        return L.latLng(location.latlng[0], location.latlng[1]);
      });

      const polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
    }
  }, [coordinatesCountry, currentTrip, tripDayChoose, markLocations]);

  return (
    <Box h='84vh' mt='2' mr='1' rounded='md' shadow='md' maxH='84vh' overflow='scroll'>
      <Box ref={mapRef} h='full' />
    </Box>
  );
}
