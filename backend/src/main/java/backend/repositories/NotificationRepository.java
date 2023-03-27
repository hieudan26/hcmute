package backend.repositories;

import backend.data.entity.Areas;
import backend.data.entity.Notifications;
import backend.data.entity.Places;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface NotificationRepository extends PagingAndSortingRepository<Notifications, Integer>, JpaSpecificationExecutor<Notifications> {
    Page<Notifications> findAllByToUserOrderByReadAscCreationDateDesc(Pageable pageable, String id);
}