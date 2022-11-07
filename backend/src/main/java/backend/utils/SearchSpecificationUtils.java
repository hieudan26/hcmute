package backend.utils;

import backend.data.dto.post.PostQueryParams;
import backend.data.dto.user.UserQueryParams;
import backend.repositories.specification.SpecificationsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
                    builder.with(field.getName(), "=", jsonNode.get(field.getName()).asText());
                }else{
                    builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
                }
            }
        }
        return builder.build();
    }

    public static Specification searchBuilder(PostQueryParams query){
        SpecificationsBuilder builder = new SpecificationsBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(query);
        for (var field: query.getClass().getDeclaredFields()) {
            if(!jsonNode.get(field.getName()).isNull()){
                if(field.getName().equals("userId")){
                    builder.with("owner", "nested", jsonNode.get(field.getName()).asText());
                }
                else if(jsonNode.get(field.getName()).isBoolean()){
                builder.with(field.getName(), "=", jsonNode.get(field.getName()).asText());
                }else{
                    builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
                }
            }
        }
        return builder.build();
    }
}
