package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.trip.*;
import backend.services.RequestJoinTripService;
import backend.services.TripService;
import io.swagger.models.auth.In;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.naming.NoPermissionException;
import javax.naming.NotContextException;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final RequestJoinTripService requestJoinTripService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BaseResponse> createTrip(@Valid @RequestBody CreateTripRequest createTripRequest) throws NoPermissionException {
        BaseResponse tripResponse = tripService.createTrip(createTripRequest);
        return new ResponseEntity<>(tripResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<BaseResponse> searchTrip(TripQueryParams tripQueryParams, PagingRequest pagingRequest) {
        var tripResponse = tripService.listAllPosts(pagingRequest, tripQueryParams);
        return new ResponseEntity<>(tripResponse, HttpStatus.CREATED);
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<BaseResponse> searchTrip(TripQueryParams tripQueryParams, PagingRequest pagingRequest, @PathVariable("id") String id) {
        var tripResponse = tripService.listAllPostsByUserId(pagingRequest, tripQueryParams, id);
        return new ResponseEntity<>(tripResponse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BaseResponse> updateTrip(@PathVariable Integer id, @Valid @RequestBody CreateTripRequest updateTripRequest) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = tripService.updateTrip(id, updateTripRequest);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getTrip(@PathVariable Integer id) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = tripService.getTrip(id);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    // other methods

    @PutMapping("/{tripId}/days")
    public ResponseEntity<BaseResponse> updateTripDays(@PathVariable Integer tripId, @RequestBody List<UpdateTripDayDTO> updateTripDays) throws NoPermissionException {
        BaseResponse updatedTrip = tripService.updateTripDays(tripId, updateTripDays);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    @PutMapping("/{tripId}/members")
    public ResponseEntity<BaseResponse> updateTripMembers(@PathVariable Integer tripId, @RequestBody List<AddTripMemberRequest> updateTripMembers) throws NoPermissionException {
        BaseResponse updatedTrip = tripService.updateTripMembers(tripId, updateTripMembers);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    @GetMapping("/{tripId}/members")
    public ResponseEntity<BaseResponse> getTripMembers(@PathVariable Integer tripId,@Parameter String key, PagingRequest pagingRequest) throws NoPermissionException, NotContextException {
        BaseResponse updatedTrip = tripService.getTripMembers(tripId, key, pagingRequest);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    @PostMapping("/{id}/reviews")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BaseResponse> reviewTrips(@PathVariable Integer id, @Valid @RequestBody CreateTripReview createTripReview) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = tripService.reviewTrip(id, createTripReview);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<BaseResponse> getReviewTrips(@PathVariable Integer id, PagingRequest pagingRequest) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = tripService.getReviewTrip(id, pagingRequest);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}/request")
    public ResponseEntity<BaseResponse> getRequests(@PathVariable Integer id,@RequestParam(required = false) String status, PagingRequest pagingRequest) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = requestJoinTripService.findByTripIdAndStatus(id, status, pagingRequest);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @PostMapping("/{id}/request")
    public ResponseEntity<BaseResponse> createRequest(@PathVariable Integer id) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = requestJoinTripService.createRequest(id);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @GetMapping("/{tripId}/request/user/{userId}")
    public ResponseEntity<BaseResponse> getRequest(@PathVariable Integer tripId, @PathVariable String userId) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = requestJoinTripService.findRequest(tripId, userId);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @PutMapping("/{tripId}/request")
    public ResponseEntity<BaseResponse> updateRequest(@PathVariable Integer tripId, @RequestBody UpdateRequestJoinTrip updateRequestJoinTrip) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = requestJoinTripService.updateRequest(tripId, updateRequestJoinTrip);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @GetMapping("/{tripId}/request/status")
    public ResponseEntity<BaseResponse> getStatus(@PathVariable Integer tripId) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = requestJoinTripService.getStatus(tripId);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{tripId}/request")
    public ResponseEntity<BaseResponse> cancelRequest(@PathVariable Integer tripId) throws NoPermissionException, NotContextException {
        BaseResponse tripResponse = requestJoinTripService.cancelRequest(tripId);
        return new ResponseEntity<>(tripResponse, HttpStatus.OK);
    }
}
