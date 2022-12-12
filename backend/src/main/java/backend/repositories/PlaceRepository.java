package backend.repositories;

import backend.data.entity.Areas;
import backend.data.entity.Messages;
import backend.data.entity.Places;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface PlaceRepository extends PagingAndSortingRepository<Places,Integer>, JpaSpecificationExecutor<Places> {
    Page<Places> findByPlaceCategories_Name(Pageable pageable, String name);

    @Query("select places from Places places where places.areas.parentId = :areaId and places.placeCategories.name = :type order by places.name asc")
    Page<Places> findAllProvince(Pageable pageable, Integer areaId, String type);

    @Query("select places from Places places where places.areas.id = :areaId and  places.placeCategories.name not in ('country','province') order by places.name asc")
    Page<Places> findAllPlaceByProvince(Pageable pageable, Integer areaId);

    @Query("select places from Places places where places.areas.id = :areaId and places.placeCategories.name = :type order by places.name asc")
    Page<Places> findAllPlaceByProvinceWithType(Pageable pageable, Integer areaId, String type);

    @Query("select places from Places places where places.areas.id = :areaId and places.url = :url")
    Optional<Places> findPlaceByUrl(Integer areaId, String url);

    @Query("select places from Places places where places.areas.parentId = :areaId and places.url = :url")
    Optional<Places> findProvinceByUrl(Integer areaId, String url);
    Optional<Places> findByUrl(String url);

}
