package backend.data.dto.trip;

import backend.data.entity.TripDays;
import backend.data.entity.TripMembers;
import backend.data.entity.TripReviews;
import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TripResponse {
    private Integer id;
    private String title;
    private String ownerId;
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

    private List<TripDayDTO> tripDays;
    private List<TripMemberDTO> tripMembers;
}