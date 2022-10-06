package backend.repositories;

import backend.data.entity.Provinces;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ProvinceRepository  extends PagingAndSortingRepository<Provinces, Integer>, JpaSpecificationExecutor<Provinces> {
}
