package backend.data.dto.user;

import backend.custom.annotation.ValidDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.NotEmpty;
@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStatusFriendsRequest {
    @NotEmpty(message = "The friendId is required")
    String friendId;
    @NotEmpty(message = "The time is required")
    @ValidDateTime(message = "The time is wrong format")
    private String time;

    @NotEmpty(message = "The status is required")
    private String status;
}
