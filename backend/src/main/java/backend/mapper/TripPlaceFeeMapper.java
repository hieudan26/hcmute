package backend.mapper;

import backend.data.dto.trip.TripPlaceFeeDTO;
import backend.data.entity.TripPlaceFees;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class})
public abstract class TripPlaceFeeMapper {

    @Mapping(source = "tripPlace.id", target = "tripPlaceId")
    public abstract TripPlaceFeeDTO tripPlaceFeeToTripPlaceFeeDTO(TripPlaceFees tripPlaceFee);

    public List<TripPlaceFeeDTO> tripPlaceFeesToTripPlaceFeeDTOs(List<TripPlaceFees> tripPlaceFees) {
        if(tripPlaceFees == null) {
            return List.of();
        }
        return tripPlaceFees.stream()
                .map(this::tripPlaceFeeToTripPlaceFeeDTO)
                .collect(Collectors.toList());
    }
}
