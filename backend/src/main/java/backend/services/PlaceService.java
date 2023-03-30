package backend.services;

import backend.common.AreaConstant;
import backend.common.NotificationConstants;
import backend.common.PlaceStatuses;
import backend.common.Roles;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.place.CreatePlaceRequest;
import backend.data.dto.place.PlaceCategoryPayLoad;
import backend.data.dto.place.PlaceRequestParams;
import backend.data.dto.place.PlaceResponse;
import backend.data.dto.post.PostResponse;
import backend.data.dto.user.UserFirstLoginRequest;
import backend.data.entity.*;
import backend.exception.InvalidRequestException;
import backend.exception.NoRecordFoundException;
import backend.mapper.PlaceMapper;
import backend.repositories.PlaceCategoryRepository;
import backend.repositories.PlaceRepository;
import backend.security.configuration.CustomUserDetail;
import backend.utils.PagingUtils;
import backend.utils.SearchSpecificationUtils;
import io.swagger.models.auth.In;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import javax.naming.NoPermissionException;
import javax.transaction.Transactional;
import java.util.Optional;

import static backend.common.Roles.ADMIN;
import static backend.common.Roles.ROLE_USER;

@Service
@AllArgsConstructor
@Transactional
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final PlaceCategoryRepository placeCategoryRepository;
    private final HashTagService hashTagService;
    private final PlaceMapper placeMapper;
    private final UserService userService;
    private final NotificationService notificationService;



    public BaseResponse createPlaceCategory(PlaceCategoryPayLoad categoryPayLoad){
        PlaceCategories categories = placeMapper.fromCategoryPlayLoadToEntity(categoryPayLoad);
        return BaseResponse.builder().message("Create user successful.")
                .data(placeMapper.fromEntityToCategoryPlayLoad(placeCategoryRepository.save(categories)))
                .build();
    }

    public BaseResponse getPlaceCategories(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                placeCategoryRepository.findAll(PagingUtils.getPageable(pagingRequest))
                        .map(placeMapper::fromEntityToCategoryPlayLoad));
        return BaseResponse.builder().message("Create user successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findPlaceWithKey(PagingRequest pagingRequest, String key){
        PagingResponse<Places> pagingResponse = new PagingResponse(
                placeRepository.findByNameIgnoreCaseContainingAndStatusIsAndIsDisableIsFalse(PagingUtils.getPageable(pagingRequest), key, PlaceStatuses.APPROVED.getStatus()));

        return BaseResponse.builder().message("find place successful.")
                .data(pagingResponse)
                .build();
    }


    public BaseResponse createPlace(CreatePlaceRequest createPlaceRequest) throws NoPermissionException {
        Places places = placeMapper.fromCreatePlaceToPlaces(createPlaceRequest);
        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        if (user.isHasRole(ROLE_USER.getRoleName())) {
            places.setStatus(PlaceStatuses.PENDING.getStatus());
            places.setStatusDescription("User created");
        } else {
            places.setStatus(PlaceStatuses.APPROVED.getStatus());
            places.setStatusDescription("Admin created");

        }

        places.setHashTags(hashTagService.createNewHashTag(createPlaceRequest.getHashTags(),places));
        places.setOwner(userService.getUser(user.getUsername()));
        var place = placeMapper.fromPlaceToPlaceResponse(placeRepository.save(places));

        if (user.isHasRole(ROLE_USER.getRoleName())) {
            var noti = Notifications.builder()
                    .type(NotificationConstants.PLACESTATUS.getStatus())
                    .fromUser(user.getUsername())
                    .toUser(ADMIN.getRoleName())
                    .contentId(place.getId())
                    .description("New Place has been created")
                    .status(false)
                    .build();

            notificationService.sendSocketMessage(noti);
        }

        return BaseResponse.builder().message("Create place successful.")
                .data(place)
                .build();
    }

    public BaseResponse updatePlace(String url, CreatePlaceRequest createPlaceRequest) throws NoPermissionException {
        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        Places places = getPlaceByUrl(url);

        if (user.isHasRole(ROLE_USER.getRoleName())) {
            if(!user.getUsername().equals(places.getOwner().getId())) {
                throw new NoPermissionException("You can't update other person's information.");
            }

            if(!places.getStatus().equals(PlaceStatuses.PENDING.getStatus())) {
                throw new NoPermissionException("You can update only pending places.");
            }
            createPlaceRequest.setStatusDescription(null);
            createPlaceRequest.setStatus(null);
        }

        if( !places.getStatus().equals(createPlaceRequest.getStatus())) {
            var noti = Notifications.builder()
                    .type(NotificationConstants.PLACESTATUS.getStatus())
                    .fromUser(ADMIN.getRoleName())
                    .toUser(places.getOwner().getId())
                    .contentId(places.getId())
                    .description("Your place has been "+createPlaceRequest.getStatus())
                    .status(false)
                    .build();

            notificationService.sendSocketMessage(noti, places.getOwner().getId());

        }

        placeMapper.update(places,createPlaceRequest);

        places.setHashTags(hashTagService.updateHashTag(createPlaceRequest.getHashTags(), places));
        return BaseResponse.builder().message("update place successful.")
                .data(placeMapper.fromPlaceToPlaceResponse(placeRepository.save(places)))
                .build();
    }

    public BaseResponse updatePlaceCategory(Integer id, PlaceCategoryPayLoad createPlaceRequest){
        PlaceCategories places = getPlaceCategory(id);
        placeMapper.updateCategory(places,createPlaceRequest);

        return BaseResponse.builder().message("update place successful.")
                .data(placeMapper.fromEntityToCategoryPlayLoad(placeCategoryRepository.save(places)))
                .build();
    }

    public BaseResponse listAllCountries(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                placeRepository.findByPlaceCategories_Name(PagingUtils.getPageable(pagingRequest), AreaConstant.COUNTRY.getTypeName())
                        .map(placeMapper::fromPlaceToPlaceResponse));

        return BaseResponse.builder().message("Find countries successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse getCountry(String url){
        Places places = getPlaceByUrl(url);

        if (!places.getPlaceCategories().getName().equals(AreaConstant.COUNTRY.getTypeName())){
            throw new InvalidRequestException("Url is not a country");
        }
        return BaseResponse.builder().message("Find country successful.")
                .data(placeMapper.fromPlaceToPlaceResponse(places))
                .build();
    }

    public BaseResponse getProvince(String countryUrl, String provinceUrl){
        Places places = getPlaceByUrl(countryUrl);

        if (!places.getPlaceCategories().getName().equals(AreaConstant.COUNTRY.getTypeName())){
            throw new InvalidRequestException("Url is not a country");
        }

        Places province = getPlaceWithParent(places,provinceUrl);

        if (!province.getPlaceCategories().getName().equals(AreaConstant.PROVINCE.getTypeName())){
            throw new InvalidRequestException("Url is not a province");
        }


        return BaseResponse.builder().message("Find province successful.")
                .data(placeMapper.fromPlaceToPlaceResponse(province))
                .build();
    }

    public BaseResponse listAllProvincesByCountryUrl(String url, PagingRequest pagingRequest){
        Places places = getPlaceByUrl(url);

        if (!places.getPlaceCategories().getName().equals(AreaConstant.COUNTRY.getTypeName())){
            throw new InvalidRequestException("Url is not a country");
        }

        PagingResponse pagingResponse = new PagingResponse(
                placeRepository.findAllProvince(PagingUtils.getPageable(pagingRequest), places.getAreas().getId(),AreaConstant.PROVINCE.getTypeName())
                      .map(placeMapper::fromPlaceToPlaceResponse));

        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse listAllPlacesByProvinceUrl(String url, String type, PagingRequest pagingRequest){
        Places places = getPlaceByUrl(url);

        if (!places.getPlaceCategories().getName().equals(AreaConstant.PROVINCE.getTypeName())){
            throw new InvalidRequestException("Url is not a provinces");
        }
        PagingResponse pagingResponse ;
        if(type == null){
            pagingResponse = new PagingResponse(
                    placeRepository.findAllPlaceByProvince(PagingUtils.getPageable(pagingRequest), places.getAreas().getId())
                            .map(placeMapper::fromPlaceToPlaceResponse));
        }else{
            pagingResponse = new PagingResponse(
                    placeRepository.findAllPlaceByProvinceWithType(PagingUtils.getPageable(pagingRequest),  places.getAreas().getId(), type)
                            .map(placeMapper::fromPlaceToPlaceResponse));
        }

        return BaseResponse.builder().message("Find places successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse getPlaceByProvinceUrl(String countryUrl, String provinceUrl, String placeUrl){
        Places places = getPlaceByUrl(countryUrl);

        if (!places.getPlaceCategories().getName().equals(AreaConstant.COUNTRY.getTypeName())){
            throw new InvalidRequestException("Url is not a country");
        }

        Places province = getPlaceWithParent(places,provinceUrl);

        if (!province.getPlaceCategories().getName().equals(AreaConstant.PROVINCE.getTypeName())){
            throw new InvalidRequestException("Url is not a province");
        }


        return BaseResponse.builder().message("Find place successful.")
                .data(placeMapper.fromPlaceToPlaceResponse(getPlaceWithArea(province,placeUrl)))
                .build();
    }

    public Places getPlace(Integer id){
        Optional<Places> places = placeRepository.findById(id);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with Id: %s.",id));
        return places.get();
    }

    public BaseResponse findPlace(Integer id){
        return BaseResponse.builder().message("Find place successful.")
                .data(placeMapper.fromPlaceToPlaceResponse(getPlace(id)))
                .build();
    }

    public PlaceCategories getPlaceCategory(Integer id){
        Optional<PlaceCategories> places = placeCategoryRepository.findById(id);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't place categories place with Id: %s.",id));
        return places.get();
    }

    public Places getPlaceByUrl(String url){
        Optional<Places> places = placeRepository.findByUrl(url);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with url: %s.",url));
        return places.get();
    }
    public Places getPlaceWithArea(Places place, String placeUrl){
        Optional<Places> places = placeRepository.findPlaceByUrl(place.getAreas().getId(), placeUrl);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with url: %s in parent %s",placeUrl,place.getName()));
        return places.get();
    }

    public Places getPlaceWithParent(Places place, String placeUrl){
        Optional<Places> places = placeRepository.findProvinceByUrl(place.getAreas().getId(), placeUrl);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with url: %s in parent %s",placeUrl,place.getName()));
        return places.get();
    }

    public Places getPlaceByArea(Integer id, String type){
        Optional<Places> places = placeRepository.findPlaceWithArea(id, type);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with id %s", id.toString()));
        return places.get();
    }
    public String buildUrl(Places places){
        String url =places.getUrl();

        if (places.getPlaceCategories().getName().equals(AreaConstant.COUNTRY.getTypeName())){
            return url;
        }

        if (places.getPlaceCategories().getName().equals(AreaConstant.PROVINCE.getTypeName())) {
            return getPlaceByArea(places.getAreas().getParentId(), AreaConstant.COUNTRY.getTypeName()).getUrl()+ "/" + url;
        }

        return
        getPlaceByArea(places.getAreas().getParentId(), AreaConstant.COUNTRY.getTypeName()).getUrl()+ "/"
        + getPlaceByArea(places.getAreas().getId(), AreaConstant.PROVINCE.getTypeName()).getUrl()+ "/"
        + url;
    }

    public BaseResponse getPlace(PlaceRequestParams placeRequestParams, PagingRequest pagingRequest){
        CustomUserDetail user = ((CustomUserDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        if (user.isHasRole(ROLE_USER.getRoleName())) {
            placeRequestParams.setUserId(user.getUsername());
        }

        PagingResponse<PlaceResponse> pagingResponse = new PagingResponse(
                placeRepository.findAll(SearchSpecificationUtils.searchBuilder(placeRequestParams), PagingUtils.getPageable(pagingRequest))
                        .map(placeMapper::fromPlaceToPlaceResponse));

        return BaseResponse.builder().message("Find place successful.")
                .data(pagingResponse)
                .build();
    }

}
