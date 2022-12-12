package backend.controllers;


import backend.data.dto.area.listItem.CreateProvinceRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.place.CreatePlaceRequest;
import backend.data.dto.place.PlaceCategoryPayLoad;
import backend.data.entity.Places;
import backend.services.PlaceService;
import backend.services.PostService;
import io.swagger.models.auth.In;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PreAuthorize("permitAll()")
    @PostMapping("/")
    public ResponseEntity<BaseResponse> createPlace(@RequestBody CreatePlaceRequest request){
        return ResponseEntity.ok(placeService.createPlace(request));
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/categories")
    public ResponseEntity<BaseResponse> createCategory(@RequestBody PlaceCategoryPayLoad request){
        return ResponseEntity.ok(placeService.createPlaceCategory(request));
    }

    @PreAuthorize("permitAll()")
    @PutMapping("/categories/{id}")
    public ResponseEntity<BaseResponse> updateCategory(@PathVariable("id") Integer id, @RequestBody PlaceCategoryPayLoad request){
        return ResponseEntity.ok(placeService.updatePlaceCategory(id,request));
    }

    @PreAuthorize("permitAll()")
    @PutMapping("/{url}")
    public ResponseEntity<BaseResponse> updatePlace(@PathVariable("url") String url, @RequestBody CreatePlaceRequest request){
        return ResponseEntity.ok(placeService.updatePlace(url,request));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries")
    public ResponseEntity<BaseResponse> getCountries(PagingRequest pagingRequest){
        return ResponseEntity.ok(placeService.listAllCountries(pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{url}")
    public ResponseEntity<BaseResponse> getCountry(@PathVariable("url") String url){
        return ResponseEntity.ok(placeService.getCountry(url));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{url}/provinces")
    public ResponseEntity<BaseResponse> getProvincesByCountry(@PathVariable("url") String url, PagingRequest pagingRequest){
        return ResponseEntity.ok(placeService.listAllProvincesByCountryUrl(url,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{url}/provinces/{provinceUrl}")
    public ResponseEntity<BaseResponse> getProvince(@PathVariable("url") String url,@PathVariable("provinceUrl") String provinceUrl){
        return ResponseEntity.ok(placeService.getProvince(url,provinceUrl));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{url}/provinces/{provinceUrl}/places")
    public ResponseEntity<BaseResponse> getPlaces(@PathVariable("url") String url,@PathVariable("provinceUrl") String provinceUrl, String type, PagingRequest pagingRequest){
        return ResponseEntity.ok(placeService.listAllPlacesByProvinceUrl(provinceUrl,type,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{url}/provinces/{provinceUrl}/places/{placeId}")
    public ResponseEntity<BaseResponse> getPlace(@PathVariable("url") String url, @PathVariable("provinceUrl") String provinceUrl,@PathVariable("placeId")  String placeId){
        return ResponseEntity.ok(placeService.getPlaceByProvinceUrl(url,provinceUrl,placeId));
    }




}
