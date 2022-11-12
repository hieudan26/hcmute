package backend.data.dto.user;

import backend.data.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendResponse {
    private String userId;
    private String avatar;
    private String fullName;
    private String status;
    private String time;
}
