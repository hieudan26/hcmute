package backend.services;

import backend.common.Roles;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.User.UserFirstLoginRequest;
import backend.data.entity.Users;
import backend.mapper.UserMapper;
import backend.repositories.UserRepository;
import backend.utils.CognitoUtil;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import static java.lang.Thread.sleep;

@Service
@AllArgsConstructor
public class UserService {
    private CognitoUtil cognitoUtil;
    private UserMapper userMapper;
    private UserRepository userRepository;
    public BaseResponse createUser(UserFirstLoginRequest userFirstLoginRequest){
        String id = ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users user = userMapper.userFirstLoginRequestToUsers(userFirstLoginRequest);
        user.setId(id);
        user.setRole(Roles.USER.getRoleName());
        cognitoUtil.confirmUserFistLogin(id);
        return BaseResponse.builder().message("Create user successful")
                .data(userRepository.save(user))
                .build();
    }


}
