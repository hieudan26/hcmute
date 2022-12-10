package backend.data.dto.hashtag;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HashTagResponseWithLabel {
    String value;
    String label;
    String placeUrl;
}
