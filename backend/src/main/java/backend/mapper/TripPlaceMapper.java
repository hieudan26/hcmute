package backend.mapper;

import backend.data.dto.trip.TripDayDTO;
import backend.data.dto.trip.TripPlaceDTO;
import backend.data.dto.trip.UpdateTripPlaceDTO;
import backend.data.entity.Places;
import backend.data.entity.TripDays;
import backend.data.entity.TripPlaces;
import backend.exception.NoRecordFoundException;
import backend.repositories.PlaceRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class,TripPlaceFeeMapper.class})
public  abstract class TripPlaceMapper {
    @Autowired
    private PlaceRepository placeRepository;

    @Mapping(source = "places.id", target = "placeId")
    @Mapping(source = "tripDay.id", target = "dayId")
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "fromLocalDateTimeToString")
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

}
