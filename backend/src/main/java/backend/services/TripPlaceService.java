package backend.services;

import backend.data.dto.trip.UpdateTripPlaceDTO;
import backend.data.entity.TripDays;
import backend.data.entity.TripPlaces;
import backend.data.entity.Trips;
import backend.mapper.TripDayMapper;
import backend.repositories.TripPlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TripPlaceService {

    private final TripPlaceRepository tripPlaceRepository;

    private final TripDayMapper tripDayMapper;

    @Transactional
    public TripPlaces saveOrUpdateTripPlace(TripDays tripDay, UpdateTripPlaceDTO updateTripPlaceDTO) {
        TripPlaces tripPlace = null;
        if (updateTripPlaceDTO.getId() != null) {
            tripPlace = tripDay.getTripPlaces().stream().filter(tp -> tp.getId().equals(updateTripPlaceDTO.getId())).findFirst().orElse(null);
        }

        if (tripPlace == null) {
            tripPlace = new TripPlaces();
            tripPlace.setTripDay(tripDay); // Add this line
            tripDay.getTripPlaces().add(tripPlace);
        } else {
            tripPlace.getTripPlaceFees().removeAll(tripPlace.getTripPlaceFees());

        }

        tripDayMapper.updateTripPlaceFromUpdateTripPlaceDTO(updateTripPlaceDTO, tripPlace);
        return tripPlace;
    }
}
