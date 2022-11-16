package backend.repositories;

import backend.data.entity.Areas;
import backend.data.entity.Messages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface MessageRepository extends PagingAndSortingRepository<Messages,Integer>, JpaSpecificationExecutor<Areas> {
    @Query(value = "from Messages message where (message.receiver.id = ?1 and message.sender.id = ?2) or (message.receiver.id = ?2 and message.sender.id = ?1) order by message.time desc")
    Page<Messages> queryMessageByUserIdAndFriendId(Pageable pageable, String userId, String friendId);
}