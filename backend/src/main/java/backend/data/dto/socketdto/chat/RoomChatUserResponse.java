package backend.data.dto.socketdto.chat;

import backend.data.dto.global.BaseUserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomChatUserResponse extends BaseUserResponse {
    String userId;
}
