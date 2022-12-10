package backend.data.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "hashtags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HashTags extends Auditable<String>implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;

    @Column(unique=true,nullable = false)
    String name;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "place_id", nullable = false)
    Places places;

}
