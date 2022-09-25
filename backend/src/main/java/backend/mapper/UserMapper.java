package backend.mapper;

import backend.data.dto.global.User.UpdateUserRequest;
import backend.data.dto.global.User.UserFirstLoginRequest;
import backend.data.entity.Users;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface  UserMapper {
    Users userFirstLoginRequestToUsers(UserFirstLoginRequest userFirstLoginRequest);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    void update(@MappingTarget Users entity, UpdateUserRequest updateEntity);
}
