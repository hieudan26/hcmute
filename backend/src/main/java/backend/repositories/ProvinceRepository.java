package backend.repositories;

import backend.data.entity.Countries;
import backend.data.entity.Provinces;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ProvinceRepository  extends PagingAndSortingRepository<Provinces, Integer>, JpaSpecificationExecutor<Provinces> {
    @Query(value = "select new Provinces (province.id, province.name) from Provinces province where province.country.id = ?1")
    Page<Provinces> getProvincesIdAndNameByCountryId(Integer id, Pageable pageable);
    @Query(value = "select province from Provinces province where province.country.id = ?1")

    Page<Provinces> findAllByCountryId(Integer id, Pageable pageable);
}
