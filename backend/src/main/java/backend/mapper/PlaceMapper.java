package backend.mapper;

import backend.data.dto.place.CreatePlaceRequest;
import backend.data.dto.place.PlaceCategoryPayLoad;
import backend.data.dto.place.PlaceResponse;
import backend.data.dto.trip.TripResponse;
import backend.data.dto.user.UpdateUserRequest;
import backend.data.entity.*;
import backend.exception.NoRecordFoundException;
import backend.repositories.AreaRepository;
import backend.repositories.PlaceCategoryRepository;
import backend.repositories.PostRepository;
import backend.repositories.UserRepository;
import backend.utils.LinkUtils;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class PlaceMapper {
    @Autowired
    private PlaceCategoryRepository placeCategoryRepository;
    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private UserRepository userRepository;

    @Mapping(source = "placeCategories", target = "category", qualifiedByName = "mapCategory")
    @Mapping(source = "hashTags", target = "hashTags", qualifiedByName = "mapHashTagsToString")
    @Mapping(source = "owner.id", target = "userId")
    public abstract PlaceResponse fromPlaceToPlaceResponse(Places places);

    @Named("PlacesToPlaceResponses")
    public List<PlaceResponse> tripsToTripDTOs(Set<Places> trips) {
        if(trips == null) {
            return List.of();
        }
        return trips.stream()
                .map(this::fromPlaceToPlaceResponse)
                .collect(Collectors.toList());
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @Mapping(target = "hashTags", ignore = true)
    public abstract void update(@MappingTarget Places entity, CreatePlaceRequest createPlaceRequest);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    public abstract void updateCategory(@MappingTarget PlaceCategories entity, PlaceCategoryPayLoad categoryPayLoad);

    @Mapping(source = "name", target = "url", qualifiedByName = "mapUrl")
    @Mapping(source = "category", target = "placeCategories", qualifiedByName = "mapPlaceCategory")
    @Mapping(source = "area", target = "areas", qualifiedByName = "mapArea")
    @Mapping(target = "hashTags", ignore = true)
    public abstract Places fromCreatePlaceToPlaces(CreatePlaceRequest createPlaceRequest);

    @Mapping(target = "id", ignore = true)
    public abstract PlaceCategories fromCategoryPlayLoadToEntity(PlaceCategoryPayLoad placeCategoryPayLoad);

    public abstract PlaceCategoryPayLoad fromEntityToCategoryPlayLoad(PlaceCategories placeCategories);

    @Named("mapCategory")
    protected PlaceCategoryPayLoad mapCategory(PlaceCategories categories) throws EntityNotFoundException {
        var category = PlaceCategoryPayLoad.builder()
                .id(categories.getId())
                .name(categories.getName())
                .build();
        return category;
    }

    @Named("mapHashTagsToString")
    protected List<String> mapHashTagsToString(Set<HashTags> set) throws EntityNotFoundException {
        return set.stream().map(hashTags -> hashTags.getName()).toList();
    }

    @Named("mapPlaceCategory")
    protected PlaceCategories mapPlaceCategory(Integer id) throws EntityNotFoundException {
        Optional<PlaceCategories> optionalPlaceCategories = placeCategoryRepository.findById(id);
        if (optionalPlaceCategories.isEmpty()) {
            throw new NoRecordFoundException(String.format("Can't find category with Id: %s.", id));
        }
        return optionalPlaceCategories.get();
    }

    @Named("mapArea")
    protected Areas mapArea(Integer id) throws EntityNotFoundException {
        Optional<Areas> optionalAreas = areaRepository.findById(id);
        if (optionalAreas.isEmpty()) {
            throw new NoRecordFoundException(String.format("Can't find area with Id: %s.", id));
        }
        return optionalAreas.get();
    }

    @Named("mapUrl")
    protected String mapUrl(String name) throws EntityNotFoundException {
        return LinkUtils.getLink(name);
    }

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findByIdAndIsDisableIsFalse(userId);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",userId));
        }
        return optionalUsers.get();
    }
}

