import {
  Box,
  Stack,
  Flex,
  Icon,
  IconButton,
  Square,
  Text,
  useColorMode,
  useDisclosure,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsDashSquareDotted } from 'react-icons/bs';
import { HiTrash } from 'react-icons/hi';
import { IoMdMenu } from 'react-icons/io';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ModalDetailChooseBox from '../Modals/ModalDetailChooseBox/index.component';
import ModalDeleteChooseBox from '../Modals/ModalDeleteChooseBox/index.component';
import { ITripDayResponseModel, ITripPlaceResponseModel, ITripsResponseModel } from '../../../../models/trip/trip.model';
import Select, { ActionMeta, InputActionMeta, MultiValue, OnChangeValue } from 'react-select';
import {
  useFetchProvince,
  usePlacesProvincesByCountry,
  usePlacesProvincesByCountry_GetAll,
} from '../../../../hooks/queries/place';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { setCurrentTrip, setTripDays } from '../../../../app/slices/currentTripSlice';
import { MdOutlineAttachMoney } from 'react-icons/md';
import ModalTripFees from '../Modals/ModalTripFees/index.component';

export interface IChooseBoxProps {
  trip: ITripsResponseModel | undefined;
  tripDayChoose: ITripDayResponseModel;
  countryData: IPlaceCountryResponse | undefined;
}

type Item = {
  id: string;
  label: string;
  index: number;
};

export default function ChooseBox(props: IChooseBoxProps) {
  const { trip, tripDayChoose, countryData } = props;
  const currentTrip = useAppSelector((state) => state.currentTrip.value);
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenFee, onOpen: onOpenFee, onClose: onCloseFee } = useDisclosure();
  const [valueType, setValueType] = useState<string>('city'); //city - province - places
  const [valueProvinces, setValueProvinces] = useState<{ value: string; label: string }[]>([]);
  const [dataSelect, setDataSelect] = useState<{ value: string; label: string }[]>([]);
  const [urlCountry, setUrlCountry] = useState<string>('');
  const [isShowWarningMaxSelect, setIsShowWarningMaxSelect] = useState<boolean>(false);
  const [day, setDay] = useState<number>(1);
  const [currentTripDay, setCurrentTripDay] = useState<ITripDayResponseModel>(tripDayChoose);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [tripPlaceSelected, setTripPlaceSelected] = useState<ITripPlaceResponseModel | undefined>(undefined);
  const provinces = usePlacesProvincesByCountry_GetAll(urlCountry, urlCountry !== '');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentTrip) {
      currentTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          setCurrentTripDay(x);
        }
      });
    }
  }, [currentTrip, tripDayChoose]);

  useEffect(() => {
    if (currentTrip) {
      let index = currentTrip.tripDays.findIndex((x) => x.id === tripDayChoose.id);
      setDay(index + 1);
    }
  }, [tripDayChoose, currentTrip]);

  useEffect(() => {
    if (tripDayChoose.id !== 0) {
      let temp: { value: string; label: string }[] = [];
      tripDayChoose.provinces.map((item: IPlaceCountryResponse) => {
        temp.push({ value: item.url, label: item.name });
      });
      setValueProvinces(temp);
    }
  }, [tripDayChoose]);

  useEffect(() => {
    countryData && setUrlCountry(countryData.url);
  }, [countryData]);

  useEffect(() => {
    var tempData: { value: string; label: string }[] = [];
    provinces.data?.data.content.map((item: IPlaceCountryResponse) => {
      tempData.push({ value: item.url, label: item.name });
    });
    setDataSelect(tempData);
  }, [provinces.data]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newItems = Array.from(currentTripDay.tripPlaces);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    const filteredItems = newItems.filter((item) => item !== undefined);
    let tempTripDay = { ...currentTripDay };
    tempTripDay.tripPlaces = [];
    tempTripDay.tripPlaces = filteredItems;
    setCurrentTripDay(tempTripDay);

    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tempTripDay.id) {
          return tempTripDay;
        } else {
          return x;
        }
      });
      dispatch(setCurrentTrip(tempTrip));
    }
  };

  const changeSelectProvinces = async (
    selected: MultiValue<{
      value: string;
      label: string;
    }>,
    selectaction: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    const { action } = selectaction;
    if (action === 'clear') {
    } else if (action === 'select-option') {
    } else if (action === 'remove-value') {
      console.log('remove');
    }
    const arrValuesTag = selected.map((item) => {
      return { value: item.value, label: item.label };
    });
    if (arrValuesTag.length <= 2) {
      setValueProvinces(arrValuesTag);
      if (currentTrip) {
        var temp: IPlaceCountryResponse[] = [];
        provinces.data?.data.content.map((item: IPlaceCountryResponse) => {
          arrValuesTag.map((x) => {
            if (item.url === x.value) {
              temp.push(item);
            }
          });
        });
        let currentTripTemp = { ...currentTrip };
        currentTripTemp.tripDays = currentTripTemp.tripDays.map((x) => {
          if (x.id === tripDayChoose.id) {
            const newX = { ...x };
            newX.provinces = temp;
            return newX;
          } else {
            return x;
          }
        });
        dispatch(setTripDays(currentTripTemp.tripDays));
      }
    } else {
      setIsShowWarningMaxSelect(true);
      setTimeout(() => {
        setIsShowWarningMaxSelect(false);
      }, 3000);
    }
  };

  const deleteSelectedPlace = (id: number) => {
    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          let tempPlaces = { ...x };
          let tempPlacesFilter = tempPlaces.tripPlaces.filter((a) => a.id !== id);
          tempPlaces.tripPlaces = tempPlacesFilter;
          return tempPlaces;
        } else {
          return x;
        }
      });

      dispatch(setTripDays(tempTrip.tripDays));
    }
  };

  const saveDetailBox = (tripPlace: ITripPlaceResponseModel) => {
    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          let day = { ...x };
          day.tripPlaces = day.tripPlaces.map((place) => {
            if (place.id === tripPlace.id) {
              let tempPlace = { ...place };
              tempPlace.startTime = tripPlace.startTime;
              tempPlace.endTime = tripPlace.endTime;
              tempPlace.travelPrice = tripPlace.travelPrice;
              tempPlace.transport = tripPlace.transport;
              tempPlace.travelTime = tripPlace.travelTime;
              return tempPlace;
            }
            return place;
          });
          return day;
        }
        return x;
      });

      dispatch(setTripDays(tempTrip.tripDays));
    }
  };

  return (
    <>
      <ModalTripFees isOpen={isOpenFee} onClose={onCloseFee} onOpen={onOpenFee} />
      <ModalDetailChooseBox
        saveDetailBox={saveDetailBox}
        tripPlace={tripPlaceSelected}
        isOpen={isOpenDetail}
        onClose={onCloseDetail}
        onOpen={onOpenDetail}
      />
      <ModalDeleteChooseBox
        deleteSelectedPlace={deleteSelectedPlace}
        idPlace={idDelete}
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onOpen={onOpenDelete}
      />
      <Flex rounded='md' shadow='md' mx='3' my='2' direction='column' p='3' h='84vh' bg='white'>
        {tripDayChoose.id !== 0 && (
          <>
            <Box fontSize='sm' borderBottom='1px' borderBottomColor='gray.400' h='20'>
              <Flex align='center' mb={isShowWarningMaxSelect ? '1' : '2'} w='full'>
                <Text w='12%'>Ngày {day}: </Text>
                <Flex w='88%' align='center' fontSize='small' flexWrap='wrap'>
                  {valueProvinces.map((item, index) => (
                    <React.Fragment key={index}>
                      <Text>{item.label}</Text>
                      {index !== valueProvinces.length - 1 && <ChevronRightIcon />}
                    </React.Fragment>
                  ))}
                </Flex>
              </Flex>
              {isShowWarningMaxSelect && (
                <Text fontSize='xs' fontStyle='italic' color='red.500' mb='2'>
                  Max selected: 2
                </Text>
              )}
              <Select
                value={valueProvinces}
                id='selectWarna'
                instanceId='selectWarna'
                isMulti
                name='colors'
                className='basic-multi-select'
                classNamePrefix='select'
                options={dataSelect}
                placeholder='An Giang'
                onChange={changeSelectProvinces}
              />
            </Box>
            <Box overflow='auto'>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='items'>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {currentTripDay.tripPlaces.map((item: ITripPlaceResponseModel, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                          {(provided) => (
                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                              <Box mt='8' mx='2'>
                                <Flex align='center' justify='space-between'>
                                  <Flex gap='4' align='center'>
                                    <Icon as={BsDashSquareDotted} />
                                    <Square size='8' bg='#D0637C' color='white' rounded='md'>
                                      {index + 1}
                                    </Square>
                                    <Text>{item.place.name}</Text>
                                  </Flex>
                                  <Flex gap='4' align='center'>
                                    <Icon
                                      _hover={{ color: '#D0637C' }}
                                      fontSize='md'
                                      as={MdOutlineAttachMoney}
                                      cursor='pointer'
                                      onClick={() => {
                                        onOpenFee();
                                      }}
                                    />
                                    <Icon
                                      _hover={{ color: '#D0637C' }}
                                      fontSize='md'
                                      as={IoMdMenu}
                                      cursor='pointer'
                                      onClick={() => {
                                        setTripPlaceSelected(item);
                                        onOpenDetail();
                                      }}
                                    />
                                    <Icon
                                      _hover={{ color: '#D0637C' }}
                                      fontSize='md'
                                      as={HiTrash}
                                      cursor='pointer'
                                      onClick={() => {
                                        setIdDelete(item.id);
                                        onOpenDelete();
                                      }}
                                    />
                                  </Flex>
                                </Flex>
                              </Box>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}
