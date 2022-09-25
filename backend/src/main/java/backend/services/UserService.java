package backend.services;

import backend.common.Roles;
import backend.common.SpecificationConstant;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.User.UpdateUserRequest;
import backend.data.dto.global.User.UserFirstLoginRequest;
import backend.data.dto.global.User.UserIdParams;
import backend.data.dto.global.User.UserQueryParams;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.UserMapper;
import backend.repositories.UserRepository;
import backend.repositories.specification.SpecificationsBuilder;
import backend.utils.CognitoUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;
import javax.persistence.NoResultException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        return BaseResponse.builder().message("Create user successful.")
                .data(userRepository.save(user))
                .build();
    }

    public BaseResponse findAll(UserQueryParams query, Pageable pageable){
        return BaseResponse.builder().message("Find users successful.")
                .data(userRepository.findAll(searchBuilder(query),pageable))
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

    public Specification<Users> searchBuilder(String query){
        SpecificationsBuilder builder = new SpecificationsBuilder();
        Pattern pattern = Pattern.compile(SpecificationConstant.patternSearchCriteria);
        Matcher matcher = pattern.matcher(query + ",");
        while (matcher.find()) {
            builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
        }
        return builder.build();
    }

    public Specification<Users> searchBuilder(UserQueryParams query){
        SpecificationsBuilder builder = new SpecificationsBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(query);
        for (var field: UserQueryParams.class.getDeclaredFields()) {
            if(!jsonNode.get(field.getName()).isNull()){
                builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
            }
        }
        return builder.build();
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
