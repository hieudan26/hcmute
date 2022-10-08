package backend.repositories;

import backend.data.entity.Countries;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;


import java.util.List;

public interface CountryRepository extends PagingAndSortingRepository<Countries, Integer>, JpaSpecificationExecutor<Countries> {
    @Query(value = "select new Countries(country.id, country.name, country.enName) from Countries country")
    Page<Countries> getCountryIdAndName(Pageable pageable);
}