package backend.data.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdviceFriendResponse {
    private String id;
    private String avatar;
    private String fullName;
    private String province;
    private String country;
    private String friendStatus;
}
