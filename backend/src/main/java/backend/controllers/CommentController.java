package backend.controllers;

import backend.data.dto.comment.CreateCommentRequest;
import backend.data.dto.comment.UpdateCommentRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.post.CreatePostRequest;
import backend.services.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.naming.NoPermissionException;

@Slf4j
@RestController
@RequestMapping("comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PostMapping("")
    public ResponseEntity<BaseResponse> createComment(@Validated @RequestBody CreateCommentRequest createCommentRequest){
        return ResponseEntity.ok(commentService.createComment(createCommentRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getCommentByParent(@PathVariable("id") String id){
        return ResponseEntity.ok(commentService.getCommentsByParent(id));
    }

    @PreAuthorize("permitAll()")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updateComment(@PathVariable("id") String id,@Validated @RequestBody UpdateCommentRequest updateCommentRequest) throws NoPermissionException {
        return ResponseEntity.ok(commentService.updateComment(id,updateCommentRequest));
    }

    @PreAuthorize("permitAll()")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteComment(@PathVariable("id") String id) throws NoPermissionException {
        return ResponseEntity.ok(commentService.deleteComment(id));
    }
}
