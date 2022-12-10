package backend.repositories;

import backend.data.entity.HashTags;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface HashtagRepository extends PagingAndSortingRepository<HashTags, Integer>, JpaSpecificationExecutor<HashTags> {
    @Query("from HashTags hastag where hastag.name = :name")
    Optional<HashTags> findHashTagsByName(String name);
    Set<HashTags> getByPlaces_Id(Integer placeId);
    Optional<HashTags> getByNameAndPlaces_IdNot(String name, Integer placeId);
}
