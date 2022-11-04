package backend.mapper;

import backend.data.dto.user.UpdateUserRequest;
import backend.data.dto.user.UserFirstLoginRequest;
import backend.data.entity.Users;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public abstract class UserMapper {
    public abstract Users userFirstLoginRequestToUsers(UserFirstLoginRequest userFirstLoginRequest);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract void update(@MappingTarget Users entity, UpdateUserRequest updateEntity);
}
