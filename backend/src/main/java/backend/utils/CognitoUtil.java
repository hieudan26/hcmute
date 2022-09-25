package backend.utils;
import backend.common.Roles;
import backend.common.UserAttributes;
import backend.security.configuration.JwtConfiguration;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.List;

@Component
@AllArgsConstructor
public class CognitoUtil {
    private JwtConfiguration jwtConfiguration;
    public void addUserToGroup(String username, String group){
        var addUserToGroupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(jwtConfiguration.getUserPoolId())
                .groupName(group)
                .username(username).build();
        CognitoIdentityProviderClient.create().adminAddUserToGroup(addUserToGroupRequest);
    }

    public void addUserToGroupUser(String username){
        addUserToGroup(username, Roles.USER.getRoleName());
    }

    public void addUserToGroupAdmin(String username){
        addUserToGroup(username, Roles.ADMIN.getRoleName());
    }

    public void updateUserAttributes(String username, List<AttributeType> attributeTypes){
        var adminUpdateUserAttributesRequest = AdminUpdateUserAttributesRequest.builder()
                        .userPoolId(jwtConfiguration.getUserPoolId())
                        .userAttributes(attributeTypes)
                        .username(username)
                        .build();
        CognitoIdentityProviderClient.create().
                adminUpdateUserAttributes(adminUpdateUserAttributesRequest);
    }

    public void confirmUserFistLogin(String username){
        updateUserAttributes(username,
                List.of(AttributeType.builder()
                    .name(UserAttributes.IS_FIRST_LOGIN.getAttributeName())
                    .value("false").build()));
    }

    public void disableUser(String username){
        var adminDisableUserRequest = AdminDisableUserRequest.builder()
                .userPoolId(jwtConfiguration.getUserPoolId())
                .username(username)
                .build();

        CognitoIdentityProviderClient.create().
                adminDisableUser(adminDisableUserRequest);
    }

    public void enableUser(String username){
        var adminEnableUserRequest = AdminEnableUserRequest.builder()
                .userPoolId(jwtConfiguration.getUserPoolId())
                .username(username)
                .build();

        CognitoIdentityProviderClient.create().
                adminEnableUser(adminEnableUserRequest);
    }

}
