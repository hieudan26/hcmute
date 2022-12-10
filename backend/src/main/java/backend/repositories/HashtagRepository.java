package backend.repositories;

import backend.data.entity.HashTags;
import backend.data.entity.PostImages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("from HashTags hastag where hastag.name LIKE CONCAT('%',:name,'%')")
    Page<HashTags> findHashTags(Pageable pageable, String name);
    Set<HashTags> getByPlaces_Id(Integer placeId);
    Optional<HashTags> getByNameAndPlaces_IdNot(String name, Integer placeId);
    @Query("select images from Posts post join post.images images join post.hashTags hash where post.type = ?1 and hash.name = ?2 order by images.creationDate desc")
    Page<PostImages> getHashTagImage(Pageable pageable, String type, String hashtag);
}
