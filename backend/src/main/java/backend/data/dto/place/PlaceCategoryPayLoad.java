package backend.data.dto.place;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceCategoryPayLoad {
    Integer id;
    String name;
    String image;
    Boolean isDisable = false;
}
