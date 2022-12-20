package backend.repositories.specification;

import backend.common.Roles;
import backend.data.entity.Users;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.*;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
public class SearchSpecification {
    public static Specification containsTextInAttributes(String text, List<String> attributes) {
        SpecificationsBuilder builder = new SpecificationsBuilder();
        for (var att : attributes){
            builder.with(att, ":", text);
        }
        var buildQuery = builder.buildOr();

        SpecificationsBuilder builder2 = new SpecificationsBuilder();
        builder2.with("role", ":", Roles.USER.getRoleName());
        return org.springframework.data.jpa.domain.Specification.where(buildQuery).and(builder2.buildAnd());
    }
}
