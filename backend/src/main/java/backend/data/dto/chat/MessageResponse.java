package backend.data.dto.chat;

import backend.data.dto.global.BaseUserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse extends BaseUserResponse {
    private String sender;
    private Integer room;
    private String time;
    private String content;
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
