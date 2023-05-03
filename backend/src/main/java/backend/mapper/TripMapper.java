package backend.mapper;

import backend.data.dto.trip.CreateTripRequest;
import backend.data.dto.trip.TripResponse;
import backend.data.entity.PlaceCategories;
import backend.data.entity.Places;
import backend.data.entity.Trips;
import backend.exception.NoRecordFoundException;
import backend.repositories.PlaceRepository;
import backend.repositories.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import javax.naming.NotContextException;
import javax.persistence.EntityNotFoundException;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class, TripDayMapper.class, TripMemberMapper.class, TripReviewMapper.class, TripPlaceMapper.class})
public abstract class TripMapper {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceRepository placeRepository;

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "startingPlace.id", target = "startingPlace")
    @Mapping(source = "tripDays", target = "tripDays")
    @Mapping(source = "tripMembers", target = "tripMembers")
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "fromLocalDateTimeToString")
    public abstract TripResponse tripToTripDTO(Trips trip);

    public List<TripResponse> tripsToTripDTOs(List<Trips> trips) {
        if(trips == null) {
            return List.of();
        }
        return trips.stream()
                .map(this::tripToTripDTO)
                .collect(Collectors.toList());
    }


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "tripDays", ignore = true)
    @Mapping(target = "tripMembers", ignore = true)
    @Mapping(target = "tripReviews", ignore = true)
    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "startingPlace", target = "startingPlace", qualifiedByName = "mapPlace")
    public abstract Trips createTripRequestToTrip(CreateTripRequest createTripRequest);

    protected LocalDateTime fromStringToLocalDateTime(String time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return LocalDateTime.parse(time,dateTimeFormatter);
    }

    public void updateTripFromUpdateTripRequest(CreateTripRequest updateTripRequest, @MappingTarget Trips trip) throws NotContextException {
        if (updateTripRequest.getTitle() != null) {
            trip.setTitle(updateTripRequest.getTitle());
        }
        if (updateTripRequest.getType() != null) {
            trip.setType(updateTripRequest.getType());
        }
        if (updateTripRequest.getMaxMember() != null) {
            trip.setMaxMember(updateTripRequest.getMaxMember());
        }
        if (updateTripRequest.getMaxDay() != null) {
            trip.setMaxDay(updateTripRequest.getMaxDay());
        }
        if (updateTripRequest.getStartingPlace() != null) {
            var place = placeRepository.findById(Math.toIntExact(updateTripRequest.getStartingPlace()));
            if(place.isEmpty()){
                throw new NotContextException("Not found starting place!");
            }
            trip.setStartingPlace(place.get());
        }
        if (updateTripRequest.getTotalPrice() != null) {
            trip.setTotalPrice(updateTripRequest.getTotalPrice());
        }
        if (updateTripRequest.getDescription() != null) {
            trip.setDescription(updateTripRequest.getDescription());
        }
        if (updateTripRequest.getStartTime() != null) {
            trip.setStartTime(fromStringToLocalDateTime(updateTripRequest.getStartTime()));
        }
        if (updateTripRequest.getEndTime() != null) {
            trip.setEndTime(fromStringToLocalDateTime(updateTripRequest.getEndTime()));
        }
        if (updateTripRequest.getStatus() != null) {
            trip.setStatus(updateTripRequest.getStatus());
        }
        if (updateTripRequest.getShortDescription() != null) {
            trip.setShortDescription(updateTripRequest.getShortDescription());
        }
    }
}


