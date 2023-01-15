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
public class UpdatePostRequest {
    String type;
    String title;
    String content;
    List<String> images;
    List<String> hashTags;
}
