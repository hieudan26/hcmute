package backend.services;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.hashtag.HashTagResponseWithLabel;
import backend.data.dto.hashtag.QueryImageHashTagsParams;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.post.PostResponse;
import backend.data.entity.HashTags;
import backend.data.entity.Places;
import backend.data.entity.PostImages;
import backend.data.entity.Users;
import backend.exception.InvalidRequestException;
import backend.exception.NoRecordFoundException;
import backend.mapper.PostMapperImpl;
import backend.repositories.HashtagRepository;
import backend.utils.PagingUtils;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional(rollbackOn = InvalidRequestException.class)
public class HashTagService {
    private final HashtagRepository hashtagRepository;
    private final PostMapperImpl postMapper;


    public  Set<HashTags> updateHashTag(List<String> names, Places place){
        Set<HashTags> hashTagsList = hashtagRepository.getByPlaces_Id(place.getId());
         List oldName = hashTagsList.stream().map(hashTags -> hashTags.getName()).toList();


        List deletedHashTag =
                hashTagsList.stream()
                        .filter(hashTags -> !names.contains(hashTags.getName()))
                        .toList();

        List newHashTag = names.stream()
                .filter(name -> !oldName.contains(name))
                .toList();

        hashTagsList.removeAll(deletedHashTag);
        hashTagsList.addAll(createNewHashTag(newHashTag,place));

        return hashTagsList;
    }

    public Set<HashTags> createNewHashTag(List<String> name, Places place){
        List<String> existed = name.stream().filter(item->isExistedInOtherPlace(item, place.getId())).toList();
        if(!existed.isEmpty()){
            throw new InvalidRequestException(String.join(" and ", existed) + " is exsited.");
        }
        return name.stream().map(item -> HashTags.builder()
                .name(item)
                .places(place).build()).collect(Collectors.toSet());
    }

    public void deletedHashTag(List<HashTags> hashTags){
        hashtagRepository.deleteAll(hashTags);
    }

    public Boolean isExistedInOtherPlace(String name,Integer idPlace){
        Optional<HashTags> hashTags = hashtagRepository.getByNameAndPlaces_IdNot(name,idPlace);
        if(hashTags.isEmpty())
            return false;
        return true;
    }

    public HashTags getHashTag(String name){
        Optional<HashTags> hashTags = hashtagRepository.findHashTagsByName(name);
        if(hashTags.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find hashTag with name: %s.",name));
        return hashTags.get();
    }
    public BaseResponse findTag(PagingRequest pagingRequest, String hashTag){
        PagingResponse<String> pagingResponse;
        if (hashTag == null || hashTag.isBlank()){
            pagingResponse = new PagingResponse(
                    hashtagRepository.findAll(PagingUtils.getPageable(pagingRequest))
                            .map(item-> HashTagResponseWithLabel.builder()
                                    .label(item.getName())
                                    .value(item.getName())
                                    .placeUrl(item.getPlaces().getUrl()).build()));
        } else {
            pagingResponse = new PagingResponse(
                    hashtagRepository.findHashTags(PagingUtils.getPageable(pagingRequest), hashTag)
                            .map(item-> HashTagResponseWithLabel.builder()
                                    .label(item.getName())
                                    .value(item.getName())
                                    .placeUrl(item.getPlaces().getUrl()).build()));
        }


        return BaseResponse.builder().message("Find all hashTag successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse getImages(QueryImageHashTagsParams params, PagingRequest pagingRequest){
        PagingResponse<String> pagingResponse = new PagingResponse(
                hashtagRepository.getHashTagImage(PagingUtils.getPageable(pagingRequest), params.getType(), params.getHashtag())
                        .map(item -> item.getLink()));

        return BaseResponse.builder().message("Find all images successful.")
                .data(pagingResponse)
                .build();
    }
}
