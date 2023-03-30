package backend.services;

import backend.common.NotificationConstants;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.post.CreatePostRequest;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.post.PostResponse;
import backend.data.dto.post.UpdatePostRequest;
import backend.data.entity.HashTags;
import backend.data.entity.Notifications;
import backend.data.entity.Posts;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.mapper.PostMapper;
import backend.repositories.CommentRepository;
import backend.repositories.PostRepository;
import backend.utils.PagingUtils;
import backend.utils.S3Util;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.naming.NoPermissionException;
import javax.transaction.Transactional;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static backend.common.Roles.ADMIN;
import static backend.common.Roles.ROLE_USER;

@Service
@AllArgsConstructor
@Transactional
public class PostService {
    private PostRepository postRepository;
    private CommentRepository commentRepository;
    private HashTagService hashTagService;
    private UserService userService;
    private PostMapper postMapper;
    private CommentService commentService;
    private NotificationService notificationService;


    private S3Util s3Util;

    public BaseResponse getAllPosts(){
        return BaseResponse.builder().message("Find all posts successful.")
                .data(postRepository.findAll())
                .build();
    }

    public BaseResponse listAllPosts(PagingRequest pagingRequest, PostQueryParams params){
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                 postRepository.findAll(SearchSpecificationUtils.searchBuilder(params), PagingUtils.getPageable(pagingRequest))
                        .map(postMapper::PostsToPostsResponse));

        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findPosts(PagingRequest pagingRequest, String type, String key){
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                postRepository.findByTypeAndTitleIgnoreCaseContainingAndIsDisableIsFalse(PagingUtils.getPageable(pagingRequest),type,key));

        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findPosts(PagingRequest pagingRequest, String key){
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                postRepository.findByTitleIgnoreCaseContainingAndIsDisableIsFalse(PagingUtils.getPageable(pagingRequest),key)
                        .map(postMapper::PostsToPostsResponse));

        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse listAllPostsByUserId(PagingRequest pagingRequest,String userId){
        PagingResponse pagingResponse = new PagingResponse(
                postRepository.queryPostsByUserId(PagingUtils.getPageable(pagingRequest), userId)
                        .map(postMapper::PostsToPostsResponse));
        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse createPost(CreatePostRequest createPostRequest) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        createPostRequest.setUserId(userId);
        Posts post = postMapper.fromCreatePostRequestToPosts(createPostRequest);

        post.setHashTags(createPostRequest.getHashTags().stream().map(
                name -> hashTagService.getHashTag(name)
        ).collect(Collectors.toSet()));

        return BaseResponse.builder().message("Create post successful.")
                .data(postMapper.PostsToPostsResponse(postRepository.save(post)))
                .build();
    }

    public BaseResponse updateReaction(String postId) throws NoPermissionException {
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Users users = userService.getUser(userId);
        Posts posts = getPostById(Integer.valueOf(postId));
        Optional isReactPost = postRepository.isReactPost(Integer.valueOf(postId),userId);
        if(isReactPost.isPresent()){
            posts.getReaction().remove(users);
        }

        else{
            posts.getReaction().add(users);

            var noti = Notifications.builder()
                    .type(NotificationConstants.REACT.getStatus())
                    .fromUser(userId)
                    .toUser(posts.getOwner().getId())
                    .contentId(posts.getId())
                    .description(users.getFirstName() + " "+ users.getLastName()+ " react your post")
                    .status(false)
                    .build();

            notificationService.sendSocketMessage(noti, posts.getOwner().getId());

        }

        postRepository.save(posts);
        return BaseResponse.builder().message("Create post successful.")
                .data(Map.of("isReact",!isReactPost.isPresent()))
                .build();
    }

    public BaseResponse updatePost(String id, UpdatePostRequest updatePostRequest) throws NoPermissionException {
        Posts post = getPostById(Integer.valueOf(id));
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        if(!userId.equals(post.getOwner().getId()))
            throw new NoPermissionException("You can't update other person's information.");

        for (var image : post.getImages()){
            if(updatePostRequest.getImages().indexOf(image.getLink()) < 0){
                s3Util.deleteByUrl(image.getLink());
            }
        }

        postMapper.fromUpdatePostRequestToPosts(post,updatePostRequest);

        post.getHashTags().addAll(updatePostRequest.getHashTags().stream().map(
                name -> hashTagService.getHashTag(name)
        ).collect(Collectors.toSet()));

        return BaseResponse.builder().message("Update post successful.")
                .data(postMapper.PostsToPostsResponse(postRepository.save(post)))
                .build();
    }

    public BaseResponse deletePost(String id) throws NoPermissionException {
        Posts post = getPostById(Integer.valueOf(id));
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        if(!userId.equals(post.getOwner().getId()))
            throw new NoPermissionException("You can't update other person's information.");

        post.setIsDeleted(true);
        post.setDisable(true);
        return BaseResponse.builder().message("Update post successful.")
                .data(postMapper.PostsToPostsResponse(postRepository.save(post)))
                .build();
    }

    public BaseResponse getCommentsByPost(String id, PagingRequest pagingRequest){
        return commentService.getCommentsByPost(pagingRequest,id);
    }

    public BaseResponse getPost(String id){
        return BaseResponse.builder().message("Create post successful.")
                .data(postMapper.PostsToPostsResponse((getPostById(Integer.valueOf(id)))))
                .build();
    }

    public Posts getPostById(Integer id){
        Optional<Posts> posts = postRepository.findById(id);
        if(posts.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find post with Id: %s.",id));
        return  posts.get();
    }

    public BaseResponse disablePost(){
        return BaseResponse.builder().message("Disable post successful.")
                .data(postRepository.findAll())
                .build();
    }

}
