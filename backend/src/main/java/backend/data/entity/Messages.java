package backend.data.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "messages")
public class Messages extends Auditable<String> implements Serializable{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    private Users sender;

    @ManyToOne
    private Users receiver;

    private String time;
    private String content;

}
