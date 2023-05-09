package backend.services;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.post.PostResponse;
import backend.data.dto.trip.*;
import backend.data.entity.*;
import backend.exception.NoRecordFoundException;
import backend.mapper.*;
import backend.repositories.TripMemberRepository;
import backend.repositories.TripReviewRepository;
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
import java.time.LocalDateTime;
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
    private final TripReviewMapper tripReviewMapper;

    private final TripMemberMapper tripMemberMapper;

    private final UserService userService;

    private final TripPlaceService tripPlaceService;
    private final TripPlaceFeeService tripPlaceFeeService;
    private final TripMemberRepository tripMembersRepository;
    private final TripReviewRepository tripReviewRepository;

    private final UserMapper userMapper;
    private final TripPlaceMapper tripPlaceMapper;




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

    public BaseResponse listAllPosts(PagingRequest pagingRequest, TripQueryParams params){
        PagingResponse<TripResponse> pagingResponse;
        if(params.getKey() == null) {
            params.setKey("");
        }
        if(params.getStatus() == null){
            if (params.getType() == null) {
                pagingResponse = new PagingResponse(
                        tripsRepository.findAllByTitleContainingIgnoreCase(params.getKey(), PagingUtils.getPageable(pagingRequest))
                                .map(tripMapper::tripToTripDTO));
            } else {
                pagingResponse = new PagingResponse(
                        tripsRepository.findAllByTitleContainingIgnoreCaseAndType(params.getKey(), params.getType(), PagingUtils.getPageable(pagingRequest))
                                .map(tripMapper::tripToTripDTO));
            }
        } else {
            if (params.getType() == null) {
                pagingResponse = new PagingResponse(
                        tripsRepository.findAllByTitleContainingIgnoreCaseAndStatus(params.getKey(), params.getStatus(),PagingUtils.getPageable(pagingRequest))
                                .map(tripMapper::tripToTripDTO));
            }else {
                pagingResponse = new PagingResponse(
                        tripsRepository.findAllByTitleContainingIgnoreCaseAndStatusAndType(params.getKey(), params.getStatus(), params.getType(), PagingUtils.getPageable(pagingRequest))
                                .map(tripMapper::tripToTripDTO));
            }

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

        var dayIndex = 0L;
        for (UpdateTripDayDTO updateTripDayDTO : updateTripDays) {
            TripDays tripDay = new TripDays();
            tripDay.setTrip(trip);
            trip.getTripDays().add(tripDay);
            tripDay.setOrdinal(dayIndex);
            dayIndex++;
            tripDay.getTripPlaces().removeAll(tripDay.getTripPlaces());
            tripDay.getProvinces().removeAll(tripDay.getProvinces());


            tripDayMapper.updateTripDayFromUpdateTripDayDTO(updateTripDayDTO, tripDay);
            tripDay.setProvinces(tripPlaceMapper.mapProvinces(updateTripDayDTO.getProvinces()));
            var placeIndex = 0L;
            for (UpdateTripPlaceDTO updateTripPlaceDTO : updateTripDayDTO.getTripPlaces()) {
                log.error("Before updating trip place: " + tripDay.getTripPlaces().size());
                TripPlaces tripPlace = tripPlaceService.saveOrUpdateTripPlace(tripDay, updateTripPlaceDTO);
                tripPlace.setOrdinal(placeIndex);
                placeIndex++;
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


    @Transactional
    public BaseResponse reviewTrip(Integer tripId, CreateTripReview createTripReview) throws NotContextException {
        var trip = getTripId(tripId);
        var user = userService.getUserFromContext();
        var newReview = new TripReviews();
        newReview.setReviewAt(LocalDateTime.now());
        newReview.setTrip(trip);
        newReview.setOwner(user);
        newReview.setContent(createTripReview.getContent());
        newReview.setRate(createTripReview.getRate());

        return BaseResponse.builder()
                .message("Trip members added successfully.")
                .data((tripReviewMapper.tripReviewToTripReviewDTO(tripReviewRepository.save(newReview))))
                .build();
    }

    @Transactional
    public BaseResponse getReviewTrip(Integer tripId, PagingRequest pagingRequest) throws NotContextException {
        var pagingResponse = new PagingResponse(
                tripReviewRepository.findAllByTrip_Id(tripId, PagingUtils.getPageable(pagingRequest))
                        .map(tripReviewMapper::tripReviewToTripReviewDTO));

        return BaseResponse.builder()
                .message("Trip members added successfully.")
                .data(pagingResponse)
                .build();
    }

    @Transactional
    public BaseResponse getTripMembers(Integer tripId,String key, PagingRequest pagingRequest) throws NotContextException {
        if(key == null) {
            key = "";
        }
        var pagingResponse = new PagingResponse(
                tripMembersRepository.findAllByTripWithSearch(tripId, key, PagingUtils.getPageable(pagingRequest))
                        .map(item -> userMapper.userToUserDTO(item.getUser())));

        return BaseResponse.builder()
                .message("Find Trip members successfully.")
                .data(pagingResponse)
                .build();
    }
}
