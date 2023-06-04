package backend.mapper;

import backend.data.dto.comment.CommentResponse;
import backend.data.dto.post.CreatePostRequest;
import backend.data.dto.post.PostReportResponse;
import backend.data.dto.post.PostResponse;
import backend.data.dto.post.UpdatePostRequest;
import backend.data.entity.*;
import backend.exception.NoRecordFoundException;
import backend.repositories.CommentRepository;
import backend.repositories.HashtagRepository;
import backend.repositories.PostRepository;
import backend.repositories.UserRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class PostReportMapper {
    @Mapping(source = "owner.id", target = "userId")
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "owner.avatar", target = "avatar")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "owner", target = "fullName", qualifiedByName = "fromUserToFullName")
    public abstract PostReportResponse fromPostReportToPostReportResponse(PostReport postReport);

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
