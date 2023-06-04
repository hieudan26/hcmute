package backend.data.dto.post;

import backend.common.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostQueryParams {
    String type;
    List<String> hashTags;
    String userId;
    Boolean isDeleted = false;
    Boolean isDisable = false;
    String status = PostStatus.ACTIVE.name();
}
