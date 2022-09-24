package backend.data.dto.global;

import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@SuperBuilder
@Data
public class ErrorMessage {
    private UUID id = UUID.randomUUID();
    private String message;

    public ErrorMessage(String message){
        this.message = message;
    }
}
