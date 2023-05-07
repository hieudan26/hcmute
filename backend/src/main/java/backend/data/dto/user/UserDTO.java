package backend.data.dto.user;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String gender;
    private String dob;
    private String coverBackground;
    private String avatar;
    private String phoneNumber;
    private String email;
    private String summary;
    private String country;
    private String city;
    private String district;
    private String village;

    // Getters and setters for the properties
}
