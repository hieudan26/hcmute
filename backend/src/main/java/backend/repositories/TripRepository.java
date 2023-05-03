package backend.repositories;

import backend.data.entity.Posts;
import backend.data.entity.Trips;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends PagingAndSortingRepository<Trips, Integer>, JpaSpecificationExecutor<Trips> {
    Page<Trips> findAll(Specification specification, Pageable pageable);
    Page<Trips> findAllByTitleContainingIgnoreCase(String key, Pageable pageable);

}
