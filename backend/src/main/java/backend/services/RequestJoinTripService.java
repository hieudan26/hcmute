package backend.services;

import backend.common.NotificationConstants;
import backend.common.RequestJoinTripStatus;
import backend.common.TripStatus;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.post.PostResponse;
import backend.data.dto.trip.RequestJoinTripQuery;
import backend.data.dto.trip.UpdateRequestJoinTrip;
import backend.data.entity.ChatRoomMember;
import backend.data.entity.Notifications;
import backend.data.entity.RequestJoinTrip;
import backend.data.entity.TripMembers;
import backend.exception.NoRecordFoundException;
import backend.mapper.RequestJoinTripMapper;
import backend.repositories.RequestJoinTripRepository;
import backend.repositories.TripRepository;
import backend.utils.PagingUtils;
import backend.utils.SearchSpecificationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import javax.naming.NoPermissionException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static backend.common.Roles.ADMIN;

@Service
@RequiredArgsConstructor
public class RequestJoinTripService {
    private final RequestJoinTripRepository requestJoinTripRepository;
    private final RequestJoinTripMapper requestJoinTripMapper;
    private final UserService userService;
    private final TripService tripService;
    private final TripRepository tripsRepository;
    private final ChatService chatService;
    private final NotificationService notificationService;

    public BaseResponse listAllRequest(PagingRequest pagingRequest, RequestJoinTripQuery params) throws NoPermissionException {
        if(!isAdmin()) {
            throw new NoPermissionException("You don't have permission");
        }
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                requestJoinTripRepository.findAll(SearchSpecificationUtils.searchBuilder(params), PagingUtils.getPageable(pagingRequest))
                        .map(requestJoinTripMapper::requestJoinTripToRequestJoinTripResponse));

        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }
    private boolean isAdmin() {
        var isAdmin  = false;
        var isLogin = !SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass().equals(String.class);
        if(isLogin && userService.getUserFromContext().getRole().equals(ADMIN.name())) {
            isAdmin = true;
        }
        return isAdmin;
    }

    public BaseResponse findByTripIdAndStatus(Integer tripId, String status, PagingRequest pagingRequest) {
        PagingResponse<RequestJoinTrip> pagingResponse;
        if (status == null) {
            pagingResponse = new PagingResponse(
                    requestJoinTripRepository.findAllByTrips_Id(tripId, PagingUtils.getPageable(pagingRequest))
                            .map(requestJoinTripMapper::requestJoinTripToRequestJoinTripResponse));
        } else {
            pagingResponse = new PagingResponse(
                    requestJoinTripRepository.findAllByTrips_IdAndStatus(tripId, status, PagingUtils.getPageable(pagingRequest))
                            .map(requestJoinTripMapper::requestJoinTripToRequestJoinTripResponse));
        }
        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public RequestJoinTrip findByTripIdAndUserId(Integer tripId, String userId) {
        return requestJoinTripRepository.getByTrips_IdAndUser_IdAndStatus(tripId, userId, null)
                .orElseThrow(() -> new NoRecordFoundException("not found request"));
    }

    public BaseResponse findRequest(Integer tripId, String userId) {
        return BaseResponse.builder().message("Find all posts successful.")
                .data(requestJoinTripMapper
                        .requestJoinTripToRequestJoinTripResponse(findByTripIdAndUserId(tripId, userId)))
                .build();
    }

    public BaseResponse findByUserIdAndStatus(String userId, String status, PagingRequest pagingRequest) {
        PagingResponse<RequestJoinTrip> pagingResponse;
        if (status == null) {
            pagingResponse = new PagingResponse(
                    requestJoinTripRepository.findAllByUser_Id(userId, PagingUtils.getPageable(pagingRequest))
                            .map(requestJoinTripMapper::requestJoinTripToRequestJoinTripResponse));
        } else {
            pagingResponse = new PagingResponse(
                    requestJoinTripRepository.findAllByUser_IdAndStatus(userId, status, PagingUtils.getPageable(pagingRequest))
                            .map(requestJoinTripMapper::requestJoinTripToRequestJoinTripResponse));
        }
        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }
    public BaseResponse createRequest(Integer tripId) throws NoPermissionException {
        var trip = tripService.getTripId(tripId);
        var user = userService.getUserFromContext();
        if(requestJoinTripRepository.getByTrips_IdAndUser_IdAndStatus(tripId, user.getId(), null).isPresent()) {
            throw new NoPermissionException("You are already request join.");
        }

        if(trip.getStatus().equals(TripStatus.END.name())) {
            throw new NoPermissionException("You cannot join the end trip.");
        }

        if(trip.getTripMembers().stream().anyMatch(item -> item.getUser().equals(user)) || trip.getOwner().equals(user)) {
            throw new NoPermissionException("you are already in trip.");
        }

        var request = RequestJoinTrip.builder().trips(trip).user(user)
                .date(LocalDateTime.now())
                .status(RequestJoinTripStatus.PENDING.name()).build();

        var noti = Notifications.builder()
                .type(NotificationConstants.REQUEST_JOIN_TRIP.getStatus())
                .fromUser(ADMIN.getRoleName())
                .toUser(trip.getOwner().getId())
                .contentId(trip.getId())
                .description("Your trip has new request to join.")
                .status(false)
                .build();

        notificationService.sendSocketMessage(noti, trip.getOwner().getId());

        return BaseResponse.builder().message("request successful.")
                .data(requestJoinTripMapper
                        .requestJoinTripToRequestJoinTripResponse(requestJoinTripRepository.save(request)))
                .build();
    }

    public BaseResponse updateRequest(Integer tripId, UpdateRequestJoinTrip updateRequestJoinTrip) throws NoPermissionException {
        var request = findByTripIdAndUserId(tripId, updateRequestJoinTrip.getUserId());
        var user = userService.getUserFromContext();
        var trip = tripService.getTripId(tripId);

        if(!trip.getOwner().equals(user)) {
            throw new NoPermissionException("You don't have permission to do it.");
        }

        if(trip.getStatus().equals(TripStatus.END.name())) {
            throw new NoPermissionException("You cannot change the end trip.");
        }

        request.setStatus(RequestJoinTripStatus.valueOf(updateRequestJoinTrip.getStatus()).name());

        if(RequestJoinTripStatus.APPROVED.name().equals(request.getStatus())) {
            var newMember = TripMembers.builder()
                    .role("member")
                    .trip(trip)
                    .user(user)
                    .build();
            trip.getTripMembers().add(newMember);
            var newChatRoomMember = ChatRoomMember.builder().chatRoom(trip.getChatRoom())
                            .user(user)
                            .status("none").build();

            trip.getChatRoom().getMembers().add(newChatRoomMember);
            tripsRepository.save(trip);
            requestJoinTripRepository.delete(request);
            return BaseResponse.builder().message("update request successful.")
                    .data(Map.of("status","APPROVED"))
                    .build();
        }

        var noti = Notifications.builder()
                .type(NotificationConstants.REQUEST_JOIN_TRIP.getStatus())
                .fromUser(ADMIN.getRoleName())
                .toUser(updateRequestJoinTrip.getUserId())
                .contentId(trip.getId())
                .description("Your request join trip has bean "+request.getStatus().toLowerCase())
                .status(false)
                .build();

        notificationService.sendSocketMessage(noti, updateRequestJoinTrip.getUserId());

        return BaseResponse.builder().message("update request successful.")
                .data(requestJoinTripMapper
                        .requestJoinTripToRequestJoinTripResponse(requestJoinTripRepository.save(request)))
                .build();
    }

    public BaseResponse getStatus(Integer tripId) throws NoPermissionException {
        var user = userService.getUserFromContext();
        var trip = tripService.getTripId(tripId);
        var request = requestJoinTripRepository.getByTrips_IdAndUser_IdAndStatus(tripId, user.getId(), null);

        request.ifPresent(requestJoinTrip -> BaseResponse.builder().message("get status success")
                .data(Map.of("status", requestJoinTrip.getStatus()))
                .build());

        if(trip.getTripMembers().stream().anyMatch(item -> item.getUser().equals(user)) || trip.getOwner().equals(user)) {
            return BaseResponse.builder().message("get status success")
                    .data(Map.of("status", "MEMBER"))
                    .build();
        }

        return BaseResponse.builder().message("get status success")
                .data(Map.of("status", "NONE"))
                .build();
    }

}
