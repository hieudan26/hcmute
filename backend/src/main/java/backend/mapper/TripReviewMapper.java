package backend.mapper;

import backend.data.dto.trip.TripReviewDTO;
import backend.data.entity.TripReviews;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class})
public abstract class TripReviewMapper {

    @Mapping(source = "trip.id", target = "tripId")
    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "reviewAt", target = "reviewAt", qualifiedByName = "fromLocalDateTimeToString")
    public abstract TripReviewDTO tripReviewToTripReviewDTO(TripReviews tripReview);

    public List<TripReviewDTO> tripReviewsToTripReviewDTOs(List<TripReviews> tripReviews) {
        if(tripReviews == null) {
            return List.of();
        }
        return tripReviews.stream()
                .map(this::tripReviewToTripReviewDTO)
                .collect(Collectors.toList());
    }
}
