package backend.mapper;

import backend.common.NotificationConstants;
import backend.data.dto.post.CreatePostRequest;
import backend.data.dto.post.PostResponse;
import backend.data.dto.post.UpdatePostRequest;
import backend.data.dto.socketdto.notification.NotificationsResponse;
import backend.data.entity.*;
import backend.exception.NoRecordFoundException;
import backend.repositories.*;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class NotificationMapper {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceRepository placeRepository;

    @Mapping(source = "fromUser", target = "fullName", qualifiedByName = "fromUserIdToFullName")
    @Mapping(source = "creationDate", target = "creationDate", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "status", target = "status")
    public abstract NotificationsResponse NotificationToNotificationResponse(Notifications notifications);

    @Named("fromUserIdToFullName")
    protected String fromUserToFullName(String fromUser) {
        Optional<Users> optionalUsers = userRepository.findById(fromUser);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",fromUser));
        }
        var users = optionalUsers.get();
        return String.format("%s %s",users.getFirstName(),users.getLastName());
    }

    @Named("fromLocalDateTimeToString")
    protected String fromLocalDateTimeToString(LocalDateTime time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return time.format(dateTimeFormatter);
    }

}
