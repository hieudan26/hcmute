package backend.repositories;

import backend.data.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface ChatRoomRepository extends PagingAndSortingRepository<ChatRooms,Integer>, JpaSpecificationExecutor<Areas> {
    @Query("from ChatRooms rooms join rooms.members members where :userId = members.id order by rooms.time desc")
    Page<ChatRooms> findAllChatRoom(Pageable pageable, String userId);

    @Query("from ChatRooms rooms join rooms.members members where :userId in members and exists " +
            "(select rooms from ChatRooms room2 join room2.members member2 where :friendId in member2 and rooms = room2)")
    Optional<ChatRooms> findChatRoomsByFriend(String userId, String friendId);
    @Query("select count(rooms) from ChatRooms rooms join rooms.members members where :roomId = rooms.id and :userId = members.id")
    Integer isUserInRoom(Integer roomId, String userId);
}