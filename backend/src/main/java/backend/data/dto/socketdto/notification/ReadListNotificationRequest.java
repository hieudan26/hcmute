package backend.data.dto.socketdto.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReadListNotificationRequest extends ReadNotificationRequest {
    List<Integer> listNotifications;
}
