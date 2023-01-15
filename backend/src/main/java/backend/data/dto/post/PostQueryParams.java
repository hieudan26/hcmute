package backend.data.dto.post;

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
}
