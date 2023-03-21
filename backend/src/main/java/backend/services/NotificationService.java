package backend.services;

import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.entity.ChatRooms;
import backend.data.entity.Messages;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;

@Service
@AllArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    public<T> void sendSocketMessage
    (T payLoad,String id) throws NoPermissionException {
      simpMessagingTemplate.convertAndSend("/topic/" + id, payLoad);
    }
}
