package backend.data.dto.place;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceResponse {
    Integer id;
    String name;
    String url;
    String image;
    String content;
    PlaceCategoryPayLoad category;
}
