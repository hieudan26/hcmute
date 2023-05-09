package backend.mapper;

import backend.data.dto.post.UpdatePostRequest;
import backend.data.dto.trip.*;
import backend.data.entity.Posts;
import backend.data.entity.TripDays;
import backend.data.entity.TripPlaceFees;
import backend.data.entity.TripPlaces;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class, TripPlaceMapper.class, PlaceMapper.class})
public abstract class TripDayMapper {

    @Mapping(source = "trip.id", target = "tripId")
    @Mapping(source = "date", target = "date", qualifiedByName = "fromLocalDateToString")
    @Mapping(source = "provinces", target = "provinces")
    public abstract TripDayDTO tripDayToTripDayDTO(TripDays tripDay);


    public List<TripDayDTO> tripDaysToTripDayDTOs(List<TripDays> tripDays) {
        if(tripDays == null) {
            return List.of();
        }
        return tripDays.stream()
                .map(this::tripDayToTripDayDTO)
                .collect(Collectors.toList());
    }

    @Mapping(source = "date", target = "date", qualifiedByName = "fromStringToLocalDate")
    @Mapping(target = "tripPlaces", ignore = true)
    @Mapping(target = "provinces", ignore = true)
    public abstract void updateTripDayFromUpdateTripDayDTO(UpdateTripDayDTO updateTripDayDTO, @MappingTarget TripDays tripDay);
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "endTime", target = "endTime  ", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(target = "tripPlaceFees", ignore = true)
    @Mapping(source = "placeId", target = "places", qualifiedByName = "mapPlace")
    public abstract void updateTripPlaceFromUpdateTripPlaceDTO(UpdateTripPlaceDTO updateTripPlaceDTO, @MappingTarget TripPlaces tripPlace);

    public abstract void updateTripPlaceFeesFromUpdateTripPlaceFeesDTO(UpdateTripPlaceFeesDTO updateTripPlaceFeesDTO, @MappingTarget TripPlaceFees tripPlaceFees);

}
