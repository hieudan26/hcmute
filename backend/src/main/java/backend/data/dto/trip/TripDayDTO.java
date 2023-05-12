package backend.data.dto.trip;

import backend.data.dto.place.PlaceResponse;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TripDayDTO {
    private Integer id;
    private Integer tripId;
    private Long ordinal;
    private String description;
    private String date;
    private List<TripPlaceDTO> tripPlaces;
    private List<PlaceResponse> provinces;
}