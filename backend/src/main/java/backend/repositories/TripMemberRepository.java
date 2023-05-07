package backend.repositories;

import backend.data.entity.Posts;
import backend.data.entity.TripMembers;
import backend.data.entity.Trips;
import backend.mapper.TripMemberMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripMemberRepository extends PagingAndSortingRepository<TripMembers, Integer>, JpaSpecificationExecutor<Trips> {
    Page<TripMembers> findAll(Specification specification, Pageable pageable);

    @Query("select memmber from TripMembers memmber where memmber.trip.id = :tripId and  memmber.user.isDisable = false and CONCAT(memmber.user.firstName, memmber.user.lastName) like CONCAT('%',:key,'%')  order by memmber.user.firstName desc")
    Page<TripMembers> findAllByTripWithSearch(Integer tripId, String key, Pageable pageable);

}
