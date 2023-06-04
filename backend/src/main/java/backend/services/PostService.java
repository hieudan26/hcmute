package backend.services;

import backend.common.NotificationConstants;
import backend.common.PostStatus;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.post.*;
import backend.data.entity.*;
import backend.exception.InvalidRequestException;
import backend.exception.NoRecordFoundException;
import backend.mapper.PostMapper;
import backend.mapper.PostReportMapper;
import backend.repositories.CommentRepository;
import backend.repositories.PostReportRepository;
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
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static backend.common.Roles.*;

@Service
@AllArgsConstructor
@Transactional
public class PostService {
    private PostRepository postRepository;
    private CommentRepository commentRepository;
    private HashTagService hashTagService;
    private PostReportRepository postReportRepository;

    private UserService userService;
    private PostMapper postMapper;
    private PostReportMapper postReportMapper;

    private CommentService commentService;
    private NotificationService notificationService;


    private S3Util s3Util;

    public BaseResponse getAllPosts(){
        return BaseResponse.builder().message("Find all posts successful.")
                .data(postRepository.findAll())
                .build();
    }

    public BaseResponse listAllPosts(PagingRequest pagingRequest, PostQueryParams params){
        boolean isAdmin = isAdmin();
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                 postRepository.findAll(SearchSpecificationUtils.searchBuilder(params,isAdmin), PagingUtils.getPageable(pagingRequest))
                        .map(postMapper::PostsToPostsResponse));

        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    private boolean isAdmin() {
        var isAdmin  = false;
        var isLogin = !SecurityContextHolder.getContext().getAuthentication().getPrincipal().getClass().equals(String.class);
        if(isLogin && userService.getUserFromContext().getRole().equals(ADMIN.name())) {
            isAdmin = true;
        }
        return isAdmin;
    }

    public BaseResponse findPosts(PagingRequest pagingRequest, String type, String key){
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                postRepository.findByTypeAndTitleIgnoreCaseContainingAndIsDisableIsFalseAndStatus(PagingUtils.getPageable(pagingRequest),type,key,PostStatus.ACTIVE.name()));

        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findPosts(PagingRequest pagingRequest, String key){
        PagingResponse<PostResponse> pagingResponse = new PagingResponse(
                postRepository.findByTitleIgnoreCaseContainingAndIsDisableIsFalseAndStatus(PagingUtils.getPageable(pagingRequest),key, PostStatus.ACTIVE.name())
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

        post.setStatus(PostStatus.ACTIVE.name());

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

            if(! userId.equals(posts.getOwner().getId())){
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

        if(posts.isEmpty() || (!isAdmin() && (posts.get().getIsDeleted() || posts.get().getStatus().equals(PostStatus.BANNED.name()))))
            throw new NoRecordFoundException(String.format("Can't find post with Id: %s.",id));
        return  posts.get();
    }

    public BaseResponse disablePost(){
        return BaseResponse.builder().message("Disable post successful.")
                .data(postRepository.findAll())
                .build();
    }

    public BaseResponse reportPost(String id, CreatePostReportRequest createPostReportRequest) throws NoPermissionException {
        Posts post = getPostById(Integer.valueOf(id));
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        if(userId.equals(post.getOwner().getId()))
            throw new NoPermissionException("You can't report your post.");

        if(postReportRepository.findPostReportByPost_IdAndOwner_Id(post.getId(), userId).isPresent()) {
            throw new InvalidRequestException("You already report this post.");
        }

        var repostReport = PostReport.builder()
                .owner(userService.getUserFromContext())
                .post(post)
                .content(createPostReportRequest.getContent())
                .time(LocalDateTime.now())
                .build();

        postReportRepository.save(repostReport);
        post.setReportCount(post.getReportCount()+1);

        if(post.getReportCount() >= 10) {
            var noti = Notifications.builder()
                    .type(NotificationConstants.REPORT.getStatus())
                    .fromUser(ADMIN.getRoleName())
                    .toUser(post.getOwner().getId())
                    .contentId(post.getId())
                    .description("Too many people report your post. It will be hidden on community.")
                    .status(false)
                    .build();
            notificationService.sendSocketMessage(noti, post.getOwner().getId());

            post.setStatus(PostStatus.OBSERVE.name());

        }
        return BaseResponse.builder().message("Report post successful.")
                .data(postMapper.PostsToPostsResponse(postRepository.save(post)))
                .build();
    }

    public BaseResponse updatePostReport(String id, UpdatePostReportRequest updatePostReportRequest) throws NoPermissionException {
        Posts post = getPostById(Integer.valueOf(id));

        if(updatePostReportRequest.getStatus().equals(PostStatus.BANNED.name())) {
            post.setStatus(PostStatus.BANNED.name());
            post.setReportCount(0);
            postReportRepository.deleteAllByPost_Id(post.getId());
            var noti = Notifications.builder()
                    .type(NotificationConstants.REPORT.getStatus())
                    .fromUser(ADMIN.getRoleName())
                    .toUser(post.getOwner().getId())
                    .contentId(post.getId())
                    .description("Your post has been banned.")
                    .status(false)
                    .build();
            notificationService.sendSocketMessage(noti, post.getOwner().getId());
        }
        else if(updatePostReportRequest.getStatus().equals(PostStatus.ACTIVE.name())) {
            post.setStatus(PostStatus.ACTIVE.name());
            post.setReportCount(0);
            postReportRepository.deleteAllByPost_Id(post.getId());
            var noti = Notifications.builder()
                    .type(NotificationConstants.REPORT.getStatus())
                    .fromUser(ADMIN.getRoleName())
                    .toUser(post.getOwner().getId())
                    .contentId(post.getId())
                    .description("Your post has been active.")
                    .status(false)
                    .build();
            notificationService.sendSocketMessage(noti, post.getOwner().getId());
        } else {
            post.setStatus(PostStatus.OBSERVE.name());
        }

        return BaseResponse.builder().message("Report post successful.")
                .data(postMapper.PostsToPostsResponse(postRepository.save(post)))
                .build();
    }

    public BaseResponse listAllPostReportByPostId(PagingRequest pagingRequest,Integer postId){
        PagingResponse pagingResponse = new PagingResponse(
                postReportRepository.findPostReportByPost_Id(PagingUtils.getPageable(pagingRequest), postId).map(postReportMapper::fromPostReportToPostReportResponse));
        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse getPostReportByPostIdAndUserId(PagingRequest pagingRequest,Integer postId, String userId){
        var pagingResponse = postReportRepository.findPostReportByPost_IdAndOwner_Id(postId, userId);
        return BaseResponse.builder().message("Find all posts successful.")
                .data(postReportMapper.fromPostReportToPostReportResponse(pagingResponse.orElseThrow(()-> new NoRecordFoundException("Not found report"))))
                .build();
    }

    public BaseResponse getPostReportByUserId(PagingRequest pagingRequest, String userId){
        PagingResponse pagingResponse = new PagingResponse(
                postReportRepository.findPostReportByOwner_Id(PagingUtils.getPageable(pagingRequest), userId).map(postReportMapper::fromPostReportToPostReportResponse));
        return BaseResponse.builder().message("Find all posts successful.")
                .data(pagingResponse)
                .build();
    }
}
