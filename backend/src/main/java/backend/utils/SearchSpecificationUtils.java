package backend.utils;

import backend.common.PostStatus;
import backend.data.dto.place.PlaceRequestParams;
import backend.data.dto.post.PostQueryParams;
import backend.data.dto.user.UserQueryParams;
import backend.data.entity.Places;
import backend.data.entity.Posts;
import backend.repositories.PlaceRepository;
import backend.repositories.specification.SpecificationsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;

@Service
@RequiredArgsConstructor
public class SearchSpecificationUtils {
    public static<T> Specification searchBuilder(T query){
        SpecificationsBuilder builder = new SpecificationsBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(query);

        for (var field: query.getClass().getDeclaredFields()) {
            if(!jsonNode.get(field.getName()).isNull()){
                if(jsonNode.get(field.getName()).isBoolean()){
                    builder.with(field.getName(), "=", Boolean.valueOf(jsonNode.get(field.getName()).asText()));
                }else{
                    builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
                }
            }
        }
        return builder.buildOr();
    }

    public static Specification searchBuilder(PostQueryParams query, boolean isAdmin){
        SpecificationsBuilder<Posts> builder = new SpecificationsBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(query);
        for (var field: query.getClass().getDeclaredFields()) {
            if(!jsonNode.get(field.getName()).isNull()){
                if(field.getName().equals("hashTags")){
                    continue;
                }
                if(field.getName().equals("userId")){
                    builder.with("owner", "nested", jsonNode.get(field.getName()).asText());
                }
                else if(jsonNode.get(field.getName()).isBoolean()){
                    builder.with(field.getName(), "=", Boolean.valueOf(jsonNode.get(field.getName()).asText()));
                }else{
                    builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
                }
            }
        }

        SpecificationsBuilder<Posts> builder2 = new SpecificationsBuilder();

        if(jsonNode.get("hashTags") != null){
            for (final JsonNode objNode : jsonNode.get("hashTags"))
                builder2.with("hashTags", "hashTags", objNode.asText());
        }
        if (!isAdmin) {
            builder.with("status", "=", PostStatus.ACTIVE.name());
        }
        return builder.buildAnd().and(builder2.buildOr());
    }

    public static Specification searchBuilder(PlaceRequestParams query){
        SpecificationsBuilder<Places> builder = new SpecificationsBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(query);
        for (var field: query.getClass().getDeclaredFields()) {
            if(!jsonNode.get(field.getName()).isNull()){
                if(field.getName().equals("userId")){
                    builder.with("owner", "nested", jsonNode.get(field.getName()).asText());
                }
                else if(field.getName().equals("type")){
                    builder.with("placeCategories", "nestedName", jsonNode.get(field.getName()).asText());
                }
                else if(jsonNode.get(field.getName()).isBoolean()){
                    builder.with(field.getName(), "=", Boolean.valueOf(jsonNode.get(field.getName()).asText()));
                }else{
                    builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
                }
            }
        }
        return builder.buildAnd();
    }
}
