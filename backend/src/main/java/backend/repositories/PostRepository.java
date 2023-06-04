package backend.repositories;

import backend.data.entity.Posts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface PostRepository extends PagingAndSortingRepository<Posts, Integer>, JpaSpecificationExecutor<Posts> {
    Page<Posts> findAll(Specification specification, Pageable pageable);

    @Query(value = "from Posts post where post.isDisable = false and post.owner.id = ?1 and post.isDeleted = false and post.status = 'ACTIVE' order by post.time desc")
    Page<Posts> queryPostsByUserId(Pageable pageable, String id);

    @Query(value = "select count(post) from Posts post join post.reaction reaction where post.id =?1")
    Integer countAllByReaction(Integer id);

    @Query(value = "from Posts post join post.reaction reaction where post.id =?1 and reaction.id = ?2")
    Optional<Posts> isReactPost(Integer postId, String userId);

    Page<Posts> findByTitleIgnoreCaseContainingAndIsDisableIsFalseAndStatus(Pageable pageable, String key, String status);
    Page<Posts> findByTypeAndTitleIgnoreCaseContainingAndIsDisableIsFalseAndStatus(Pageable pageable, String type ,String key, String status);

    @Query(value = "select DISTINCT(post) from Posts post join post.hashTags hastTag where hastTag.name =?1 and post.status = 'ACTIVE'")
    Page<Posts> findAllByHashTag(Pageable pageable, String hashTag);
}
