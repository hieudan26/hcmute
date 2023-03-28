package backend.data.dto.socketdto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationsResponse {

    Integer id;
    String type;
    String toUser;
    String fromUser;
    String fullName;
    String description;
    String creationDate;
    Integer contentId;
    boolean status;
}
