package backend.data.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.Email;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserQueryParams{
    String firstName;
    String lastName;
    String gender;
    String dob;
    String phoneNumber;
    @Email
    String email;
    String summary;
    String country;
    String city;
    String district;
    String village;
    String role;
}
