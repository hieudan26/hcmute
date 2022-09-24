package backend.data.dto.global.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFirstLoginRequest {
    String firstName;
    String lastName;
    String gender;
    String dob;
    String coverBackground;
    String avatar;
    String phoneNumber;
    String email;
    String summary;
    String country;
    String city;
    String district;
    String village;
}
