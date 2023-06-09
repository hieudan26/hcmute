package backend.data.dto.trip;

import lombok.Data;

@Data
public class UpdateRequestJoinTrip {
    String userId;
    String status;
}
