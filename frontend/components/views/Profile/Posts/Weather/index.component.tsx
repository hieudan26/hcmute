import { StarIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@chakra-ui/react';
import { Badge, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export interface IWeatherProps {}

const api = {
  key: 'dea114e610dbf08cc4712e8d51bcbbe1',
  base: 'https://api.openweathermap.org/data/2.5/',
  query: 'ho%20chi%20minh',
};

export default function Weather(props: IWeatherProps) {
  const [curDate, setCurDate] = useState<Date>(new Date());
  const [weather, setWeather] = useState<any>(undefined);
  const [isError, setIsError] = useState<boolean>(false);
  const bgBox = useColorModeValue('white', 'backgroundBox.primary_darkMode');

  useEffect(() => {
    setCurDate(new Date());

    fetch(`${api.base}weather?q=${api.query}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  if (!weather || isError) {
    return (
      <Box position='fixed' width='full'>
        <Skeleton height='md' width='30%' px='4' rounded='lg' shadow='md' />
      </Box>
    );
  }

  return (
    <Box position='fixed' width='full'>
      {/* <Box height='fit-content' width='30%' bg='white' px='8' rounded='lg' shadow='md' py='6' mb='5'>
        Lumiere: Travel social networking site
        <Text my='4'>Sponsor: Duong Duc Thang </Text>
        <Text mt='4'>Sponsor: Nguyen Hieu Dan</Text>
      </Box> */}
      <Box height='fit-content' width='30%' bg={bgBox} px='4' rounded='lg' shadow='md' py='6'>
        <Flex px='4' align='center'>
          <Badge py='1' borderRadius='md' colorScheme='pink'>
            Thành phố Hồ Chí Minh
          </Badge>
          <Text>, Việt Nam</Text>
        </Flex>

        <Box p='4'>
          <Text fontSize='xs'>{curDate.toUTCString().slice(0, 16)}</Text>
        </Box>

        <Flex fontSize='15px' px='4' direction='column'>
          <Flex justify='space-between'>
            <Text>Temperature range:</Text>&nbsp;
            <Text>
              {weather && `${weather.main.temp_min}`}&ordm;C - {`${weather.main.temp_max}`}&ordm;C
            </Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Humidity:</Text>&nbsp;
            <Text>{weather && weather.main.humidity}%</Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Pressure:</Text>&nbsp;
            <Text>{weather && weather.main.pressure}hPa</Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Wind speed:</Text>&nbsp;
            <Text>{weather && weather.wind.speed}m/s</Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Chance of rain:</Text>&nbsp;
            <Text>{weather && weather.clouds.all}%</Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Visibility:</Text>&nbsp;
            <Text>{weather && Number(weather.visibility) / 1000}Km</Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Sunrise:</Text>&nbsp;
            <Text>{weather && new Date(weather.sys.sunrise).toTimeString()}</Text>
          </Flex>
          <Flex pt='2.5' justify='space-between'>
            <Text>Sunset:</Text>&nbsp;
            <Text>{weather && new Date(weather.sys.sunset).toTimeString()}</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
