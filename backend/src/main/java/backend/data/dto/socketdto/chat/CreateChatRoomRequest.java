package backend.data.dto.socketdto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatRoomRequest {
    String time;
    String type;
    String name;
    String ownerId;
    List<String> friends;
}
