package backend.mapper;

import backend.data.dto.user.*;
import backend.data.entity.Friends;
import backend.data.entity.Users;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class})
public abstract class UserMapper {
    public abstract UserDTO userToUserDTO(Users user);

    public abstract Users userFirstLoginRequestToUsers(UserFirstLoginRequest userFirstLoginRequest);
    public abstract Users createAdminMapping(CreateAdminRequest createAdminRequest);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract void update(@MappingTarget Users entity, UpdateUserRequest updateEntity);

    @Mapping(source = "friend.id", target = "userId")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "friend.avatar", target = "avatar")
    @Mapping(source = "friend", target = "fullName", qualifiedByName = "fromUserToFullName")
    @BeanMapping(qualifiedByName = "setNumberForResponse")
    public abstract FriendResponse FriendsToFriendResponse(Friends friend);

    @Named("fromUserToFullName")
    protected String fromUserToFullName(Users users) {
        return String.format("%s %s",users.getFirstName(),users.getLastName());
    }

}
