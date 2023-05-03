package backend.data.dto.trip;

import lombok.Data;

@Data
public class UpdateTripPlaceFeesDTO {
    private Integer id;
    private String name;
    private Long value;
    private String description;
    private Boolean isRequired;
}