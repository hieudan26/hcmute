package backend.repositories;

import backend.data.entity.Friends;
import backend.data.entity.PostImages;
import backend.data.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.awt.*;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<Users, String>, JpaSpecificationExecutor<Users> {
    Optional<Users> findById(String userId);
    @Query("select post.images from Posts post where post.owner.id = :userId and post.isDeleted = false ")
    Page<PostImages> getUserImages(String userId, Pageable pageable);

    @Query("select user.friends from Users user where user.id = :userId and user.isDisable = false ")
    Page<Friends> getFriends(String userId, Pageable pageable);

    @Query("select friend from Users user inner join Friends friend on user = friend.owner where user.id = :userId and friend.status = :status")
    Page<Friends> getFriendsByStatus(String userId, String status, Pageable pageable);

}
