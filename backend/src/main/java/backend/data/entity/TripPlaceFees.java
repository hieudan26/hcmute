package backend.data.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "trip_place_fees")
public class TripPlaceFees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "trip_place_id")
    private TripPlaces tripPlace;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long value;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String description;

    @Column(nullable = false)
    private Boolean isRequired;
}
