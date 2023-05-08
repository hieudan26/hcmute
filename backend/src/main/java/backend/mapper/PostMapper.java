package backend.mapper;

import backend.data.dto.post.CreatePostRequest;
import backend.data.dto.post.PostResponse;
import backend.data.dto.post.UpdatePostRequest;
import backend.data.entity.HashTags;
import backend.data.entity.PostImages;
import backend.data.entity.Posts;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.CommentRepository;
import backend.repositories.HashtagRepository;
import backend.repositories.PostRepository;
import backend.repositories.UserRepository;
import backend.services.HashTagService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class PostMapper {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private HashtagRepository hashtagRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Mapping(source = "userId", target = "owner", qualifiedByName = "fromStringToUsers")
    @Mapping(source = "images", target = "images", qualifiedByName = "fromListImageUrlToListPostImages")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromStringToLocalDateTime")
    @Mapping(source = "hashTags", target = "hashTags", qualifiedByName = "fromStringToHashTag")
    @BeanMapping(qualifiedByName = "setParentForListImages")
    public abstract Posts fromCreatePostRequestToPosts(CreatePostRequest post);

    @Mapping(source = "owner.id", target = "userId")
    @Mapping(source = "images", target = "images", qualifiedByName = "fromListPostImagesToListImageUrl")
    @Mapping(source = "time", target = "time", qualifiedByName = "fromLocalDateTimeToString")
    @Mapping(source = "owner.avatar", target = "avatar")
    @Mapping(source = "owner", target = "fullName", qualifiedByName = "fromUserToFullName")
    @Mapping(source = "hashTags", target = "hashTags", qualifiedByName = "fromHashTagToString")
    @BeanMapping(qualifiedByName = "setNumberForResponse")
    public abstract PostResponse PostsToPostsResponse(Posts post);

    @Mapping(source = "images", target = "images", qualifiedByName = "fromListImageUrlToListPostImages")
    @Mapping(source = "hashTags", target = "hashTags", qualifiedByName = "fromStringToHashTag")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
            qualifiedByName = "updateParentForListImages")
    public abstract void fromUpdatePostRequestToPosts(@MappingTarget Posts posts,UpdatePostRequest updatePostRequest);

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findByIdAndIsDisableIsFalse(userId);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",userId));
        }
        return optionalUsers.get();
    }

    @Named("fromListImageUrlToListPostImages")
    protected Set<PostImages> fromListImageUrlToListPostImages(List<String> list) {
       return list.stream().map(item ->
               new PostImages().builder().link(item).build()).collect(Collectors.toSet());
    }

    @Named("fromListPostImagesToListImageUrl")
    protected List<String> fromListPostImagesToListImageUrl(Set<PostImages> list) {
        return list.stream().map(item ->
                item.getLink()).toList();
    }

    @Named("setParentForListImages")
    @AfterMapping
    protected void setParentForListImages(final CreatePostRequest dto, @MappingTarget final Posts entity) {
         entity.getImages().stream().
                forEach(item -> item.setPost(entity));
    }

    @Named("updateParentForListImages")
    @AfterMapping
    protected void updateParentForListImages(@MappingTarget Posts entity, final UpdatePostRequest dto) {
        entity.getImages().stream().
                forEach(item -> item.setPost(entity));
    }

    @Named("setNumberForResponse")
    @AfterMapping
    protected void setNumberForResponse(final Posts post, @MappingTarget PostResponse response) {
        response.setCommentNumber(commentRepository.countAllByPostIdAndIsDeletedEquals(post.getId(),false));
        response.setReactNumber(postRepository.countAllByReaction(post.getId()));
        Boolean react = false;
        if(!SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser"))
        {
            String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            react = postRepository.isReactPost(post.getId(),userId).isPresent();
        }
        response.setIsReacted(react);
    }

    @Named("fromLocalDateTimeToString")
    protected String fromLocalDateTimeToString(LocalDateTime time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return time.format(dateTimeFormatter);
    }

    @Named("fromStringToLocalDateTime")
    protected LocalDateTime fromStringToLocalDateTime(String time) {
        if(time == null)
            return null;
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return LocalDateTime.parse(time,dateTimeFormatter);
    }

    @Named("fromUserToFullName")
    protected String fromUserToFullName(Users users) {
        return String.format("%s %s",users.getFirstName(),users.getLastName());
    }

    @Named("fromHashTagToString")
    protected List<String> fromHashTagToString(Set<HashTags> set) {
        return set.stream().map(hashTags -> hashTags.getName()).toList();
    }

    @Named("fromStringToHashTag")
    protected Set<HashTags>  fromStringToHashTag(List<String> list) {
        return Collections.emptySet();
    }

}
