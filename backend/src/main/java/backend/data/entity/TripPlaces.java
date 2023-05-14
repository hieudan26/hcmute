package backend.data.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "trip_places")
public class TripPlaces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "place_id")
    private Places places;
    @Column(nullable = false)
    private Long ordinal;

    private String transport;

    @Column(name = "travel_time")
    private String travelTime;

    @Column(name = "travel_price")
    private String travelPrice;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "day_id")
    private TripDays tripDay;

    @OneToMany(mappedBy = "tripPlace", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripPlaceFees> tripPlaceFees  = new ArrayList<>();;
}

