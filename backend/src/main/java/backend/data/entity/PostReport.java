package backend.data.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
@Entity
@Table(name = "post_report")
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PostReport extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "user_id", nullable = false)
    Users owner;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "post_id", nullable = false)
    Posts post;

    @Column(nullable = false)
    @Lob
    String content;

    LocalDateTime time = LocalDateTime.now();
}