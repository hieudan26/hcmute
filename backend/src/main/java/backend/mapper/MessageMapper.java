package backend.mapper;

import backend.data.dto.chat.MessagePayLoad;
import backend.data.entity.Messages;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.UserRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;


@Mapper(componentModel = "spring")
public abstract class MessageMapper {
    @Autowired
    private UserRepository userRepository;

    @Mapping(source = "receiver", target = "receiver", qualifiedByName = "fromStringToUsers")
    @Mapping(source = "sender", target = "sender", qualifiedByName = "fromStringToUsers")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromStringToLocalDateTime")
    public abstract Messages fromMessagePayloadToMessages(MessagePayLoad messagePayLoad);

    @Mapping(source = "receiver.id", target = "receiver")
    @Mapping(source = "sender.id", target = "sender")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    public abstract MessagePayLoad fromMessagesToMessagePayload(Messages messages);

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findById(userId);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",userId));
        }
        return optionalUsers.get();
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

}
