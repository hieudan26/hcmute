package backend.data.dto.trip;

import io.swagger.models.auth.In;
import lombok.Data;

import javax.persistence.Column;
import java.time.LocalDateTime;

@Data
public class CreateTripRequest {
    private String title;
    private String type;
    private Long maxMember;
    private Long maxDay;
    private Integer startingPlace;
    private Long totalPrice;
    private String description;
    private String startTime;
    private String endTime;
    private String status;
    private String shortDescription;
}