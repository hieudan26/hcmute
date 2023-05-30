package backend.mapper;

import backend.common.ChatRoomType;
import backend.data.dto.socketdto.chat.ChatRoomResponse;
import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.dto.socketdto.chat.MessageResponse;
import backend.data.dto.socketdto.chat.RoomChatUserResponse;
import backend.data.entity.ChatRoomMember;
import backend.data.entity.ChatRooms;
import backend.data.entity.Messages;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.ChatRoomRepository;
import backend.repositories.UserRepository;
import com.twilio.rest.chat.v3.Channel;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Mapper(componentModel = "spring")
public abstract class MessageMapper {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Mapping(source = "room", target = "room", qualifiedByName = "fromIdToChatRoom")
    @Mapping(source = "sender", target = "sender", qualifiedByName = "fromStringToUsers")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromStringToLocalDateTime")
    public abstract Messages fromMessagePayloadToMessages(MessagePayLoad messagePayLoad);

    @Mapping(source = "room.id", target = "room")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "sender.id", target = "sender")
    @Mapping(source = "sender.avatar", target = "avatar")
    @Mapping(source = "sender", target = "fullName", qualifiedByName = "fromUserToFullName")
    public abstract MessageResponse fromMessagesToMessagePayload(Messages messages);

    public ChatRoomResponse fromChatRoomsToChatRoomResponse(ChatRooms rooms) {
        // Your custom logic here
        ChatRoomResponse response = new ChatRoomResponse();
        response.setTime(fromLocalDateTimeToString(rooms.getTime()));
        var list = fromListUserToListUserResponse(rooms.getMembers());
        for(var item : list) {
            if(item.getUserId().equals(rooms.getOwner().getId())) {
                item.setIsAdmin(true);
            }
        }
        response.setMembers(list);
        response.setOwner(userToUserResponse(rooms.getOwner()));
        response.setId(rooms.getId());
        response.setType(rooms.getType().name());
        if (rooms.getType().equals(ChatRoomType.GROUP)) {
            response.setName(rooms.getName());
        } else {
            String idUserContext = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            var users = rooms.getMembers().stream().filter(user -> user.getUser().getId().equals(idUserContext))
                    .findAny().orElseThrow(()-> new NoRecordFoundException(" not found other user in this chat"));
            response.setName(fromUserToFullName(users.getUser()));
        }
        return response;
    }

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findByIdAndIsDisableIsFalse(userId);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",userId));
        }
        return optionalUsers.get();
    }

    @Named("fromIdToChatRoom")
    protected ChatRooms fromIdToChatRoom(Integer roomId) throws EntityNotFoundException {
        Optional<ChatRooms> optionalChatRooms = chatRoomRepository.findById(roomId);
        if(optionalChatRooms.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find room with Id: %s.",roomId));
        }
        return optionalChatRooms.get();
    }

    @Named("fromLocalDateTimeToString")
    protected String fromLocalDateTimeToString(LocalDateTime time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return time.format(dateTimeFormatter);
    }

    @Named("fromStringToLocalDateTime")
    protected LocalDateTime fromStringToLocalDateTime(String time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return LocalDateTime.parse(time,dateTimeFormatter);
    }

    @Named("fromUserToFullName")
    protected String fromUserToFullName(Users users) {
        return String.format("%s %s",users.getFirstName(),users.getLastName());
    }

    @Named("fromListUserToListUserResponse")
    protected List<RoomChatUserResponse> fromListUserToListUserResponse(Set<ChatRoomMember> users) {
        return users.stream().map(
                this::ChatRoomMemberToUserResponse
        ).toList();
    }

    public  RoomChatUserResponse ChatRoomMemberToUserResponse(ChatRoomMember user) {
        return RoomChatUserResponse.builder()
                .userId(user.getUser().getId())
                .avatar(user.getUser().getAvatar())
                .fullName(fromUserToFullName(user.getUser()))
                .status(user.getStatus())
                .isAdmin(false)
                .build();
    }

    public  RoomChatUserResponse userToUserResponse(Users user) {
        return RoomChatUserResponse.builder()
                .userId(user.getId())
                .avatar(user.getAvatar())
                .fullName(fromUserToFullName(user))
                .status("none")
                .isAdmin(false)
                .build();
    }
}
