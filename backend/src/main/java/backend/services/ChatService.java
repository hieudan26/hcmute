package backend.services;

import backend.common.FriendStatuses;
import backend.data.dto.chat.MessagePayLoad;
import backend.mapper.MessageMapper;
import backend.repositories.MessageRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;

@Service
@AllArgsConstructor
public class ChatService {
    private final MessageMapper mapper;
    private final MessageRepository messageRepository;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    public void sendPrivateMessage(MessagePayLoad messagePayLoad) throws NoPermissionException {
//        String status = userService.getFriendStatusResult(messagePayLoad.getReceiver());
//        if(!status.equals(FriendStatuses.FRIEND.getStatus())){
//            throw new NoPermissionException("You are not friend");
//        }
        messageRepository.save(mapper.fromMessageRequestToMessages(messagePayLoad));
        simpMessagingTemplate.convertAndSend("/topic/messages/" + messagePayLoad.getReceiver(),messagePayLoad);
    }
}
