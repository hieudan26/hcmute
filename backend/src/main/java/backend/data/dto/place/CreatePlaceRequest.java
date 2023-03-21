package backend.data.dto.place;

import backend.utils.LinkUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePlaceRequest {
    @NotEmpty
    String name;
    String content;
    String description;
    String status;
    String statusDescription;

    Integer category;
    Integer area;
    String image;
    List<String> hashTags;

}
