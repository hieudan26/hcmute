package backend.services;

import backend.common.Roles;
import backend.data.dto.authenthication.CheckEmailExistRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.user.UpdateUserRequest;
import backend.data.dto.user.UserFirstLoginRequest;
import backend.data.dto.user.UserIdParams;
import backend.data.dto.user.UserQueryParams;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.UserMapper;
import backend.repositories.UserRepository;
import backend.security.configuration.CustomUserDetail;
import backend.utils.CognitoUtil;
import backend.utils.PagingUtils;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.NoPermissionException;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private CognitoUtil cognitoUtil;
    private UserMapper userMapper;
    private UserRepository userRepository;

    @Transactional(rollbackFor = Exception.class)
    public BaseResponse createUser(UserFirstLoginRequest userFirstLoginRequest){
        CustomUserDetail userDetail = ((CustomUserDetail)SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        Users user = userMapper.userFirstLoginRequestToUsers(userFirstLoginRequest);
        user.setId(userDetail.getUsername());
        user.setRole(Roles.USER.getRoleName());
        user.setEmail(userDetail.getEmail());

        Users result = userRepository.save(user);
        cognitoUtil.confirmUserFistLogin(userDetail.getUsername());
        return BaseResponse.builder().message("Create user successful.")
                .data(result)
                .build();
    }

    public BaseResponse findAll(UserQueryParams query, PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse<Users>(
                userRepository.findAll(SearchSpecificationUtils.searchBuilder(query), PagingUtils.getPageable(pagingRequest)));

        return BaseResponse.builder().message("Find users successful.")
                .data(pagingResponse)
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

    public BaseResponse checkCognitoUserExist(CheckEmailExistRequest checkEmailExistRequest){
        if(cognitoUtil.checkUserExist(checkEmailExistRequest.getEmail())) {
            return BaseResponse.builder().message("Email existed")
                    .data(Map.of("isExisted", true))
                    .build();
        }

        return BaseResponse.builder().message("Email doesn't exist")
                .data(Map.of("isExisted", false))
                .build();
    }

}
