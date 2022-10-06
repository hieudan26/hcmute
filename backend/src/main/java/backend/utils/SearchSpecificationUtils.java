package backend.utils;

import backend.data.dto.global.User.UserQueryParams;
import backend.data.entity.Users;
import backend.repositories.specification.SpecificationsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchSpecificationUtils {
    public static Specification searchBuilder(UserQueryParams query){
        SpecificationsBuilder builder = new SpecificationsBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.valueToTree(query);
        for (var field: UserQueryParams.class.getDeclaredFields()) {
            if(!jsonNode.get(field.getName()).isNull()){
                builder.with(field.getName(), ":", jsonNode.get(field.getName()).asText());
            }
        }
        return builder.build();
    }
}
