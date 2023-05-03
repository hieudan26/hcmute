package backend.data.dto.trip;

import lombok.Data;

@Data
public class TripMemberDTO {
    private String role;
    private String userId;
    private Integer tripId;
}