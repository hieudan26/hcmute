package backend.services;

import backend.common.AreaConstant;
import backend.common.Roles;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.dto.place.CreatePlaceRequest;
import backend.data.dto.place.PlaceCategoryPayLoad;
import backend.data.dto.user.UserFirstLoginRequest;
import backend.data.entity.Areas;
import backend.data.entity.PlaceCategories;
import backend.data.entity.Places;
import backend.data.entity.Users;
import backend.exception.InvalidRequestException;
import backend.exception.NoRecordFoundException;
import backend.mapper.PlaceMapper;
import backend.repositories.PlaceCategoryRepository;
import backend.repositories.PlaceRepository;
import backend.security.configuration.CustomUserDetail;
import backend.utils.PagingUtils;
import io.swagger.models.auth.In;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final PlaceCategoryRepository placeCategoryRepository;
    private final PlaceMapper placeMapper;

    public BaseResponse createPlaceCategory(PlaceCategoryPayLoad categoryPayLoad){
        PlaceCategories categories = placeMapper.fromCategoryPlayLoadToEntity(categoryPayLoad);
        return BaseResponse.builder().message("Create user successful.")
                .data(placeMapper.fromEntityToCategoryPlayLoad(placeCategoryRepository.save(categories)))
                .build();
    }

    public BaseResponse createPlace(CreatePlaceRequest createPlaceRequest){
        Places places = placeMapper.fromCreatePlaceToPlaces(createPlaceRequest);
        return BaseResponse.builder().message("Create place successful.")
                .data(placeMapper.fromPlaceToPlaceResponse(placeRepository.save(places)))
                .build();
    }

    public BaseResponse updatePlace(String url, CreatePlaceRequest createPlaceRequest){
        Places places = getPlaceByUrl(url);
        placeMapper.update(places,createPlaceRequest);
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

        Places province = getProvinceByUrl(places,provinceUrl);

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

    public Places getPlace(Integer id){
        Optional<Places> places = placeRepository.findById(id);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with Id: %s.",id));
        return places.get();
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

    public Places getProvinceByUrl(Places country, String provinceUrl){
        Optional<Places> places = placeRepository.findProvinceByUrl(country.getAreas().getId(), provinceUrl);
        if(places.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find place with url: %s in country %s",provinceUrl,country.getName()));
        return places.get();
    }


}
