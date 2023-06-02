package backend.services;

import backend.common.ChatRoomType;
import backend.common.FriendStatuses;
import backend.common.NotificationConstants;
import backend.data.dto.socketdto.chat.CreateChatRoomRequest;
import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.socketdto.SocketResponse;
import backend.data.entity.ChatRoomMember;
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
import org.apache.commons.codec.binary.StringUtils;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.naming.NoPermissionException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
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
            throw new NoPermissionException("You are not allowed to send message");
        }

        String userId = headerAccessor.getUser().getName();
        ChatRooms chatRooms = getUserChatRoom(messagePayLoad.getRoom(),userId);
        if(chatRooms.getType().equals(ChatRoomType.SINGLE)){
            for(var member : chatRooms.getMembers()) {
                if(member.getUser().getId().equals(userId)) {
                    if(!member.getStatus().equals("none")) {
                        throw new NoPermissionException("You can't send message to user block you or blocked");
                    }
                }
            }
        }

//        if(!getChatRoomFriendStatus(chatRooms)){
//            throw new NoPermissionException("You are not friend");
//        }

        Messages messages = messageRepository.save(mapper.fromMessagePayloadToMessages(messagePayLoad));

        var notificationResponse = SocketResponse.builder()
                .type(NotificationConstants.MESSAGE.toString())
                .content(mapper.fromMessagesToMessagePayload(messages)).build();
        for (ChatRoomMember member : chatRooms.getMembers()) {
            if (member.getStatus().equals("block")) {
                // Skip blocked members
                continue;
            }
            simpMessagingTemplate.convertAndSend("/topic/" + member.getUser().getId(), notificationResponse);
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

    public BaseResponse getAllChatRooms (String type, PagingRequest pagingRequest) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users users = userService.getUser(userId);
        if(type == null) {
            return BaseResponse.builder().message("Get rooms successful.")
                    .data(new PagingResponse(chatRoomRepository
                            .findAllChatRoom(PagingUtils.getPageable(pagingRequest),users.getId())
                            .map(mapper::fromChatRoomsToChatRoomResponse)))
                    .build();
        }

        return BaseResponse.builder().message("Get rooms successful.")
                .data(new PagingResponse(chatRoomRepository
                        .findAllChatRoomByType(PagingUtils.getPageable(pagingRequest),users.getId(), ChatRoomType.valueOf(type))
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

    public Boolean getChatRoomFriendStatus(ChatRooms rooms) throws NoPermissionException {
        List<ChatRoomMember> members = rooms.getMembers().stream().toList();
        // Check if any member is blocked
        boolean anyBlocked = members.stream().anyMatch(member -> member.getStatus().equals("blocked"));
        return !anyBlocked;
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
        List<ChatRooms> chatRoom = chatRoomRepository.findChatRoomsByFriend(userId,friendId);
        if(chatRoom.size() <= 0) {
            return Optional.empty();
        }
        return chatRoom.stream().filter(item -> (item.getMembers().size() == 2 && item.getType().equals(ChatRoomType.SINGLE))).findFirst();
    }

    public BaseResponse isInChatRoom(String friendId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
//

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

    public BaseResponse IsUserInChatRoom(Integer roomId, String userId) throws NoPermissionException {
        var user = userService.getUser(userId);
        var room = isUserInChatRoom(roomId, user);

        if(!room){
            return BaseResponse.builder().message("get status room successful.")
                    .data(Map.of("isInChatRoom",false,
                            "roomId",-1))
                    .build();
        }

        return BaseResponse.builder().message("get status room successful.")
                .data(Map.of("isInChatRoom",true,
                        "roomId",roomId))
                .build();
    }
//
//    public BaseResponse getStatusRoom(String friendId) throws NoPermissionException {
//        return BaseResponse.builder().message("get status room successful.")
//                .data(Map.of("isInChatRoom",isInChatRoom(friendId)))
//                .build();
//    }

    public BaseResponse createChatRoom(CreateChatRoomRequest request) throws NoPermissionException {
        return BaseResponse.builder().message("Create room successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(createChatRoomEntities(request)))
                .build();
    }

    public ChatRooms createChatRoomEntities(CreateChatRoomRequest request) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

//        var noFriend = request.getFriends().stream()
//                .filter(friend -> !userService.getFriendStatusResult(friend)
//                        .equals(FriendStatuses.FRIEND.getStatus())).findAny();
//
//        if(noFriend.isPresent()){
//            throw new NoPermissionException(String.format("Users are not your friend"));
//        }

        if(request.getFriends().size() == 1){
            var room = getChatRoomByFriend(userId,request.getFriends().get(0));
            if(room.isPresent() && room.get().getType().equals(ChatRoomType.SINGLE))
                throw new NoPermissionException(String.format("You are in room chat"));
        } else {
            request.setType(ChatRoomType.GROUP.name());
        }

        LocalDateTime time = LocalDateTime.now();
        if(request.getTime() != null){
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            time =  LocalDateTime.parse(request.getTime(),dateTimeFormatter);
        }

        ChatRooms chatRooms = ChatRooms.builder()
                .time(time)
                .name(getName(request))
                .type(ChatRoomType.valueOf(request.getType()))
                .owner(userService.getUser(userId))
                .build();

        Set<ChatRoomMember> members = request.getFriends().stream()
                .map(userId2 -> ChatRoomMember.builder()
                        .user(userService.getUser(userId2))
                        .status("none")
                        .chatRoom(chatRooms)
                        .build())
                .collect(Collectors.toSet());

        members.add(ChatRoomMember.builder()
                .user(userService.getUser(userId))
                        .chatRoom(chatRooms)
                .status("none")
                .build());

        chatRooms.setMembers(members);

        return chatRoomRepository.save(chatRooms);

    }


    public String getName(CreateChatRoomRequest request) throws NoPermissionException {
        if (request.getName() != null && !request.getName().isBlank()) {
            return request.getName();
        }

        var chatName = new StringBuilder(userService.getUser(request.getFriends().get(0)).getFirstName());

        for (var i = 1;i < request.getFriends().size() && i < 4; i++) {
            chatName.append(", ");
            chatName.append(userService.getUser(request.getFriends().get(i)).getFirstName());

        }

        if (request.getFriends().size() > 4){
            chatName.append("...");
        }

        return chatName.toString();
    }

    public BaseResponse leaveRoom(Integer roomId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return leaveRoom(roomId,userId);
    }

    public BaseResponse updateRoom(Integer roomId, CreateChatRoomRequest request) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);
        if (!room.getOwner().getId().equals(userId) && room.getType().equals(ChatRoomType.GROUP)) {
            throw new NoPermissionException("you are not admin");
        }

        if (request.getName() != null) {
            room.setName(request.getName());
        }

        if (request.getType() != null) {
            room.setType(ChatRoomType.valueOf(request.getType()));
        }

        if (request.getOwnerId() != null && !room.getType().equals(ChatRoomType.SINGLE)) {
            var newOwner = userService.getUser(request.getOwnerId());
            if(!isUserInChatRoom(roomId, newOwner)) {
                throw new NoPermissionException("new Admin is not in this chat");
            }
            room.setOwner(newOwner);
        }

        if (!CollectionUtils.isEmpty(request.getFriends()) && !room.getType().equals(ChatRoomType.SINGLE)) {
            Set<ChatRoomMember> updatedMembers = new HashSet<>();
            if(request.getFriends().stream().filter(item -> item.equals(room.getOwner().getId())).findAny().isEmpty()) {
                request.getFriends().add(room.getOwner().getId());
            }
            for (String friendId : request.getFriends()) {
                Users friend = userService.getUser(friendId);
                ChatRoomMember member = room.getMembers().stream()
                        .filter(m -> m.getUser().equals(friend))
                        .findFirst()
                        .orElseGet(() -> ChatRoomMember.builder()
                                .user(friend)
                                .status("none")
                                .chatRoom(room)
                                .build());

                updatedMembers.add(member);
            }


            room.getMembers().retainAll(updatedMembers);
            room.getMembers().addAll(updatedMembers);
        }


        return BaseResponse.builder().message("Update rooms successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository.save(room)))
                .build();
    }


    public BaseResponse updateOwner(Integer roomId, String newOwnerId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);

        if (!room.getOwner().getId().equals(userId)) {
            throw new NoPermissionException("you are not admin");
        }
        var newOwner = userService.getUser(newOwnerId);

        if(!isUserInChatRoom(roomId, newOwner)) {
            throw new NoPermissionException("new Admin is not in this chat");
        }
        room.setOwner(newOwner);


        return BaseResponse.builder().message("Update rooms successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository.save(room)))
                .build();
    }

    public BaseResponse deleteUser(Integer roomId, String userId) throws NoPermissionException {
        String userContextId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);
        if (!room.getOwner().getId().equals(userContextId)) {
            throw new NoPermissionException("you are not admin");
        }
        var user = userService.getUser(userId);
        if (isUserInChatRoom(roomId, user)){
            room.getMembers().remove(
                    room.getMembers().stream().filter(member -> member.getUser().getId().equals(userId)).findFirst().orElseThrow(()-> new NoRecordFoundException("Not found user in this chat"))
            );
        }
        return BaseResponse.builder().message("Update rooms successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository.save(room)))
                .build();
    }

    public BaseResponse blockUser(Integer roomId) throws NoPermissionException {
        String userContextId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);
        var user = userService.getUser(userContextId);
        if (!isUserInChatRoom(roomId, user)){
            throw new NoPermissionException("You is not in this chat");
        }

        if (!room.getType().equals(ChatRoomType.SINGLE)){
            throw new NoPermissionException("You mustn't in single chat");
        }
        for(var member : room.getMembers()) {
            if(member.getUser().equals(user)) {
                member.setStatus("block");
            } else {
                member.setStatus("blocked");
            }
        }
        return BaseResponse.builder().message("Update rooms successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository.save(room)))
                .build();
    }

    public BaseResponse unlockUser(Integer roomId) throws NoPermissionException {
        String userContextId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);
        var user = userService.getUser(userContextId);
        if (!isUserInChatRoom(roomId, user)){
            throw new NoPermissionException("You is not in this chat");
        }

        if (!room.getType().equals(ChatRoomType.SINGLE)){
            throw new NoPermissionException("You mustn't in single chat");
        }
        for(var member : room.getMembers()) {
            if(member.getUser().equals(user)) {
                if(!member.getStatus().equals("block")) {
                    throw new NoPermissionException("You can't unlock user block you or not blocked");
                }
            }
        }
        for(var member : room.getMembers()) {
            if(member.getUser().equals(user)) {
                member.setStatus("none");
            } else {
                member.setStatus("none");
            }
        }
        return BaseResponse.builder().message("Update rooms successful.")
                .data(mapper.fromChatRoomsToChatRoomResponse(chatRoomRepository.save(room)))
                .build();
    }

    public BaseResponse getStatus(Integer roomId) throws NoPermissionException {
        String userContextId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);
        var user = userService.getUser(userContextId);
        if (!isUserInChatRoom(roomId, user)){
            throw new NoPermissionException("You is not in this chat");
        }
        String status = "none";
        for(var member : room.getMembers()) {
            if(member.getUser().equals(user)) {
                status = member.getStatus();
            }
        }

        return BaseResponse.builder().message("get room status successful.")
                .data(Map.of("status", status))
                .build();
    }

    public BaseResponse deleteRoom(Integer roomId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        var room = getChatRoom(roomId);
        if (!room.getOwner().getId().equals(userId)) {
            throw new NoPermissionException("you are not admin");
        }

        if (room.getType().equals(ChatRoomType.SINGLE)) {
            throw new NoPermissionException("Can't delete signle chat");
        }

        room.setDeleted(true);
        return BaseResponse.builder().message("Delete rooms successful.")
                .data(Map.of("success", true))
                .build();
    }

    public BaseResponse leaveRoom(Integer roomId, String userId) throws NoPermissionException {
        Users users = userService.getUser(userId);

        if(!isUserInChatRoom(roomId,users)){
            throw new NoPermissionException(String.format("User %s is not in room %d",userId,roomId));
        }
        ChatRooms chatRooms = getChatRoom(roomId);

        if( chatRooms.getType().equals(ChatRoomType.SINGLE)){
            throw new NoPermissionException(String.format("You cannot leave pair chat"));
        }

        if (chatRooms.getOwner().equals(users)) {
            if(chatRooms.getMembers().size() > 1) {
                var newOwner = chatRooms.getMembers().stream().filter(item -> !item.getUser().equals(users))
                        .findAny();
                newOwner.ifPresent(chatRoomMember -> chatRooms.setOwner(chatRoomMember.getUser()));
            }
        }

        chatRooms.getMembers().remove(chatRooms.getMembers().stream().filter(item -> !item.getUser().equals(users))
                .findFirst().orElseThrow(() -> new NoRecordFoundException("Not found chat room with id: "+roomId)));

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
        Optional<ChatRooms> chatRooms = chatRoomRepository.findChatRoomsByIdAndIsDeletedIsFalse(roomId);
        if(chatRooms.isEmpty()){
            throw new NoRecordFoundException("Not found chat room with id: "+roomId);
        }
        return chatRooms.get();
    }
}
