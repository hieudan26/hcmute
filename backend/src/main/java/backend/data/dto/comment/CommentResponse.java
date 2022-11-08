package backend.data.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Integer id;
    private String userId;
    private String fullName;
    private Integer postId;
    private Integer parentId;
    private String time;
    private String content;
    private String avatar;
    private List<CommentResponse> childs;
    Boolean isDeleted;
}
