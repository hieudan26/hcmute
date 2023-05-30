package backend.data.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "chat_room_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomMember extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRooms chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @Column(name = "status")
    private String status = "none";

    // Constructors, getters, and setters
}
