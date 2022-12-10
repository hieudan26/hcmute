package backend.data.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "friends")
public class Friends extends Auditable<String> implements Serializable{
    @EmbeddedId
    private Key key = new Key();
    @ManyToOne
    @MapsId("ownerId")
    private Users owner;
    @ManyToOne
    @MapsId("friendId")
    private Users friend;
    private String status;
    private LocalDateTime time = LocalDateTime.now();

    @Embeddable
    public static class Key implements Serializable {
        private String ownerId;
        private String friendId;
    }
}
