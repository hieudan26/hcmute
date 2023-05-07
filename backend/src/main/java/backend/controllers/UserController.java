package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.post.UpdatePostRequest;
import backend.data.dto.user.*;
import backend.services.PostService;
import backend.services.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.naming.NoPermissionException;

@Slf4j
@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PostService postService;

    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity<BaseResponse> getUsers(UserQueryParams query, PagingRequest pagingRequest){
        return ResponseEntity.ok(userService.findAll(query,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable("id") String id){
        return ResponseEntity.ok(userService.findById(id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updateInformation(@PathVariable("id") String id,
                                                          @Validated @RequestBody UpdateUserRequest request) throws NoPermissionException {
        return ResponseEntity.ok(userService.updateUser(id,request));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PutMapping("/disable")
    public ResponseEntity<BaseResponse> disableUser(@Validated @RequestBody UserIdParams userIdParams){
        return ResponseEntity.ok(userService.adminBlockUser(userIdParams));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PutMapping("/enable")
    public ResponseEntity<BaseResponse> enableUser(@Validated @RequestBody UserIdParams userIdParams){
        return ResponseEntity.ok(userService.adminUnlockUser(userIdParams));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<BaseResponse> createAdmin(@Validated @RequestBody CreateAdminRequest request){
        return ResponseEntity.ok(userService.createAdmin(request));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{userId}/posts")
    public ResponseEntity<BaseResponse> getUserPosts(PagingRequest pagingRequest,@PathVariable String userId){
        return ResponseEntity.ok(postService.listAllPostsByUserId(pagingRequest, userId));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{userId}/posts/{postId}")
    public ResponseEntity<BaseResponse> getUserPost(@PathVariable String userId
                                                    ,@PathVariable String postId){
        return ResponseEntity.ok(postService.getPost(postId));
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/{userId}/images")
    public ResponseEntity<BaseResponse> getUserImages(PagingRequest pagingRequest, @PathVariable String userId){
        return ResponseEntity.ok(userService.getImages(userId,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{userId}/friends")
    public ResponseEntity<BaseResponse> getUserFriends(PagingRequest pagingRequest,
                                                       @PathVariable String userId,
                                                       FriendSearchRequest request
                                                       ){
        return ResponseEntity.ok(userService.getFriends(userId, request, pagingRequest));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PutMapping("/{userId}/friends")
    public ResponseEntity<BaseResponse> updateStatusFriends(
            @PathVariable String userId,
            @Validated @RequestBody UpdateStatusFriendsRequest updateStatusFriendsRequest
    ){
        return ResponseEntity.ok(userService.updateStatusFriend(updateStatusFriendsRequest));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @GetMapping("/{userId}/friends/{friendId}")
    public ResponseEntity<BaseResponse> getUserFriendStatus(@PathVariable String userId,
                                                       @PathVariable String friendId
    ){
        return ResponseEntity.ok(userService.getFriendStatus(userId, friendId));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @GetMapping("/friends")
    public ResponseEntity<BaseResponse> getAdviceFriends(PagingRequest pagingRequest
    ){
        return ResponseEntity.ok(userService.getAdviceFriends(pagingRequest));
    }

}
