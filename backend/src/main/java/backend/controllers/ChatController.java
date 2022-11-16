package backend.controllers;

import backend.data.dto.chat.MessagePayLoad;
import backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import javax.naming.NoPermissionException;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final ChatService chatService;
    @MessageMapping("/chat")
    public void addUser( MessagePayLoad message) throws NoPermissionException {
        chatService.sendPrivateMessage(message);
    }
}
