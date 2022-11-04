package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.post.CreatePostRequest;
import backend.data.dto.post.UpdatePostRequest;
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

    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity<BaseResponse> listAllPosts(PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.listAllPosts(pagingRequest));
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getPost(@PathVariable("id") String id){
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PutMapping("/{id}/react")
    public ResponseEntity<BaseResponse> reactPost(@PathVariable("id") String id){
        return ResponseEntity.ok(postService.updateReaction(id));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}/comments")
    public ResponseEntity<BaseResponse> getCommentsPost(@PathVariable("id") String id, PagingRequest pagingRequest){
        return ResponseEntity.ok(postService.getCommentsByPost(id,pagingRequest));
    }
}
