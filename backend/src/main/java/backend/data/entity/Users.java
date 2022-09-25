package backend.data.entity;


import lombok.Data;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Entity
@Table(name = "users")
@Data
public class Users extends Auditable<String> implements Serializable {
    @Id
    String id;
    String firstName;
    String lastName;
    String gender;
    String dob;
    String coverBackground;
    String avatar;
    String phoneNumber;
    @NotEmpty
    String email;
    String summary;
    String country;
    String city;
    String district;
    String village;
    String role;

}
