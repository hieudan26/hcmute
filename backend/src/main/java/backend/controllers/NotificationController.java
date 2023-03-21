//package backend.controllers;
//
//import backend.data.dto.socketdto.chat.MessagePayLoad;
//import backend.services.ChatService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.naming.NoPermissionException;
//
//@RequiredArgsConstructor
//@Slf4j
//@RestController("notification")
//public class NotificationController {
//    private final ChatService chatService;
//
//    //    @PreAuthorize("hasAuthority('ROLE_USER')")
//    @MessageMapping("/chat")
//    public void sendMessage(SimpMessageHeaderAccessor headerAccessor, MessagePayLoad message) throws NoPermissionException {
//        chatService.sendPrivateMessage(message, headerAccessor);
//    }
//}
