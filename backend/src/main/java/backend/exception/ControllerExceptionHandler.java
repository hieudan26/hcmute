package backend.exception;

import backend.data.dto.global.ErrorMessage;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
@ResponseBody
public class ControllerExceptionHandler extends GlobalControllerExceptionHandler{
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException exception,
            HttpHeaders httpHeaders,
            HttpStatus status,
            WebRequest webRequest){
        if(exception.getCause() instanceof JsonParseException
            || exception.getCause() instanceof JsonMappingException
        ){
            return new ResponseEntity<>(
                    new ErrorMessage(
                            "Request body JSON must be valid (correct structure, dataType, value range, etc)."),
                            status
                    );
        } else if (exception.getMessage() != null && exception.getCause() instanceof InvalidFormatException) {
            String message = getInvalidFormatExceptionFieldName((InvalidFormatException) exception.getCause())
                    .concat(" must be valid.");
            return new ResponseEntity<>(new ErrorMessage(StringUtils.capitalize(message)),status);
        }
        return super.handleHttpMessageNotReadable(exception,httpHeaders,status,webRequest);
    }

    @Override
    public ResponseEntity<?> handleAllException(
            Throwable exception,
            WebRequest webRequest,
            HttpServletRequest httpServletRequest){
        return super.handleAllException(exception,webRequest,httpServletRequest);

    }

    @Override
    protected ResponseEntity<Object> handleBindException(
            org.springframework.validation.BindException ex,
            HttpHeaders httpHeaders,
            HttpStatus status,
            WebRequest webRequest){
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getDefaultMessage()
                ).map(StringUtils::capitalize)
                .sorted()
                .toList();
        String message = String.join(". ",errors).concat(".");
        ErrorMessage errorMessage = new ErrorMessage(message.replace("..","."));
        return new ResponseEntity<>(errorMessage,HttpStatus.BAD_REQUEST);
    }

    private String getInvalidFormatExceptionFieldName(InvalidFormatException exception){
        for(JsonMappingException.Reference reference: exception.getPath()){
            return reference.getFieldName();
        }
        return null;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity accessDeniedException(AccessDeniedException e) throws AccessDeniedException {
        logger.info(e.toString());
        throw e;
    }
}
