package backend.data.dto.global;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagingRequest {
    int pageSize = 20;
    int pageNumber = 0;
    String sortBy = "id";
    String sortType = "ASC";
}
