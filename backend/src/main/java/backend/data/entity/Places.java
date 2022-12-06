package backend.data.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "places")
@Data
@NoArgsConstructor
public class Places extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;
    @Column(unique=true,nullable = false)
    String name;

    @Column(unique=true,nullable = false)
    String url;

    String image;

    @Lob
    String content;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JoinColumn(name = "place_category_id", nullable = false)
    PlaceCategories placeCategories;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JoinColumn(name = "area_id", nullable = false)
    Areas areas;
}
