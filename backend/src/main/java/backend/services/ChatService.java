package backend.services;

import backend.common.FriendStatuses;
import backend.data.dto.chat.CreateChatRoomRequest;
import backend.data.dto.chat.MessagePayLoad;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.entity.ChatRooms;
import backend.data.entity.Messages;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.MessageMapper;
import backend.repositories.ChatRoomRepository;
import backend.repositories.MessageRepository;
import backend.utils.PagingUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ChatService {
    private final MessageMapper mapper;
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    public void sendPrivateMessage(MessagePayLoad messagePayLoad, SimpMessageHeaderAccessor headerAccessor) throws NoPermissionException {
        if(headerAccessor == null || headerAccessor.getUser() == null){
            throw new NoPermissionException(String.format("You are not allowed to send message"));
        }
        String userId = headerAccessor.getUser().getName();
        ChatRooms chatRooms = getUserChatRoom(messagePayLoad.getRoom(),userId);
        Messages messages = messageRepository.save(mapper.fromMessagePayloadToMessages(messagePayLoad));
        for (var user : chatRooms.getMembers()){
            simpMessagingTemplate.convertAndSend("/topic/" + user.getId(),mapper.fromMessagesToMessagePayload(messages));
        }

    }

    public BaseResponse getMessages(PagingRequest pagingRequest, Integer roomId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        ChatRooms chatRooms = getUserChatRoom(roomId,userId);
        return BaseResponse.builder().message("Get messages successful.")
                .data(new PagingResponse(messageRepository
                        .findAllByRoom(PagingUtils.getPageable(pagingRequest),chatRooms)
                        .map(mapper::fromMessagesToMessagePayload)))
                .build();
    }

    public BaseResponse getAllChatRooms (PagingRequest pagingRequest) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users users = userService.getUser(userId);

        return BaseResponse.builder().message("Get rooms successful.")
                .data(new PagingResponse(chatRoomRepository
                        .findAllChatRoom(PagingUtils.getPageable(pagingRequest),users.getId())
                        .map(mapper::fromChatRoomsToChatRoomResponse)))
                .build();
    }

    public BaseResponse getChatRoomById (Integer roomId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        ChatRooms chatRooms = getUserChatRoom(roomId,userId);

        return BaseResponse.builder().message("Get rooms successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRooms))
                .build();
    }

    public ChatRooms getUserChatRoom (Integer roomId, String userId) throws NoPermissionException {
        ChatRooms chatRooms = getChatRoom(roomId);
        Users users = userService.getUser(userId);

        if(!isUserInChatRoom(roomId,users)){
            throw new NoPermissionException(String.format("User %s is not in room %d",userId,roomId));
        }

        return chatRooms;
    }

    public Optional<ChatRooms> getChatRoomByFriend(String userId, String friendId) throws NoPermissionException {
        Optional<ChatRooms> chatRoom = chatRoomRepository.findChatRoomsByFriend(userId,friendId);
        return chatRoom;
    }
    public BaseResponse isInChatRoom(String friendId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var noFriend =  userService.getFriendStatusResult(friendId)
                .equals(FriendStatuses.FRIEND.getStatus());

        if(!noFriend){
            return BaseResponse.builder().message("get status room successful.")
                    .data(Map.of("isInChatRoom",false,
                            "roomId",-1))
                    .build();
        }

        var room = getChatRoomByFriend(userId,friendId);

        if(room.isEmpty()){
            return BaseResponse.builder().message("get status room successful.")
                    .data(Map.of("isInChatRoom",false,
                            "roomId",-1))
                    .build();
        }

        return BaseResponse.builder().message("get status room successful.")
                .data(Map.of("isInChatRoom",true,
                        "roomId",room.get().getId()))
                .build();
    }
//
//    public BaseResponse getStatusRoom(String friendId) throws NoPermissionException {
//        return BaseResponse.builder().message("get status room successful.")
//                .data(Map.of("isInChatRoom",isInChatRoom(friendId)))
//                .build();
//    }

    public BaseResponse createChatRoom(CreateChatRoomRequest request) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        var noFriend = request.getFriends().stream()
                .filter(friend -> !userService.getFriendStatusResult(friend)
                        .equals(FriendStatuses.FRIEND.getStatus())).findAny();

        if(noFriend.isPresent()){
            throw new NoPermissionException(String.format("Users are not your friend"));
        }

        if(request.getFriends().size() == 1){
            var room = getChatRoomByFriend(userId,request.getFriends().get(0));
            if(room.isPresent())
                throw new NoPermissionException(String.format("You are in room chat"));
        }

        LocalDateTime time = LocalDateTime.now();
        if(request.getTime() != null){
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            time =  LocalDateTime.parse(request.getTime(),dateTimeFormatter);
        }

        ChatRooms chatRooms = ChatRooms.builder()
                .time(time)
                .members(request.getFriends().stream().map(user->userService.getUser(user)).collect(Collectors.toSet()))
                .build();


        chatRooms.getMembers().add(userService.getUser(userId));

        return BaseResponse.builder().message("Create room successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository
                        .save(chatRooms)))
                .build();
    }

    public BaseResponse leaveRoom(Integer roomId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return leaveRoom(roomId,userId);
    }

    public BaseResponse leaveRoom(Integer roomId, String userId) throws NoPermissionException {
        Users users = userService.getUser(userId);

        if(!isUserInChatRoom(roomId,users)){
            throw new NoPermissionException(String.format("User %s is not in room %d",userId,roomId));
        }
        ChatRooms chatRooms = getChatRoom(roomId);

        if(chatRooms.getMembers().size() == 2){
            throw new NoPermissionException(String.format("You cannot leave pair chat"));
        }
        chatRooms.getMembers().remove(users);

        return BaseResponse.builder().message("Leave room successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository
                        .save(chatRooms)))
                .build();
    }

    public boolean isUserInChatRoom (Integer roomId, Users users) {
        Integer count = chatRoomRepository.isUserInRoom(roomId,users.getId());
        if(count > 0){
            return true;
        }
        return false;
    }

    public ChatRooms getChatRoom(Integer roomId) throws NoPermissionException {
        Optional<ChatRooms> chatRooms = chatRoomRepository.findById(roomId);
        if(chatRooms.isEmpty()){
            throw new NoRecordFoundException("Not found chat room with id: "+roomId);
        }
        return chatRooms.get();
    }
}
