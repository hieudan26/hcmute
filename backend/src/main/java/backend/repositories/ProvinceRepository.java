package backend.repositories;

import backend.data.entity.Countries;
import backend.data.entity.Provinces;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ProvinceRepository  extends PagingAndSortingRepository<Provinces, Integer>, JpaSpecificationExecutor<Provinces> {
    @Query(value = "select new Provinces (province.id, province.name) from Provinces province")
    List<Provinces> getProvincesIdAndName(Pageable pageable);
}
