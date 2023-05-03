package backend.data.dto.trip;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateTripDayDTO {
    private Integer id;
    private Long ordinal;
    private String description;
    private String date;
    private List<UpdateTripPlaceDTO> tripPlaces;
}
