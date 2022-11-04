package backend.mapper;

import backend.data.dto.comment.CommentResponse;
import backend.data.dto.comment.CreateCommentRequest;
import backend.data.dto.post.CreatePostRequest;
import backend.data.entity.Comments;
import backend.data.entity.Posts;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.CommentRepository;
import backend.repositories.PostRepository;
import backend.repositories.UserRepository;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Mapper(componentModel = "spring")
public abstract class CommentMapper {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;

    @Mapping(source = "userId", target = "owner", qualifiedByName = "fromStringToUsers")
    @Mapping(source = "postId", target = "post", qualifiedByName = "fromIdToPost")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "parentId", target = "parentId", qualifiedByName = "checkValidComment")
    public abstract Comments fromCreateCommentRequestToComments(CreateCommentRequest commentRequest);

    @Mapping(source = "owner.id", target = "userId")
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "owner.avatar", target = "avatar")
    @Mapping(source = "owner", target = "fullName", qualifiedByName = "fromUserToFullName")
    public abstract CommentResponse fromCommentsToCommentResponse(Comments comments);

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findById(userId);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",userId));
        }
        return optionalUsers.get();
    }

    @Named("checkValidComment")
    protected Integer checkValidComment(Integer commentId) throws EntityNotFoundException {
        if (commentId != null) {
            Optional<Comments> commentsOptional = commentRepository.findById(commentId);
            if (commentsOptional.isEmpty()) {
                throw new NoRecordFoundException(String.format("Can't find comment with Id: %s.", commentId));
            }
        }
        return commentId;
    }

    @Named("fromIdToPost")
    protected Posts fromIdToPost(Integer postId) throws EntityNotFoundException {
        Optional<Posts> commentsOptional = postRepository.findById(postId);
        if(commentsOptional.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find post with Id: %s.",postId));
        }
        return commentsOptional.get();
    }

    @Named("fromStringToLocalDateTime")
    protected LocalDateTime fromStringToLocalDateTime(String time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return LocalDateTime.parse(time,dateTimeFormatter);
    }

    @Named("fromLocalDateTimeToString")
    protected String fromLocalDateTimeToString(LocalDateTime time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return time.format(dateTimeFormatter);
    }

    @Named("fromUserToFullName")
    protected String fromUserToFullName(Users users) {
        return String.format("%s %s",users.getFirstName(),users.getLastName());
    }
}
