import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Icon, IconButton } from '@chakra-ui/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FaMapMarkerAlt } from 'react-icons/fa';

export interface ICreateMapProps {}

export default function CreateMap(props: ICreateMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current !== null) {
      const map = L.map(mapRef.current).setView([10.577834750475034, 105.26873437056963], 10);
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
  }, []);

  return (
    <Box h='84vh' mt='2' mr='1' rounded='md' shadow='md'>
      <Box ref={mapRef} h='full' />
    </Box>
  );
}
