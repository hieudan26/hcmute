package backend.repositories;

import backend.data.entity.Areas;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface AreaRepository extends PagingAndSortingRepository<Areas, Integer>, JpaSpecificationExecutor<Areas> {
    @Query(value = "from Areas area where area.type = ?1")
    Page<Areas> queryAreaByType(Pageable pageable, String type);

    @Query(value = "from Areas area where area.type = ?1 and area.id = ?2")
    Optional<Areas> queryAreaByTypeAndId(String type, Integer id);

    @Query(value = "from  Areas area where area.parentId = ?1")
    Page<Areas> queryProvincesByCountryId(Pageable pageable, Integer id);

    @Query(value = "select new Areas(area.id, area.name, area.enName) from Areas area where area.type = ?1")
    Page<Areas> queryAreaListByType(Pageable pageable, String type);

    @Query(value = "select new Areas(area.id, area.name, area.enName) from  Areas area where area.parentId = ?1")
    Page<Areas> queryProvincesListByCountryId(Pageable pageable, Integer id);

}