package backend.repositories.specification;

import backend.data.dto.global.SearchCriteria;
import backend.data.entity.HashTags;
import backend.data.entity.Posts;
import lombok.AllArgsConstructor;

import javax.persistence.criteria.*;
import java.util.Collection;


@AllArgsConstructor
public class Specification<T> implements org.springframework.data.jpa.domain.Specification<T> {
    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate
            (Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        query.distinct(true);
        if (criteria.getOperation().equalsIgnoreCase("nested")) {
            return builder.equal(
                    root.get(criteria.getKey()).get("id"), criteria.getValue().toString());
        }

        if (criteria.getOperation().equalsIgnoreCase("nestedName")) {
            return builder.equal(
                    root.get(criteria.getKey()).get("name"), criteria.getValue().toString());
        }

        if (criteria.getOperation().equalsIgnoreCase("hashTags")) {
            Join<Posts, HashTags> hashTagsJoin = root.join("hashTags");
            return builder.equal(hashTagsJoin.get("name"), criteria.getValue());
        }

        if (criteria.getOperation().equalsIgnoreCase("=")) {
            return builder.equal(
                    root.<String> get(criteria.getKey()), criteria.getValue());
        }
        if (criteria.getOperation().equalsIgnoreCase(">")) {
            return builder.greaterThanOrEqualTo(
                    root.<String> get(criteria.getKey()), criteria.getValue().toString());
        }
        else if (criteria.getOperation().equalsIgnoreCase("<")) {
            return builder.lessThanOrEqualTo(
                    root.<String> get(criteria.getKey()), criteria.getValue().toString());
        }
        else if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return builder.like(
                        root.<String>get(criteria.getKey()), "%" + criteria.getValue() + "%");
            } else {
                return builder.equal(root.get(criteria.getKey()), criteria.getValue());
            }
        }
        return null;
    }
}
