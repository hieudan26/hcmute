package backend.data.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendSearchRequest {
    String status;
    String key;
}
