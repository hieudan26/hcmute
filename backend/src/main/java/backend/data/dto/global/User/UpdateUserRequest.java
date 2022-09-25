package backend.data.dto.global.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.Email;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    public String firstName;
    public String lastName;
    public String gender;
    public String dob;
    public String coverBackground;
    public String avatar;
    public String phoneNumber;
    public String summary;
    public String country;
    public String city;
    public String district;
    public String village;
}
