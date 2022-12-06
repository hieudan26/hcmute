package backend.data.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "place_categories")
@Data
@NoArgsConstructor
public class PlaceCategories extends Auditable<String>implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;
    @Column(unique=true,nullable = false)
    String name;
    String image;
}
