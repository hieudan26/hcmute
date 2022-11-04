package backend.data.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.NotEmpty;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCommentRequest {
    @NotEmpty(message = "The content is required")
    String content;
}
