package backend.repositories;

import backend.data.entity.TripPlaces;
import backend.data.entity.Trips;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripPlaceRepository extends PagingAndSortingRepository<TripPlaces, Integer>, JpaSpecificationExecutor<TripPlaces> {
    Page<TripPlaces> findAll(Specification specification, Pageable pageable);
}
