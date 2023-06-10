package backend.repositories;

import backend.data.entity.Areas;
import backend.data.entity.Posts;
import backend.data.entity.RequestJoinTrip;
import backend.data.entity.TripMembers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface RequestJoinTripRepository extends PagingAndSortingRepository<RequestJoinTrip, Integer>, JpaSpecificationExecutor<RequestJoinTrip> {
    Optional<RequestJoinTrip> getByTrips_IdAndUser_IdAndStatus(Integer tripId, String userId,String status);
    Optional<RequestJoinTrip> getByTrips_IdAndUser_Id(Integer tripId, String userId);

    Page<RequestJoinTrip> findAll(Specification specification, Pageable pageable);
    Optional<RequestJoinTrip> findAllByTrips_IdAndUser_Id(Integer tripId, String userId);

    Page<RequestJoinTrip> findAllByStatus(String status, Pageable pageable);

    Page<RequestJoinTrip> findAllByUser_Id(String userId, Pageable pageable);

    Page<RequestJoinTrip> findAllByTrips_Id(Integer tripId, Pageable pageable);

    Page<RequestJoinTrip> findAllByUser_IdAndStatus(String userId, String status, Pageable pageable);

    Page<RequestJoinTrip> findAllByTrips_IdAndStatus(Integer tripId, String status, Pageable pageable);

    Page<RequestJoinTrip> findAll(Pageable pageable);
}