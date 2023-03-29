package backend.controllers;


import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.place.CreatePlaceRequest;
import backend.data.dto.place.PlaceCategoryPayLoad;
import backend.data.dto.place.PlaceRequestParams;
import backend.services.NotificationService;
import backend.services.PlaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.naming.NoPermissionException;

@Slf4j
@RestController
@RequestMapping("notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<BaseResponse> getNotifications(PagingRequest pagingRequest, @RequestParam(name = "isRead", required = false) Boolean status){
        return ResponseEntity.ok(notificationService.listAllNotifications(pagingRequest, status));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<BaseResponse> countNotifications( @RequestParam(name = "isRead", required = false) Boolean status){
        return ResponseEntity.ok(notificationService.countAllNotifications(status));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> readNotification(@PathVariable(name = "id") Integer id, @RequestParam(name = "status", required = false) Boolean status){
        return ResponseEntity.ok(notificationService.readNotificationById(id, status));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PutMapping("")
    public ResponseEntity<BaseResponse> readNotifications( @RequestParam(name = "status", required = false) Boolean status){
        return ResponseEntity.ok(notificationService.readNotifications(status));
    }


}
