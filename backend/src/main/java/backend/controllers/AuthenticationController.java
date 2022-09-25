package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.User.UserFirstLoginRequest;
import backend.data.entity.Users;
import backend.services.UserService;
import backend.utils.CognitoUtil;
import backend.utils.S3Util;
import backend.utils.SMSUltil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.Cacheable;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_GUEST')")
public class AuthenticationController {
    private final UserService userService;

    @PostMapping("/")
    public ResponseEntity<BaseResponse> createInformation(@Validated @RequestBody UserFirstLoginRequest userFirstLoginRequest){
        return ResponseEntity.ok(userService.createUser(userFirstLoginRequest));
    }
}
