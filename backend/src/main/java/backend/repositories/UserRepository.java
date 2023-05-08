package backend.repositories;

import backend.data.entity.Friends;
import backend.data.entity.PostImages;
import backend.data.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<Users, String>, JpaSpecificationExecutor<Users> {
    Optional<Users> findByIdAndIsDisableIsFalse(String userId);

    @Query("select images from Posts post inner join PostImages images on post = images.post where post.owner.id = :userId and post.isDeleted = false order by images.creationDate desc ")
    Page<PostImages> getUserImages(String userId, Pageable pageable);

    @Query("select friends from Friends friends  inner join Users user  on user = friends.owner where user.id = :userId and friends.status <> 'no_friend' and user.isDisable = false and friends.friend.isDisable = false order by friends.time desc ")
    Page<Friends> getFriends(String userId, Pageable pageable);
    @Query("select friends from Friends friends  inner join Users user  on user = friends.owner where user.id = :userId and friends.status <> 'no_friend' and user.isDisable = false and friends.friend.isDisable = false and (friends.friend.firstName LIKE CONCAT('%', :key, '%') OR friends.friend.lastName LIKE CONCAT('%', :key, '%')) order by friends.time desc ")
    Page<Friends> getFriendsWithSearch(String userId, String key, Pageable pageable);

    @Query("select friends from Friends friends inner join  Users user on user = friends.owner where user.id = :userId and friends.status = :status and friends.friend.isDisable = false and friends.status <> 'no_friend' and user.isDisable = false order by friends.time desc ")
    Page<Friends> getFriendsByStatus(String userId, String status, Pageable pageable);
    @Query("select friends from Friends friends inner join  Users user on user = friends.owner where user.id = :userId and friends.status = :status and friends.status <> 'no_friend' and user.isDisable = false and friends.friend.isDisable = false and (friends.friend.firstName LIKE CONCAT('%', :key, '%') OR friends.friend.lastName LIKE CONCAT('%',:key, '%'))  order by friends.time desc ")
    Page<Friends> getFriendsByStatusWithSearch(String userId, String status, String key, Pageable pageable);

    @Query("select user1 from Users user1 where user1.country = :country and user1.isDisable = false and user1 not in (select friend.friend from Users user inner join Friends friend on user = friend.owner and friend.friend.isDisable = false where (user.id = :userId and friend.status = 'friend')) and user1.role <> 'ADMIN' and user1.id <> :userId order by case when user1.country = :country then 0 else 1 end,case when user1.city = :city then 0 else 1 end,case when user1.district = :district then 0 else 1 end,case when user1.village = :village then 0 else 1 end")
    Page<Users> getAdviceFriends(String userId, String village, String district, String city, String country, Pageable pageable);

}
