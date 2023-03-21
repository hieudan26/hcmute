package backend.data.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "places")
@Data
@NoArgsConstructor
public class Places extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "user_id", nullable = false)
    Users owner;

    @Column(unique=true,nullable = false)
    String name;

    @Column(unique=true,nullable = false)
    String url;

    String image;
    @Lob
    String description;

    @Lob
    String content;

    @Lob
    String statusDescription;

    String status;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "place_category_id", nullable = false)
    PlaceCategories placeCategories;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "area_id", nullable = false)
    Areas areas;

    @OneToMany(mappedBy = "places", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Set<HashTags> hashTags = new HashSet<>();

    public void setHashTags(Set<HashTags> hashTags) {
        this.hashTags.clear();
        this.hashTags.addAll(hashTags);
    }
    public void removeHashTags(HashTags aSon)
    {
        this.hashTags.remove(aSon);
    }
}
