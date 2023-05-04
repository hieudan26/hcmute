package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.trip.AddTripMemberRequest;
import backend.data.dto.trip.CreateTripRequest;
import backend.data.dto.trip.TripResponse;
import backend.data.dto.trip.UpdateTripDayDTO;
import backend.services.TripService;
import io.swagger.models.auth.In;
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

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BaseResponse> createTrip(@Valid @RequestBody CreateTripRequest createTripRequest) {
        BaseResponse tripResponse = tripService.createTrip(createTripRequest);
        return new ResponseEntity<>(tripResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<BaseResponse> searchTrip(@RequestParam(required = false) String key, PagingRequest pagingRequest) {
        var tripResponse = tripService.listAllPosts(pagingRequest, key);
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


}
