package backend.data.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

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

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Set<Posts> posts = new HashSet<>();

    public void addPost(Posts post) {
        post.setOwner(this);
    }

    public void removePost(Posts post) {
        post.setOwner(null);
        this.posts.remove(post);
    }
}
