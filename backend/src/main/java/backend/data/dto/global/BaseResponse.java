package backend.data.dto.global;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
public class BaseResponse {
    private String message;
    private Object data;
}
