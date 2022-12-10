package backend.repositories.specification;

import backend.data.dto.global.SearchCriteria;
import backend.data.entity.Posts;

import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class SpecificationsBuilder<T> {
    private final List<SearchCriteria> params;

    public SpecificationsBuilder() {
        params = new ArrayList<SearchCriteria>();
    }

    public SpecificationsBuilder with(String key, String operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }

    public org.springframework.data.jpa.domain.Specification<T> buildOr() {
        if (params.size() == 0) {
            return null;
        }
        List<org.springframework.data.jpa.domain.Specification> specs = params.stream()
                .map(Specification::new)
                .collect(Collectors.toList());

        org.springframework.data.jpa.domain.Specification result = specs.get(0);
        for (int i = 1; i < params.size(); i++) {
            result =  org.springframework.data.jpa.domain.Specification.where(result).or(specs.get(i));
        }
        return result;
    }

    public org.springframework.data.jpa.domain.Specification<T> buildAnd() {
        if (params.size() == 0) {
            return null;
        }
        List<org.springframework.data.jpa.domain.Specification> specs = params.stream()
                .map(Specification::new)
                .collect(Collectors.toList());

        org.springframework.data.jpa.domain.Specification result = specs.get(0);
        for (int i = 1; i < params.size(); i++) {
            result =  org.springframework.data.jpa.domain.Specification.where(result).and(specs.get(i));
        }
        return result;
    }
}
