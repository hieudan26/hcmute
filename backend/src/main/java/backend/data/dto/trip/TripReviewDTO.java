package backend.data.dto.trip;

import lombok.Data;

@Data
public class TripReviewDTO {
    private Integer id;
    private Float rate;
    private String content;
    private Integer tripId;
    private String ownerId;
    private String reviewAt;
}
