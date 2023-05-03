package backend.data.dto.trip;

import lombok.Data;

@Data
public class TripPlaceFeeDTO {
    private Integer id;
    private Long tripPlaceId;
    private String name;
    private Long value;
    private String description;
    private Boolean isRequired;
}