package backend.repositories;

import backend.data.entity.Areas;
import backend.data.entity.ChatRooms;
import backend.data.entity.Messages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface MessageRepository extends PagingAndSortingRepository<Messages,Integer>, JpaSpecificationExecutor<Areas> {
    Page<Messages> findAllByRoom(Pageable pageable, ChatRooms chatRooms);
}