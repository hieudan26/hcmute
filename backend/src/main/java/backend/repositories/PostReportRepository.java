package backend.repositories;

import backend.data.entity.PostReport;
import backend.data.entity.Posts;
import backend.data.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface PostReportRepository extends PagingAndSortingRepository<PostReport, Integer>, JpaSpecificationExecutor<PostReport> {
    Page<PostReport> findAll(Specification specification, Pageable pageable);
    Page<PostReport> findPostReportByPost_Id(Pageable pageable, Integer id);
    Page<PostReport> findPostReportByOwner_Id(Pageable pageable, String id);

    Optional<PostReport> findPostReportByPost_IdAndOwner_Id(Integer post_id, String user_id);
    @Modifying
    int deleteAllByPost_Id(Integer id);
}
