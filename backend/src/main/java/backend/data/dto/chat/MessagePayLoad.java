package backend.data.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessagePayLoad {
    private String sender;
    private String receiver;
    private String time;
    private String content;
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
