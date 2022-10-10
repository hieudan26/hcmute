package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.user.UserFirstLoginRequest;
import backend.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/authentication")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_GUEST')")
public class AuthenticationController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse> createInformation(@Validated @RequestBody UserFirstLoginRequest userFirstLoginRequest){
        return ResponseEntity.ok(userService.createUser(userFirstLoginRequest));
    }
}
