    package backend.services;

    import backend.data.dto.trip.UpdateTripPlaceFeesDTO;
    import backend.data.entity.TripPlaceFees;
    import backend.data.entity.TripPlaces;
    import backend.mapper.TripDayMapper;
    import backend.repositories.TripPlaceFeeRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    @Service
    @RequiredArgsConstructor
    public class TripPlaceFeeService {

        private final TripPlaceFeeRepository tripPlaceFeesRepository;

        private final TripDayMapper tripDayMapper;

        @Transactional
        public TripPlaceFees saveOrUpdateTripPlaceFees(TripPlaces tripPlace, UpdateTripPlaceFeesDTO updateTripPlaceFeesDTO) {
            TripPlaceFees tripPlaceFees =  new TripPlaceFees();
            tripPlace.getTripPlaceFees().add(tripPlaceFees);

            tripDayMapper.updateTripPlaceFeesFromUpdateTripPlaceFeesDTO(updateTripPlaceFeesDTO, tripPlaceFees);
            tripPlaceFees.setTripPlace(tripPlace); // Add this line
            return tripPlaceFees;
        }


    }
