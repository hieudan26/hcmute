package backend.mapper;

import backend.data.dto.socketdto.chat.ChatRoomResponse;
import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.dto.socketdto.chat.MessageResponse;
import backend.data.dto.socketdto.chat.RoomChatUserResponse;
import backend.data.entity.ChatRooms;
import backend.data.entity.Messages;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.ChatRoomRepository;
import backend.repositories.UserRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

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

    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "members", target = "members", qualifiedByName = "fromListUserToListUserResponse")
    public abstract ChatRoomResponse fromChatRoomsToChatRoomResponse(ChatRooms rooms);

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findById(userId);
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
    protected List<RoomChatUserResponse> fromListUserToListUserResponse(Set<Users> users) {
        return (List<RoomChatUserResponse>) users.stream().map(
                user -> RoomChatUserResponse.builder()
                        .userId(user.getId())
                        .avatar(user.getAvatar())
                        .fullName(fromUserToFullName(user))
                        .build()
        ).toList();
    }
}
