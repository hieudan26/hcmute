package backend.data.dto.global.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFirstLoginRequest {
    public String firstName;
    public String lastName;
    public String gender;
    public String dob;
    public String coverBackground;
    public String avatar;
    public String phoneNumber;
    @Email
    @NotBlank
    public String email;
    public String summary;
    public String country;
    public String city;
    public String district;
    public String village;
}
