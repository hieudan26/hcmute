package backend.repositories;

import backend.data.dto.global.PagingRequest;
import backend.data.entity.Comments;
import backend.data.entity.Posts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface CommentRepository  extends PagingAndSortingRepository<Comments, Integer>, JpaSpecificationExecutor<Posts> {
    @Query(value = "from Comments comment where (comment.post.id = ?1 and comment.parentId is null and comment.isDeleted = false) order by comment.time desc")
    Page<Comments> queryCommentsByPostId(Pageable pageable, Integer id);

    @Query(value = "from Comments comment where (comment.parentId = ?1 and comment.isDeleted = false ) order by comment.time desc ")
    List<Comments> getAllByParentId(Integer parentId);

    Integer countAllByPostIdAndIsDeletedEquals(Integer id,Boolean bool);

}
