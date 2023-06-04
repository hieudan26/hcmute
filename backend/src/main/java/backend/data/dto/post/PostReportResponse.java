package backend.data.dto.post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostReportResponse {
    String id;
    String userId;
    String avatar;
    String fullName;
    String content;
    Integer postId;
    String time;
}
