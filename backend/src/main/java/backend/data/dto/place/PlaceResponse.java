package backend.data.dto.place;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceResponse {
    Integer id;
    String name;
    String url;
    String description;
    String image;
    String content;
    String status;
    String userId;
    String statusDescription;
    PlaceCategoryPayLoad category;
    List<String> hashTags;
}
