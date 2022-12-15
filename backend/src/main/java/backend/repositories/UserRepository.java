package backend.repositories;

import backend.data.entity.Friends;
import backend.data.entity.PostImages;
import backend.data.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<Users, String>, JpaSpecificationExecutor<Users> {
    Optional<Users> findById(String userId);
    @Query("select images from Posts post inner join PostImages images on post = images.post where post.owner.id = :userId and post.isDeleted = false order by images.creationDate desc ")
    Page<PostImages> getUserImages(String userId, Pageable pageable);

    @Query("select friends from Friends friends  inner join Users user  on user = friends.owner where user.id = :userId and user.isDisable = false order by friends.time desc ")
    Page<Friends> getFriends(String userId, Pageable pageable);

    @Query("select friends from Friends friends inner join  Users user on user = friends.owner where user.id = :userId and friends.status = :status order by friends.time desc ")
    Page<Friends> getFriendsByStatus(String userId, String status, Pageable pageable);

}
