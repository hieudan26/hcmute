import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Square, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { BsDashSquareDotted } from 'react-icons/bs';
import { HiTrash } from 'react-icons/hi';
import { IoMdMenu } from 'react-icons/io';
import { MdOutlineAttachMoney } from 'react-icons/md';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { setCurrentTrip, setTripDays } from '../../../../app/slices/currentTripSlice';
import { usePlacesProvincesByCountry_GetAll } from '../../../../hooks/queries/place';
import { ITripUpdate, useCUDTrip } from '../../../../hooks/queries/trip';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { IPlaceCountryResponse } from '../../../../models/place/place.model';
import {
  ITripDayResponseModel,
  ITripDayUpdateRequestModel,
  ITripPlaceFeesResponseModel,
  ITripPlaceResponseModel,
  ITripRequestModel,
  ITripsResponseModel,
  responseToUpdateTripDay,
} from '../../../../models/trip/trip.model';
import { toggleMessage } from '../../Message/index.component';
import ModalDeleteChooseBox from '../Modals/ModalDeleteChooseBox/index.component';
import ModalDetailChooseBox from '../Modals/ModalDetailChooseBox/index.component';
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
  const { mutationUpdateTripDays, mutationUpdateTrip } = useCUDTrip();

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

  const onChangeValue = (item: ITripPlaceFeesResponseModel) => {
    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          let day = { ...x };
          day.tripPlaces = day.tripPlaces.map((place) => {
            if (place.id === item.tripPlaceId) {
              let placeTemp = { ...place };
              placeTemp.tripPlaceFees = placeTemp.tripPlaceFees.map((fee) => {
                if (fee.id === item.id) {
                  let feeTemp = { ...item };
                  feeTemp.name = item.name;
                  feeTemp.description = item.description;
                  feeTemp.value = item.value;
                  return feeTemp;
                }
                return fee;
              });
              return placeTemp;
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

  const onDeleteFee = (item: ITripPlaceFeesResponseModel) => {
    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          let tempPlaces = { ...x };
          tempPlaces.tripPlaces = tempPlaces.tripPlaces.map((place) => {
            if (place.id === item.tripPlaceId) {
              let tempPlace = { ...place };
              let tempPlaceFeesFilter = tempPlace.tripPlaceFees.filter((fee) => fee.id !== item.id);
              tempPlace.tripPlaceFees = tempPlaceFeesFilter;
              setTripPlaceSelected(tempPlace);
              return tempPlace;
            } else {
              return place;
            }
          });
          return tempPlaces;
        } else {
          return x;
        }
      });

      dispatch(setTripDays(tempTrip.tripDays));
    }
  };

  const selectTripPlaceRedux = (item: ITripPlaceResponseModel) => {
    if (currentTrip) {
      currentTrip.tripDays.map((x) => {
        if (x.id === item.dayId) {
          x.tripPlaces.map((place) => {
            if (place.id === item.id) {
              setTripPlaceSelected(place);
            }
          });
        }
      });
    }
  };

  const save = async () => {
    if (currentTrip) {
      let data: ITripDayUpdateRequestModel[] = [];

      currentTrip.tripDays.map((x) => {
        data.push(responseToUpdateTripDay(x));
      });
      console.log(data);
      await mutationUpdateTripDays.mutateAsync({ tripId: currentTrip.id, params: data });
      let _update: ITripRequestModel = {
        title: currentTrip.title,
        maxDay: currentTrip.maxDay,
        maxMember: currentTrip.maxMember,
        totalPrice: currentTrip.totalPrice,
        description: currentTrip.description,
        startTime: currentTrip.startTime,
        startingPlace: currentTrip.startingPlace,
        status: currentTrip.tripDays.length ? 'Public' : (currentTrip.status as 'Public' | 'Private'),
        type: currentTrip.type as 'Plan' | 'Adventure',
        endTime: currentTrip.endTime,
        shortDescription: currentTrip.shortDescription,
      };
      let params: ITripUpdate = {
        id: currentTrip.id,
        params: _update,
      };

      await mutationUpdateTrip.mutateAsync(params);

      toggleMessage({
        type: 'success',
        message: 'Cập nhật thành công',
      });
    }
  };

  const resetTrip = () => {
    trip && dispatch(setCurrentTrip(trip));
  };

  const addTripPlaceFee = (item: ITripPlaceResponseModel) => {
    if (currentTrip) {
      let tempTrip = { ...currentTrip };
      tempTrip.tripDays = tempTrip.tripDays.map((x) => {
        if (x.id === tripDayChoose.id) {
          let tempPlaces = { ...x };
          tempPlaces.tripPlaces = tempPlaces.tripPlaces.map((place) => {
            if (place.id === item.id) {
              let tempFee: ITripPlaceFeesResponseModel = {
                id: place.tripPlaceFees.length + 1,
                description: '',
                isRequired: true,
                name: '',
                tripPlaceId: place.id,
                value: 0,
              };
              let tempPlace = { ...place, tripPlaceFees: [...item.tripPlaceFees, tempFee] };
              setTripPlaceSelected(tempPlace);
              return tempPlace;
            } else {
              return place;
            }
          });
          return tempPlaces;
        } else {
          return x;
        }
      });

      dispatch(setTripDays(tempTrip.tripDays));
    }
  };

  return (
    <>
      <ModalTripFees
        addTripPlaceFee={addTripPlaceFee}
        resetTrip={resetTrip}
        onEdit={onChangeValue}
        tripPlace={tripPlaceSelected}
        isOpen={isOpenFee}
        onClose={onCloseFee}
        onOpen={onOpenFee}
        saveChanges={save}
        onDeleteFee={onDeleteFee}
      />
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
        {trip && tripDayChoose.id !== 0 && (
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
                                        selectTripPlaceRedux(item);
                                        onOpenFee();
                                      }}
                                    />
                                    <Icon
                                      _hover={{ color: '#D0637C' }}
                                      fontSize='md'
                                      as={IoMdMenu}
                                      cursor='pointer'
                                      onClick={() => {
                                        selectTripPlaceRedux(item);
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
