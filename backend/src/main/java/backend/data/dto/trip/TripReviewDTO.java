package backend.data.dto.trip;

import lombok.Data;

@Data
public class TripReviewDTO {
    private Integer id;
    private Long rate;
    private String content;
    private Long tripId;
    private Long ownerId;
}
