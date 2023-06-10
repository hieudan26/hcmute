package backend.services;

import backend.common.FriendStatuses;
import backend.common.Roles;
import backend.data.dto.authenthication.CheckEmailExistRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.user.*;
import backend.data.entity.Friends;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.UserMapper;
import backend.repositories.UserRepository;
import backend.repositories.specification.SearchSpecification;
import backend.security.configuration.CustomUserDetail;
import backend.utils.CognitoUtil;
import backend.utils.PagingUtils;
import backend.utils.S3Util;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.NoPermissionException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class UserService {
    private CognitoUtil cognitoUtil;
    private UserMapper userMapper;

    private UserRepository userRepository;
    private final String owner_key = "owner";
    private final String friend_key = "friend";

    private S3Util s3Util;


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

    public BaseResponse createAdmin(CreateAdminRequest createAdminRequest){
        Users user = userMapper.createAdminMapping(createAdminRequest);
        user.setRole(Roles.ADMIN.getRoleName());
        Users result = userRepository.save(user);
        return BaseResponse.builder().message("Create admin successful.")
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
    public BaseResponse getImages(String id, PagingRequest pagingRequest){
        return BaseResponse.builder().message("Create post successful.")
                .data(new PagingResponse(userRepository.getUserImages(id,PagingUtils.getPageable(pagingRequest))
                        .map(item -> item.getLink())))
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
           throw new NoPermissionException("Bạn không thể cập nhật thông tin của người khác.");

        Users users = getUser(id);

        if (!updateUserRequest.getAvatar().equals(users.getAvatar())){
            s3Util.deleteByUrl(users.getAvatar());
        }

        if (!updateUserRequest.getCoverBackground().equals(users.getCoverBackground())){
            s3Util.deleteByUrl(users.getCoverBackground());
        }

        userMapper.update(users,updateUserRequest);

        return BaseResponse.builder().message("Update user successful")
                .data(userRepository.save(users))
                .build();
    }

    public BaseResponse getFriends(String userId, FriendSearchRequest friendSearchRequest, PagingRequest pagingRequest){
        getUser(userId);
        PagingResponse pagingResponse;
        if(friendSearchRequest.getStatus() == null){
            if (friendSearchRequest.getKey() == null) {
                pagingResponse = new PagingResponse(
                        userRepository.getFriends(userId, PagingUtils.getPageable(pagingRequest))
                                .map(userMapper::FriendsToFriendResponse));
            } else {
                pagingResponse = new PagingResponse(
                        userRepository.getFriendsWithSearch(userId, friendSearchRequest.getKey(), PagingUtils.getPageable(pagingRequest))
                                .map(userMapper::FriendsToFriendResponse));
            }
        }else{
            if (friendSearchRequest.getKey() == null) {
                pagingResponse= new PagingResponse(
                        userRepository.getFriendsByStatus(userId, friendSearchRequest.getStatus() , PagingUtils.getPageable(pagingRequest))
                                .map(userMapper::FriendsToFriendResponse));
            } else {
                pagingResponse= new PagingResponse(
                        userRepository.getFriendsByStatusWithSearch(userId, friendSearchRequest.getStatus(), friendSearchRequest.getKey(), PagingUtils.getPageable(pagingRequest))
                                .map(userMapper::FriendsToFriendResponse));
            }

        }
        return BaseResponse.builder().message(String.format("Get friends of user %s successful.",userId))
                .data(pagingResponse)
                .build();
    }

    public BaseResponse getFriendStatus(String userId, String friendId){
        return BaseResponse.builder().message(String.format("Get status of friend %s successful.",friendId))
                .data(Map.of("status",getFriendStatusResult(friendId)))
                .build();
    }
    public String getFriendStatusResult(String friendId){
        String id = ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return checkCoupleStatus(id, friendId);
    }

    public String checkCoupleStatus(String userId, String friendId){
        Users users = getUser(userId);
        var friend = users.getFriends().stream()
                .filter(friends -> friends.getFriend().getId().equals(friendId))
                .findFirst();
        String status = FriendStatuses.NO_FRIEND.getStatus();
        if(friend.isPresent()){
            status = friend.get().getStatus() == null ? FriendStatuses.NO_FRIEND.getStatus() : friend.get().getStatus();
        }

        return status;
    }

    public BaseResponse updateStatusFriend(UpdateStatusFriendsRequest friendsRequest){
        String id = ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users users = getUser(id);
        Users friend = getUser(friendsRequest.getFriendId());

        if(friendsRequest.getStatus().equals("add")){
            addFriend(users,friend,friendsRequest);
        }

        if(friendsRequest.getStatus().equals("remove")){
            deleteFriend(users,friend,friendsRequest);
        }

        return BaseResponse.builder().message(String.format("Get friend of user %s successful.",id))
                .data(userMapper.FriendsToFriendResponse(
                        getUser(id)
                                .getFriends().stream()
                                .filter(friends -> friends.getFriend().equals(friend))
                                .findFirst().get()))
                .build();

    }
    public void addFriend(Users users, Users friend, UpdateStatusFriendsRequest friendsRequest){
        Optional<Friends> optionalFriends =
                users.getFriends().stream().filter(friends -> friends.getFriend().equals(friend)).findFirst();

        Map map = new HashMap();
            if(optionalFriends.isEmpty()){
                map.put(owner_key,FriendStatuses.INVITED.getStatus());
                map.put(owner_key,FriendStatuses.PENDING.getStatus());

            } else if (optionalFriends.get().getStatus().equals(FriendStatuses.NO_FRIEND.getStatus())){
                users.getFriends()
                        .stream().filter(friends -> friends.getFriend().equals(friend))
                        .findFirst().get().setStatus(FriendStatuses.INVITED.getStatus());
                friend.getFriends()
                        .stream().filter(friends -> friends.getFriend().equals(users))
                        .findFirst().get().setStatus(FriendStatuses.PENDING.getStatus());

            } else if(optionalFriends.get().getStatus().equals(FriendStatuses.PENDING.getStatus())){
                users.getFriends()
                        .stream().filter(friends -> friends.getFriend().equals(friend))
                        .findFirst().get().setStatus(FriendStatuses.FRIEND.getStatus());
                friend.getFriends()
                        .stream().filter(friends -> friends.getFriend().equals(users))
                        .findFirst().get().setStatus(FriendStatuses.FRIEND.getStatus());
            }
        saveFriends(users,friend, map,friendsRequest);
    }

    public void deleteFriend(Users users, Users friend,UpdateStatusFriendsRequest friendsRequest){
        Optional<Friends> optionalFriends =
                users.getFriends().stream().filter(friends -> friends.getFriend().equals(friend)).findFirst();

        Map map = new HashMap();
        if(optionalFriends.isEmpty()){
            map.put(owner_key,FriendStatuses.NO_FRIEND.getStatus());
            map.put(owner_key,FriendStatuses.NO_FRIEND.getStatus());

        } else if (!optionalFriends.get().getStatus().equals(FriendStatuses.BLOCKING.getStatus())){
            users.getFriends()
                    .stream().filter(friends -> friends.getFriend().equals(friend))
                    .findFirst().get().setStatus(FriendStatuses.NO_FRIEND.getStatus());
            friend.getFriends()
                    .stream().filter(friends -> friends.getFriend().equals(users))
                    .findFirst().get().setStatus(FriendStatuses.NO_FRIEND.getStatus());

        }
        saveFriends(users,friend, map, friendsRequest);
    }

    public void saveFriends(Users users, Users friend, Map mapStatus, UpdateStatusFriendsRequest friendsRequest){
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        if(friendsRequest.getTime() == null)
            friendsRequest.setTime(LocalDateTime.now().format(dateTimeFormatter));

        LocalDateTime.parse(friendsRequest.getTime(),dateTimeFormatter);

        if (!mapStatus.isEmpty()){
            Friends newFriendOwner = Friends.builder()
                    .owner(users)
                    .friend(friend)
                    .status(FriendStatuses.INVITED.getStatus())
                    .time(LocalDateTime.parse(friendsRequest.getTime(),dateTimeFormatter)).build();
            users.getFriends().add(newFriendOwner);

            Friends newFriendFriend = Friends.builder()
                    .owner(friend)
                    .friend(users)
                    .status(FriendStatuses.PENDING.getStatus())
                    .time(LocalDateTime.parse(friendsRequest.getTime(),dateTimeFormatter)).build();
            friend.getFriends().add(newFriendFriend);
        }

        users.getFriends()
                .stream().filter(friends -> friends.getFriend().equals(friend))
                .findFirst().get().setTime(LocalDateTime.parse(friendsRequest.getTime(),dateTimeFormatter));

        friend.getFriends()
                .stream().filter(friends -> friends.getFriend().equals(users))
                .findFirst().get().setTime(LocalDateTime.parse(friendsRequest.getTime(),dateTimeFormatter));

        userRepository.save(users);
        userRepository.save(friend);
    }

    public Users getUser(String id){
        Optional<Users> users = userRepository.findByIdAndIsDisableIsFalse(id);
        if(users.isEmpty())
            throw new NoRecordFoundException(String.format("Không tìm thấy người dùng với Id: %s.", id));
        return  users.get();
    }

    public BaseResponse findUsers(PagingRequest pagingRequest,String key){
        PagingResponse pagingResponse = new PagingResponse<Users>(
                userRepository.findAll(SearchSpecification.containsTextInAttributes(key, List.of("firstName","lastName")), PagingUtils.getPageable(pagingRequest)));

        return BaseResponse.builder().message("Find users successful.")
                .data(pagingResponse)
                .build();
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

    public BaseResponse getAdviceFriends(PagingRequest pagingRequest){
        String userId = ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users users= getUser(userId);

        PagingResponse pagingResponse = new PagingResponse(
                userRepository.getAdviceFriends(userId, users.getVillage(),users.getDistrict(),users.getCity(),users.getCountry(),PagingUtils.getPageable(pagingRequest))
                        .map(this::mamAdviceFriend));

        return BaseResponse.builder().message("get advice friends")
                .data(pagingResponse)
                .build();
    }

    public AdviceFriendResponse mamAdviceFriend(Users friend){
        return AdviceFriendResponse.builder()
                .avatar(friend.getAvatar())
                .fullName(friend.getLastName() + " "+ friend.getFirstName())
                .country(friend.getCountry())
                .province(friend.getCity())
                .friendStatus(getFriendStatusResult(friend.getId()))
                .id(friend.getId())
                .build();
    }

    public Users getUserFromContext(){
        String id = ((UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return getUser(id);
    }
}
