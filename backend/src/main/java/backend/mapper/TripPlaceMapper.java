package backend.mapper;

import backend.common.AreaConstant;
import backend.data.dto.trip.TripDayDTO;
import backend.data.dto.trip.TripPlaceDTO;
import backend.data.dto.trip.UpdateTripPlaceDTO;
import backend.data.entity.Places;
import backend.data.entity.TripDays;
import backend.data.entity.TripPlaces;
import backend.exception.NoRecordFoundException;
import backend.repositories.PlaceRepository;
import io.swagger.models.auth.In;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class,TripPlaceFeeMapper.class, PlaceMapper.class})
public  abstract class TripPlaceMapper {
    @Autowired
    private PlaceRepository placeRepository;

    @Mapping(source = "tripDay.id", target = "dayId")
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "places", target = "place")
    public abstract TripPlaceDTO tripPlaceToTripPlaceDTO(TripPlaces tripPlace);

    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "endTime", target = "endTime  ", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "placeId", target = "places", qualifiedByName = "mapPlace")
    public abstract TripPlaces updateTripPlaceFromUpdateTripPlaceDTO(UpdateTripPlaceDTO updateTripPlaceDTO);

    public List<TripPlaceDTO> tripPlacesToTripPlaceDTOs(List<TripPlaces> tripPlaces) {
        if(tripPlaces == null) {
            return List.of();
        }
        return tripPlaces.stream()
                .map(this::tripPlaceToTripPlaceDTO)
                .collect(Collectors.toList());
    }


    @Named("mapPlace")
    protected Places mapPlace(Integer id) throws EntityNotFoundException {
        Optional<Places> optionalPlace = placeRepository.findById(id);
        if (optionalPlace.isEmpty()) {
            throw new NoRecordFoundException(String.format("Can't find place with Id: %s.", id));
        }
        return optionalPlace.get();
    }

    @Named("mapProvincesList")
    public Set<Places> mapProvinces(List<Integer> ids) throws EntityNotFoundException {
        Set<Places> places = new HashSet<>();
        for(var id: ids) {
            Optional<Places> optionalPlace = placeRepository.findById(id);
            if (optionalPlace.isEmpty() || !optionalPlace.get().getPlaceCategories().getName().equals(AreaConstant.PROVINCE.getTypeName())) {
                throw new NoRecordFoundException(String.format("Can't find province with Id: %s.", id));
            }
           places.add(optionalPlace.get());
        }
        return  places;
    }

}
