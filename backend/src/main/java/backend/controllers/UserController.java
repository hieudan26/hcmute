package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.user.UpdateUserRequest;
import backend.data.dto.user.UserIdParams;
import backend.data.dto.user.UserQueryParams;
import backend.services.UserService;
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

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/{id}")
    public ResponseEntity<BaseResponse> updateInformation(@PathVariable("id") String id,
                                                          @Validated @RequestBody UpdateUserRequest request) throws NoPermissionException {
        return ResponseEntity.ok(userService.updateUser(id,request));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/disable")
    public ResponseEntity<BaseResponse> disablekUser(@Validated @RequestBody UserIdParams userIdParams){
        return ResponseEntity.ok(userService.adminBlockUser(userIdParams));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/enable")
    public ResponseEntity<BaseResponse> enableUser(@Validated @RequestBody UserIdParams userIdParams){
        return ResponseEntity.ok(userService.adminUnlockUser(userIdParams));
    }

}
