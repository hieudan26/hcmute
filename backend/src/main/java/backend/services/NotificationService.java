package backend.services;

import backend.common.NotificationConstants;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.socketdto.SocketResponse;
import backend.data.dto.socketdto.notification.NotificationsResponse;
import backend.data.dto.socketdto.notification.ReadListNotificationRequest;
import backend.data.dto.socketdto.notification.ReadNotificationRequest;
import backend.data.entity.Notifications;
import backend.exception.NoRecordFoundException;
import backend.mapper.NotificationMapper;
import backend.repositories.NotificationRepository;
import backend.security.configuration.CustomUserDetail;
import backend.utils.PagingUtils;
import com.amazonaws.util.CollectionUtils;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static backend.common.Roles.*;

@Service
@AllArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    public<T> void sendSocketMessage
    (Notifications notification){
        var noti = notificationRepository.save(notification);
        var notiResponse = SocketResponse.builder().type(NotificationConstants.NOTIFICATION.getStatus())
                        .content(noti).build();
        simpMessagingTemplate.convertAndSend("/topic/admin", notiResponse);
    }

    public<T> void sendSocketMessage
            (Notifications notification,String id){
        var noti = notificationRepository.save(notification);
        var notiResponse = SocketResponse.builder().type(NotificationConstants.NOTIFICATION.getStatus())
                .content(noti).build();
        simpMessagingTemplate.convertAndSend("/topic/"+id, notiResponse);
    }

    public Notifications getNotificationById(Integer id) {
        Optional<Notifications> notification = notificationRepository.findById(id);
        if(notification.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find Notification with Id: %s.",id));
        return  notification.get();
    }

    public BaseResponse findNotificationById(Integer id) {
        return BaseResponse.builder().message("Find notification successful.")
                .data(getNotificationById(id))
                .build();
    }

    public BaseResponse readNotificationById(Integer id, ReadNotificationRequest request) {
        var noti = getNotificationById(id);
        if (request.getStatus() == null)
            request.setStatus(true);
        noti.setStatus(request.getStatus());
        return BaseResponse.builder().message("Find notification successful.")
                .data(notificationMapper.NotificationToNotificationResponse(notificationRepository.save(noti)))
                .build();
    }

    public BaseResponse readNotifications(ReadListNotificationRequest request) {
        if (request.getStatus() == null)
            request.setStatus(true);
        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        String userId = user.getUsername();
        if (user.isHasRole(ROLE_ADMIN.getRoleName())) {
            userId = ADMIN.getRoleName();
        }

        List<Notifications> notifications =
                notificationRepository.findAllByToUserAndStatusOrderByStatusAscCreationDateDesc(userId, false);

        Boolean finalStatus = request.getStatus();

        if (!CollectionUtils.isNullOrEmpty(request.getListNotifications())){
            notifications = notifications.stream().filter(item -> request.getListNotifications().contains(item.getId())).toList();
        }
        notifications.stream().forEach(item -> item.setStatus(finalStatus));
        notificationRepository.saveAll(notifications);

        return BaseResponse.builder().message("All notifications are readed")
                .data(null)
                .build();
    }


    public BaseResponse listAllNotifications(PagingRequest pagingRequest, Boolean status){

        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        String userId = user.getUsername();
        if (user.isHasRole(ROLE_ADMIN.getRoleName())) {
            userId = ADMIN.getRoleName();
        }
        PagingResponse<NotificationsResponse> pagingResponse;
        if (status == null) {
            pagingResponse = new PagingResponse(
                    notificationRepository.findAllByToUserOrderByStatusAscCreationDateDesc(
                                    PagingUtils.getPageable(pagingRequest), userId)
                            .map(notificationMapper::NotificationToNotificationResponse));
        } else {
            pagingResponse = new PagingResponse(
                    notificationRepository.findAllByToUserAndStatusOrderByStatusAscCreationDateDesc(
                                    PagingUtils.getPageable(pagingRequest), userId, status)
                            .map(notificationMapper::NotificationToNotificationResponse));
        }

        return BaseResponse.builder().message("Find notification successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse countAllNotifications(Boolean status){
        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        String userId = user.getUsername();
        if (user.isHasRole(ROLE_ADMIN.getRoleName())) {
            userId = ADMIN.getRoleName();
        }
        Integer count;
        if (status == null) {
            count = notificationRepository.countAllByToUserOrderByStatusAscCreationDateDesc(userId);
        } else {
            count = notificationRepository.countAllByToUserAndStatusOrderByStatusAscCreationDateDesc(userId, status);
        }

        return BaseResponse.builder().message("Find notification successful.")
                .data(Map.of("count", count))
                .build();
    }
}
