package backend.repositories;

import backend.data.entity.PlaceCategories;
import backend.data.entity.Places;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface PlaceCategoryRepository extends PagingAndSortingRepository<PlaceCategories,Integer>, JpaSpecificationExecutor<PlaceCategories> {
}
