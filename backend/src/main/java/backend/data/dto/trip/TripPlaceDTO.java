package backend.data.dto.trip;

import backend.data.dto.place.PlaceResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TripPlaceDTO {
    private Integer id;
    private PlaceResponse place;
    private Long ordinal;
    private String transport;
    private String travelTime;
    private String travelPrice;
    private String startTime;
    private String endTime;
    private Long dayId;
    private List<TripPlaceFeeDTO> tripPlaceFees;
}
