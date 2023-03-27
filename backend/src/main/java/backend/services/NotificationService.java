package backend.services;

import backend.common.NotificationConstants;
import backend.common.PlaceStatuses;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.post.PostResponse;
import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.dto.socketdto.notification.NotificationResponse;
import backend.data.entity.ChatRooms;
import backend.data.entity.Messages;
import backend.data.entity.Notifications;
import backend.exception.NoRecordFoundException;
import backend.repositories.NotificationRepository;
import backend.security.configuration.CustomUserDetail;
import backend.utils.PagingUtils;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;
import javax.swing.text.html.Option;

import java.util.Optional;

import static backend.common.Roles.*;

@Service
@AllArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationRepository notificationRepository;
    public<T> void sendSocketMessage
    (Notifications notification) throws NoPermissionException {
        var noti = notificationRepository.save(notification);
        var notiResponse = NotificationResponse.builder().type(noti.getType())
                        .content(noti).build();
        simpMessagingTemplate.convertAndSend("/topic/admin", notiResponse);
    }

    public<T> void sendSocketMessage
            (Notifications notification,String id) throws NoPermissionException {
        var noti = notificationRepository.save(notification);
        var notiResponse = NotificationResponse.builder().type(noti.getType())
                .content(noti).build();
        simpMessagingTemplate.convertAndSend("/topic/"+id, notiResponse);
    }

    public Notifications getNotificationById(Integer id) {
        Optional<Notifications> notification = notificationRepository.findById(id);
        if(notification.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find Notification with Id: %s.",id));
        return  notification.get();
    }

    public BaseResponse listAllNotifications(PagingRequest pagingRequest, String userId){
        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        if (user.isHasRole(ROLE_ADMIN.getRoleName())) {
            userId = ROLE_ADMIN.getRoleName();
        }

        PagingResponse<Notifications> pagingResponse = new PagingResponse(
                notificationRepository.findAllByToUserOrderByReadAscCreationDateDesc(PagingUtils.getPageable(pagingRequest), userId));

        return BaseResponse.builder().message("Find notification successful.")
                .data(pagingResponse)
                .build();
    }
}
