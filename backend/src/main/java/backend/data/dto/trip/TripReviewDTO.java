package backend.data.dto.trip;

import backend.data.dto.user.UserDTO;
import backend.data.entity.Users;
import lombok.Data;

@Data
public class TripReviewDTO {
    private Integer id;
    private Float rate;
    private String content;
    private Integer tripId;
    private UserDTO owner;
    private String reviewAt;
}
