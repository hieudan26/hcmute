package backend.data.dto.post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    String id;
    String userId;
    String avatar;
    String fullName;
    String type;
    String content;
    String time;
    Integer commentNumber;
    Integer reactNumber;
    List<String> images;
    Boolean isReacted;
    Boolean isDeleted;
    List<String> hashTags;
}
