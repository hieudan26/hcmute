package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.hashtag.QueryImageHashTagsParams;
import backend.data.dto.place.PlaceCategoryPayLoad;
import backend.services.HashTagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("hashtags")
@RequiredArgsConstructor
public class HashTagController {
    private final HashTagService hashTagService;
    @PreAuthorize("permitAll()")
    @PutMapping("/images")
    public ResponseEntity<BaseResponse> getImages(QueryImageHashTagsParams params, PagingRequest pagingRequest){
        return ResponseEntity.ok(hashTagService.getImages(params,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/")
    public ResponseEntity<BaseResponse> findHashTag(PagingRequest pagingRequest, String hashTag){
        return ResponseEntity.ok(hashTagService.findTag(pagingRequest,hashTag));
    }
}
