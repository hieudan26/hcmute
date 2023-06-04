package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.post.*;
import backend.data.dto.user.UserFirstLoginRequest;
import backend.services.AreaService;
import backend.services.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.naming.NoPermissionException;

@Slf4j
@RestController
@RequestMapping("posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PostMapping("")
    public ResponseEntity<BaseResponse> createPost(@Validated @RequestBody CreatePostRequest createPostRequest) throws NoPermissionException {
        return ResponseEntity.ok(postService.createPost(createPostRequest));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updatePost(@PathVariable("id") String id,
            @Validated @RequestBody UpdatePostRequest updatePostRequest) throws NoPermissionException {
        return ResponseEntity.ok(postService.updatePost(id,updatePostRequest));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deletePost(@PathVariable("id") String id) throws NoPermissionException {
        return ResponseEntity.ok(postService.deletePost(id));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity<BaseResponse> listAllPosts(PostQueryParams params, PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.listAllPosts(pagingRequest,params));
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getPost(@PathVariable("id") String id){
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PutMapping("/{id}/react")
    public ResponseEntity<BaseResponse> reactPost(@PathVariable("id") String id) throws NoPermissionException {
        return ResponseEntity.ok(postService.updateReaction(id));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}/comments")
    public ResponseEntity<BaseResponse> getCommentsPost(@PathVariable("id") String id, PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.getCommentsByPost(id,pagingRequest));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}/reports")
    public ResponseEntity<BaseResponse> getReports(@PathVariable("id") Integer id, PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.listAllPostReportByPostId(pagingRequest,id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping("/user/{id}/reports")
    public ResponseEntity<BaseResponse> getReportsFromUsers(@PathVariable("id") String id, PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.getPostReportByUserId(pagingRequest,id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @GetMapping("/user/{userId}/reports/{postId}")
    public ResponseEntity<BaseResponse> getReportsFromUsers(@PathVariable("userId") String userId, @PathVariable("postId") Integer postId, PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.getPostReportByPostIdAndUserId(pagingRequest,postId, userId));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @PostMapping("/{postId}/reports")
    public ResponseEntity<BaseResponse> reportPost(@PathVariable("postId") String postId,@RequestBody CreatePostReportRequest createPostReportRequest) throws NoPermissionException {
        return ResponseEntity.ok(postService.reportPost(postId, createPostReportRequest));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PutMapping("/{postId}/reports")
    public ResponseEntity<BaseResponse> updateReportPost(@PathVariable("postId") String postId,@RequestBody UpdatePostReportRequest updatePostReportRequest) throws NoPermissionException {
        return ResponseEntity.ok(postService.updatePostReport(postId, updatePostReportRequest));
    }
}
