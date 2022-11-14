package backend.chat;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;
}
