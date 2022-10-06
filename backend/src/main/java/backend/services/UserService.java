package backend.services;

import backend.common.Roles;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.User.UpdateUserRequest;
import backend.data.dto.global.User.UserFirstLoginRequest;
import backend.data.dto.global.User.UserIdParams;
import backend.data.dto.global.User.UserQueryParams;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.UserMapper;
import backend.repositories.UserRepository;
import backend.utils.CognitoUtil;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.naming.NoPermissionException;
import java.util.Optional;

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
        return BaseResponse.builder().message("Create user successful.")
                .data(userRepository.save(user))
                .build();
    }

    public BaseResponse findAll(UserQueryParams query, Pageable pageable){
        return BaseResponse.builder().message("Find users successful.")
                .data(userRepository.findAll(SearchSpecificationUtils.searchBuilder(query),pageable))
                .build();
    }

    public BaseResponse findById(String id){
        return BaseResponse.builder().message("Find user successful.")
                .data(getUser(id))
                .build();
    }

    public BaseResponse adminBlockUser(UserIdParams userIdParams){
        Users users = getUser(userIdParams.getId());
        users.setDisable(true);
        cognitoUtil.disableUser(userIdParams.getId());
        return BaseResponse.builder().message("Disable user successful.")
                .data(userRepository.save(users))
                .build();
    }

    public BaseResponse adminUnlockUser(UserIdParams userIdParams){
        Users users = getUser(userIdParams.getId());
        users.setDisable(false);
        cognitoUtil.enableUser(userIdParams.getId());
        return BaseResponse.builder().message("Enable user successful")
                .data(userRepository.save(users))
                .build();
    }

    public BaseResponse updateUser(String id,UpdateUserRequest updateUserRequest) throws NoPermissionException {
        String userId = ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        if(!userId.equals(id))
            throw new NoPermissionException("You can't update other person's information.");

        Users users = getUser(id);
        userMapper.update(users,updateUserRequest);

        return BaseResponse.builder().message("Update user successful")
                .data(userRepository.save(users))
                .build();
    }
    public Users getUser(String id){
        Optional<Users> users = userRepository.findById(id);
        if(users.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",id));
        return  users.get();
    }
}
