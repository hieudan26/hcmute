package backend.data.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.common.aliasing.qual.Unique;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "countries")
@Data
@NoArgsConstructor
public class Countries extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;
    @Column(unique=true,nullable = false)
    String name;
    @OneToMany(mappedBy = "country",
            orphanRemoval = true,
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    List<Provinces> provinces;
    public Countries(Integer id, String name){
        this.id = id;
        this.name = name;
    }

}
