package backend.data.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "trip_days")
public class TripDays{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Long ordinal;

    @ManyToOne(fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "trip_id")
    private Trips trip;

    @Column(nullable = false)
    @Lob
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @OneToMany(mappedBy = "tripDay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripPlaces> tripPlaces  = new ArrayList<>();
}
