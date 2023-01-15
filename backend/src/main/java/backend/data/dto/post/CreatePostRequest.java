package backend.data.dto.post;

import backend.custom.annotation.ValidDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePostRequest {
    @JsonIgnore
    String userId;
    @NotEmpty(message = "The type is required")
    String type;
    @NotEmpty(message = "The time is required")
    @ValidDateTime(message = "The time is wrong format")
    private String time;
    @NotEmpty(message = "The content is required")
    String content;
    String title;
    List<String> images;
    List<String> hashTags;
    @JsonIgnore
    Boolean isDeleted =false;
}
