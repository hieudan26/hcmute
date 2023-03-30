package backend.services;

import backend.common.NotificationConstants;
import backend.data.dto.comment.CommentResponse;
import backend.data.dto.comment.CreateCommentRequest;
import backend.data.dto.comment.UpdateCommentRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.entity.Comments;
import backend.data.entity.Notifications;
import backend.data.entity.Posts;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.CommentMapper;
import backend.repositories.CommentRepository;
import backend.utils.PagingUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CommentService {
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final NotificationService notificationService;


    public void deleteChilds(List<Comments> parents) {
        parents.stream()
            .forEach(item->deleteChild(item));
    }

    public void deleteChild(Comments parents) {
        for(var comment : parents.getChildComments()){
            if(comment.getChildComments() != null)
                deleteChild(comment);
        }
        parents.setIsDeleted(true);
        parents.setDisable(true);
    }

    public List<CommentResponse> mappingChilds(List<Comments> parents) {
        return parents.stream()
                .map(comment -> mappingChild(comment))
                .toList();
    }

    public CommentResponse mappingChild(Comments parents) {
        List<CommentResponse> childList = new ArrayList<>();
        for(var comment : parents.getChildComments()){
            if(comment.getChildComments() != null && comment.getIsDeleted() == false)
                childList.add(mappingChild(comment));
        }

        var parent = commentMapper.fromCommentsToCommentResponse(parents);
        parent.setChilds(childList);
        return parent;
    }

    public BaseResponse createComment(CreateCommentRequest createCommentRequest){
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users users = userService.getUser(userId);
        createCommentRequest.setUserId(userId);
        Comments comments = commentMapper.fromCreateCommentRequestToComments(createCommentRequest);

        if(! userId.equals(comments.getPost().getOwner().getId()))
        {
            var noti = Notifications.builder()
                    .type(NotificationConstants.COMMENT.getStatus())
                    .fromUser(userId)
                    .toUser(comments.getPost().getOwner().getId())
                    .contentId(comments.getPost().getId())
                    .description(users.getFirstName() + " "+ users.getLastName()+ " comment your post")
                    .status(false)
                    .build();

            notificationService.sendSocketMessage(noti, comments.getPost().getOwner().getId());
        }

        if(comments.getParentId() != null) {
            Comments parent = getCommentsByID(comments.getParentId());

            if(! userId.equals(parent.getOwner().getId())) {
                var noti2 = Notifications.builder()
                        .type(NotificationConstants.COMMENT_REPLY.getStatus())
                        .fromUser(userId)
                        .toUser(parent.getOwner().getId())
                        .contentId(comments.getPost().getId())
                        .description(users.getFirstName() + " "+ users.getLastName()+ " reply your comment")
                        .status(false)
                        .build();

                notificationService.sendSocketMessage(noti2, parent.getOwner().getId());
            }
        }


        return BaseResponse.builder().message("Create comment successful.")
                .data(commentMapper.fromCommentsToCommentResponse(commentRepository.save(comments)))
                .build();
    }

    public BaseResponse deleteComment(String id) throws NoPermissionException {
        Comments comments = getCommentsByID(Integer.valueOf(id));
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        if(!userId.equals(comments.getOwner().getId()))
            throw new NoPermissionException("You can't update other person's information.");

        comments.setIsDeleted(true);
        comments.setDisable(true);
        deleteChilds(comments.getChildComments().stream().toList());
        return BaseResponse.builder().message("delete comment successful.")
                .data(commentMapper.fromCommentsToCommentResponse(commentRepository.save(comments)))
                .build();
    }

    public BaseResponse getCommentsByPost(PagingRequest pagingRequest, String postId){
        PagingResponse pagingResponse = new PagingResponse(
                commentRepository.queryCommentsByPostId(PagingUtils.getPageable(pagingRequest),Integer.valueOf(postId))
                        .map(comment->mappingChild(comment)));
        return BaseResponse.builder().message("Get comments successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse updateComment(String commentId, UpdateCommentRequest updateCommentRequest) throws NoPermissionException {
        Comments comments= getCommentsByID(Integer.valueOf(commentId));
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        if(!userId.equals(comments.getOwner().getId()))
            throw new NoPermissionException("You can't update other person's information.");

        comments.setContent(updateCommentRequest.getContent());

        return BaseResponse.builder().message("Update comments successful.")
                .data(mappingChild(commentRepository.save(comments)))
                .build();
    }

    private Comments getCommentsByID(Integer commentId){
        Optional<Comments> comments = commentRepository.findById(Integer.valueOf(commentId));
        if(comments.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find comment with Id: %s.",commentId));
        return  comments.get();
    }

    public BaseResponse getCommentsByParent(String parentId){
        return BaseResponse.builder().message("Get comments successful.")
                .data(mappingChilds(commentRepository.getAllByParentId(Integer.valueOf(parentId))))
                .build();
    }
}
