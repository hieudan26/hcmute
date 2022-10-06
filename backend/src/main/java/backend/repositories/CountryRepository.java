package backend.repositories;

import backend.data.entity.Countries;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface CountryRepository extends PagingAndSortingRepository<Countries, Integer>, JpaSpecificationExecutor<Countries> {
}