package backend.data.dto.area.listItem;

import backend.common.AreaConstant;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCountryRequest {
    @JsonIgnore
    Integer parentId = null;
    String name;
    String enName;
    @JsonIgnore
    String type = AreaConstant.COUNTRY.getTypeName();
}
