package backend.controllers;

import backend.data.dto.chat.MessagePayLoad;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.post.PostQueryParams;
import backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.NoPermissionException;

@RequiredArgsConstructor
@Slf4j
@RestController("messages")
public class ChatController {
    private final ChatService chatService;

    @MessageMapping("/chat")
    public void sendMessage( MessagePayLoad message) throws NoPermissionException {
        chatService.sendPrivateMessage(message);
    }
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/{friendId}")
    public ResponseEntity<BaseResponse> getMessages(PagingRequest pagingRequest, @PathVariable String friendId) throws NoPermissionException {
        return ResponseEntity.ok(chatService.getMessages(pagingRequest,friendId));
    }
}
