package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.post.UpdatePostRequest;
import backend.data.dto.user.UpdateUserRequest;
import backend.data.dto.user.UserIdParams;
import backend.data.dto.user.UserQueryParams;
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

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<BaseResponse> getUsers(UserQueryParams query, PagingRequest pagingRequest){
        return ResponseEntity.ok(userService.findAll(query,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable("id") String id){
        return ResponseEntity.ok(userService.findById(id));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updateInformation(@PathVariable("id") String id,
                                                          @Validated @RequestBody UpdateUserRequest request) throws NoPermissionException {
        return ResponseEntity.ok(userService.updateUser(id,request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/disable")
    public ResponseEntity<BaseResponse> disableUser(@Validated @RequestBody UserIdParams userIdParams){
        return ResponseEntity.ok(userService.adminBlockUser(userIdParams));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/enable")
    public ResponseEntity<BaseResponse> enableUser(@Validated @RequestBody UserIdParams userIdParams){
        return ResponseEntity.ok(userService.adminUnlockUser(userIdParams));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}/posts")
    public ResponseEntity<BaseResponse> getUserPosts(PagingRequest pagingRequest,@Parameter String userId){
        return ResponseEntity.ok(postService.listAllPostsByUserId(pagingRequest, userId));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{userId}/posts/{postId}")
    public ResponseEntity<BaseResponse> getUserPost(@Parameter String userId
                                                    ,@Parameter String postId){
        return ResponseEntity.ok(postService.getPost(postId));
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/{userId}/images")
    public ResponseEntity<BaseResponse> getUserImages(PagingRequest pagingRequest, @Parameter String userId){
        return ResponseEntity.ok(userService.getImages(userId,pagingRequest));
    }

}
