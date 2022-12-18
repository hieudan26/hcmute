package backend.services;

import backend.data.dto.FindQueryParams;
import backend.data.dto.FindResponse;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.entity.Places;
import backend.data.entity.Posts;
import backend.data.entity.Users;
import backend.exception.InvalidRequestException;
import backend.exception.NoRecordFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
@Transactional
public class FindService {
    private final PostService postService;
    private final UserService userService;
    private final PlaceService placeService;

    public BaseResponse findAll(PagingRequest pagingRequest, FindQueryParams params){
        if(params.getType().equals("faq")){
            BaseResponse result = postService.findPosts(pagingRequest,"faq",params.getKey());
            ((PagingResponse)result.getData()).setContent(
                    ((List<Posts>)((PagingResponse)result.getData()).getContent()).stream().map(
                            item ->
                            FindResponse.builder()
                                    .name(item.getOwner().getFirstName()+item.getOwner().getLastName()+"'s faq")
                                    .type("faq")
                                    .id(String.valueOf(item.getId()))
                                    .content(item.getContent())
                                    .build()
                    ).toList()
            );
            return result;
        }

        if(params.getType().equals("experience")){
            var result = postService.findPosts(pagingRequest,"experience",params.getKey());
            ((PagingResponse)result.getData()).setContent(
                    ((List<Posts>)((PagingResponse)result.getData()).getContent()).stream().map(
                            item -> FindResponse.builder()
                                    .name(item.getOwner().getFirstName()+item.getOwner().getLastName()+"'s experience")
                                    .type("experience")
                                    .id(String.valueOf(item.getId()))
                                    .content(item.getContent())
                                    .build()
                    ).toList()
            );
            return result;
        }

        if(params.getType().equals("user")){
            var result = userService.findUsers(pagingRequest,params.getKey());
            ((PagingResponse)result.getData()).setContent(
                    ((List<Users>)((PagingResponse)result.getData()).getContent()).stream().map(
                            item -> FindResponse.builder()
                                    .name(item.getFirstName()+" "+item.getLastName())
                                    .type("user")
                                    .id(String.valueOf(item.getId()))
                                    .content(item.getSummary())
                                    .build()
                    ).toList()
            );
            return result;
        }

        if(params.getType().equals("place")){
            var result = placeService.findPlaceWithKey(pagingRequest,params.getKey());
            ((PagingResponse)result.getData()).setContent(
                    ((List<Places>)((PagingResponse)result.getData()).getContent()).stream().map(
                            item -> FindResponse.builder()
                                    .name(item.getName())
                                    .type("place")
                                    .id(String.valueOf(item.getUrl()))
                                    .content(item.getDescription())
                                    .build()
                    ).toList()
            );
            return result;
        }

        throw new NoRecordFoundException(String.format("Can't find  with key: %s.", params.getKey()));
    }
}
