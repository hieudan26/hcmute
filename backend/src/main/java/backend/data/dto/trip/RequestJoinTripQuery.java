package backend.data.dto.trip;

import lombok.Data;

@Data
public class RequestJoinTripQuery {
    String userId;
    Integer tripId;
    String status;
}
