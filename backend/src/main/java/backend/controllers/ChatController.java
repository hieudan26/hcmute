package backend.controllers;

import backend.data.dto.socketdto.chat.CreateChatRoomRequest;
import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.naming.NoPermissionException;
import javax.validation.Valid;

@RequiredArgsConstructor
@Slf4j
@RestController("messages")
public class ChatController {
    private final ChatService chatService;

//    @PreAuthorize("hasAuthority('ROLE_USER')")
    @MessageMapping("/chat")
    public void sendMessage(SimpMessageHeaderAccessor headerAccessor, MessagePayLoad message) throws NoPermissionException {
        chatService.sendPrivateMessage(message, headerAccessor);
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/rooms")
    public ResponseEntity<BaseResponse> getRooms(PagingRequest pagingRequest) throws NoPermissionException {
        return ResponseEntity.ok(chatService.getAllChatRooms(pagingRequest));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PostMapping("/rooms")
    public ResponseEntity<BaseResponse> createRooms(@RequestBody CreateChatRoomRequest request) throws NoPermissionException {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.createChatRoom(request));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PutMapping("/rooms/{roomId}/leave")
    public ResponseEntity<BaseResponse> leaveRooms(@PathVariable Integer roomId) throws NoPermissionException {
        return ResponseEntity.ok(chatService.leaveRoom(roomId));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<BaseResponse> getRoom(@PathVariable Integer roomId) throws NoPermissionException {
        return ResponseEntity.ok(chatService.getChatRoomById(roomId));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<BaseResponse> updateRoom(@PathVariable Integer roomId, @RequestBody @Valid CreateChatRoomRequest request) throws NoPermissionException {
        return ResponseEntity.ok(chatService.updateRoom(roomId, request));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<BaseResponse> deleteRoom(@PathVariable Integer roomId) throws NoPermissionException {
        return ResponseEntity.ok(chatService.deleteRoom(roomId));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<BaseResponse> getMessages(PagingRequest pagingRequest, @PathVariable Integer roomId) throws NoPermissionException {
        return ResponseEntity.ok(chatService.getMessages(pagingRequest,roomId));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/rooms/friends/{friendId}")
    public ResponseEntity<BaseResponse> isInRoom(@PathVariable String friendId) throws NoPermissionException {
        return ResponseEntity.ok(chatService.isInChatRoom(friendId));
    }
}
