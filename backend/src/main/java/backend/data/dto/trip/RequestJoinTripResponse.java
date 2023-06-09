package backend.data.dto.trip;

import backend.data.dto.place.PlaceResponse;
import backend.data.dto.user.UserDTO;
import lombok.Data;

import java.util.List;

@Data
public class RequestJoinTripResponse {
    private Integer id;
    private UserDTO user;
    private Integer tripId;
    private String status;
    private String date;
}