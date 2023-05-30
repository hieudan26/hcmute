package backend.repositories;

import backend.common.ChatRoomType;
import backend.data.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends PagingAndSortingRepository<ChatRooms,Integer>, JpaSpecificationExecutor<Areas> {
    @Query("select rooms from ChatRooms rooms join rooms.members members where :userId = members.user.id and rooms.isDeleted = false order by rooms.time desc")
    Page<ChatRooms> findAllChatRoom(Pageable pageable, String userId);
    @Query("select rooms from ChatRooms rooms join rooms.members members where rooms.type = :type and :userId = members.user.id and rooms.isDeleted = false order by rooms.time desc")
    Page<ChatRooms> findAllChatRoomByType(Pageable pageable, String userId, ChatRoomType type);

    @Query("from ChatRooms rooms join rooms.members members where :userId in members.user.id and exists " +
            "(select rooms from ChatRooms room2 join room2.members member2 " +
            "where :friendId in member2.user.id and rooms = room2 and rooms.isDeleted = false and member2.status <> 'blocked')")
    List<ChatRooms> findChatRoomsByFriend(String userId, String friendId);

    @Query("select count(rooms) from ChatRooms rooms join rooms.members members where :roomId = rooms.id  and rooms.isDeleted = false and :userId = members.user.id")
    Integer isUserInRoom(Integer roomId, String userId);
    Optional<ChatRooms> findChatRoomsByIdAndIsDeletedIsFalse(Integer id);
}
