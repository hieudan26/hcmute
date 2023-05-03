package backend.services;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.post.PostResponse;
import backend.data.dto.trip.*;
import backend.data.entity.*;
import backend.exception.NoRecordFoundException;
import backend.mapper.TripDayMapper;
import backend.mapper.TripMapper;
import backend.mapper.TripMemberMapper;
import backend.repositories.TripMemberRepository;
import backend.utils.PagingUtils;
import backend.utils.SearchSpecificationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.Named;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import backend.repositories.TripRepository;

import javax.naming.NoPermissionException;
import javax.naming.NotContextException;
import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripsRepository;

    private final TripMapper tripMapper;
    private final TripDayMapper tripDayMapper;

    private final TripMemberMapper tripMemberMapper;

    private final UserService userService;

    private final TripPlaceService tripPlaceService;
    private final TripPlaceFeeService tripPlaceFeeService;
    private final TripMemberRepository tripMembersRepository;



    @Transactional
    public BaseResponse createTrip(CreateTripRequest createTripRequest) {
        var user = userService.getUserFromContext();
        Trips trip = tripMapper.createTripRequestToTrip(createTripRequest);
        trip.setOwner(user);
        Trips savedTrip = tripsRepository.save(trip);
        return BaseResponse.builder().message("Find all trip successful.")
                .data(tripMapper.tripToTripDTO(savedTrip))
                .build();
    }

    @Transactional
    public BaseResponse getTrip(Integer id) throws NotContextException {
        Trips trip = tripsRepository.findById(id).orElseThrow(()-> new NotContextException("Not Found Trip"));
        return BaseResponse.builder().message("Find  trip successful.")
                .data(tripMapper.tripToTripDTO(trip))
                .build();
    }

    @Transactional
    public BaseResponse updateTrip(Integer id, CreateTripRequest updateTripRequest) throws NoPermissionException, NotContextException {
        var user = userService.getUserFromContext();

        Trips trip = tripsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + id));
        if (!user.equals(trip.getOwner())) {
            throw new NoPermissionException("You can't update other person's information.");
        }

        tripMapper.updateTripFromUpdateTripRequest(updateTripRequest, trip);
        Trips updatedTrip = tripsRepository.save(trip);
        return BaseResponse.builder().message("Find all trip successful.")
                .data(tripMapper.tripToTripDTO(updatedTrip))
                .build();
    }

    public BaseResponse listAllPosts(PagingRequest pagingRequest,  String searchKey){
        PagingResponse<TripResponse> pagingResponse;
        if(searchKey == null) {
           pagingResponse = new PagingResponse(
                    tripsRepository.findAll(null, PagingUtils.getPageable(pagingRequest))
                            .map(tripMapper::tripToTripDTO));
        } else {
            pagingResponse = new PagingResponse(
                    tripsRepository.findAllByTitleContainingIgnoreCase(searchKey, PagingUtils.getPageable(pagingRequest))
                            .map(tripMapper::tripToTripDTO));
        }


        return BaseResponse.builder().message("Find all trip successful.")
                .data(pagingResponse)
                .build();
    }

    @Transactional
    public BaseResponse updateTripDays(Integer tripId, List<UpdateTripDayDTO> updateTripDays) throws NoPermissionException {
        Users user = userService.getUserFromContext();
        Trips trip = tripsRepository.findById(tripId).orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + tripId));

        if (!user.equals(trip.getOwner())) {
            throw new NoPermissionException("You can't update other person's information.");
        }

        trip.getTripDays().removeAll(trip.getTripDays());


        for (UpdateTripDayDTO updateTripDayDTO : updateTripDays) {
            TripDays tripDay = null;
            if (updateTripDayDTO.getId() != null) {
                tripDay = trip.getTripDays().stream().filter(td -> td.getId().equals(updateTripDayDTO.getId())).findFirst().orElse(null);
            }


            if (tripDay == null) {
                tripDay = new TripDays();
                tripDay.setTrip(trip);
                trip.getTripDays().add(tripDay);
            }

            tripDay.getTripPlaces().removeAll(tripDay.getTripPlaces());


            tripDayMapper.updateTripDayFromUpdateTripDayDTO(updateTripDayDTO, tripDay);

            for (UpdateTripPlaceDTO updateTripPlaceDTO : updateTripDayDTO.getTripPlaces()) {
                log.error("Before updating trip place: " + tripDay.getTripPlaces().size());
                TripPlaces tripPlace = tripPlaceService.saveOrUpdateTripPlace(tripDay, updateTripPlaceDTO);
                log.error("After updating trip place: " + tripDay.getTripPlaces().size());
                tripPlace.setTripDay(tripDay);

                for (UpdateTripPlaceFeesDTO updateTripPlaceFeesDTO : updateTripPlaceDTO.getTripPlaceFees()) {
                    TripPlaceFees tripPlaceFees = tripPlaceFeeService.saveOrUpdateTripPlaceFees(tripPlace, updateTripPlaceFeesDTO);
                    tripPlaceFees.setTripPlace(tripPlace);
                }
            }
        }

        Trips updatedTrip = tripsRepository.save(trip);
        return BaseResponse.builder().message("Update trip successful.")
                .data(tripMapper.tripToTripDTO(updatedTrip))
                .build();
    }

    protected Trips getTripId(Integer tripId) throws EntityNotFoundException {
        Optional<Trips> optionalTrips = tripsRepository.findById(tripId);
        if(optionalTrips.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",tripId));
        }
        return optionalTrips.get();
    }

    @Transactional
    public BaseResponse updateTripMembers(Integer tripId, List<AddTripMemberRequest> addTripMemberRequests) {
        var trip = getTripId(tripId);
        trip.getTripMembers().removeAll(trip.getTripMembers());
        for (AddTripMemberRequest request : addTripMemberRequests) {
            var member = tripMemberMapper.addTripMemberToTripMembers(request);
            member.setTrip(trip);
            trip.getTripMembers().add(member);

        }
        var updatedTrip = tripsRepository.save(trip);
        return BaseResponse.builder()
                .message("Trip members added successfully.")
                .data((tripMapper.tripToTripDTO(updatedTrip)))
                .build();
    }
}
