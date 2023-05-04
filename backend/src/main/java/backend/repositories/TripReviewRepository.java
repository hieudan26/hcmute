package backend.repositories;

import backend.data.dto.global.PagingRequest;
import backend.data.entity.TripPlaceFees;
import backend.data.entity.TripReviews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripReviewRepository extends PagingAndSortingRepository<TripReviews, Integer>, JpaSpecificationExecutor<TripReviews> {
    Page<TripReviews> findAllByTrip_Id(Integer id, Pageable pageable);
}
