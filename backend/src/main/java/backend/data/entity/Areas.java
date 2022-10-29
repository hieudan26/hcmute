package backend.data.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "areas")
@Data
@NoArgsConstructor
public class Areas extends Auditable<String> implements Serializable{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;
    @Column(unique=true,nullable = false)
    String name;
    @Column(unique=true,nullable = false)
    String enName;
    @Column(nullable = false)
    String type;
    @Column(name="parent_id", insertable=false, updatable=false)
    private Integer parentId;
    @OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    @JoinColumn(name="parent_id")
    private Set<Areas> childAreas;

    public void addChild(Areas area) {
        area.setParentId(this.parentId);
        childAreas.add(area);
    }

    public void removeChild(Areas area) {
        area.setParentId(null);
        childAreas.remove(area);
    }

    public Areas(Integer id, String name, String enName) {
        this.id = id;
        this.name = name;
        this.enName = enName;
    }
}
