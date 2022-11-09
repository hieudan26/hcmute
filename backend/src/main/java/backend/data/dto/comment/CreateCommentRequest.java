package backend.data.dto.comment;

import backend.custom.annotation.ValidDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCommentRequest {
    @NotEmpty(message = "The content is required")
    private String content;

    @NotEmpty(message = "The time is required")
    @ValidDateTime(message = "The time is wrong format")
    private String time;

    @NotNull(message = "The postId is required")
    private Integer postId;

    private Integer parentId;

    @JsonIgnore
    private String userId;
    @JsonIgnore
    Boolean isDeleted = false;
}
