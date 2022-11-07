package backend.repositories;

import backend.data.entity.Areas;
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

    @Query(value = "from Posts post where post.isDisable = false and post.owner.id = ?1")
    Page<Posts> queryPostsByUserId(Pageable pageable, String id);

    @Query(value = "select count(post) from Posts post join post.reaction reaction where post.id =?1")
    Integer countAllByReaction(Integer id);

    @Query(value = "from Posts post join post.reaction reaction where post.id =?1 and reaction.id = ?2")
    Optional<Posts> isReactPost(Integer postId, String userId);

}
