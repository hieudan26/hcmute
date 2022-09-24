package backend.mapper;

import backend.data.dto.global.User.UserFirstLoginRequest;
import backend.data.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface  UserMapper {
    Users userFirstLoginRequestToUsers(UserFirstLoginRequest userFirstLoginRequest);
}
