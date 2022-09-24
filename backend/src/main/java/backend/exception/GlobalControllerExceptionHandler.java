package backend.exception;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.StringUtils;
import backend.data.dto.global.ErrorMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalControllerExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    public ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request){
        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorMessage("Request Endpoint not found."));
    }

    @Override
    public ResponseEntity<Object> handleMissingPathVariable(
            MissingPathVariableException ex, HttpHeaders headers, HttpStatus status, WebRequest request){
        return super.handleMissingPathVariable(ex,headers,status,request);
    }

    @Override
    public ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request){
        List<String> errors =
                ex.getBindingResult().getFieldErrors().stream()
                        .map(FieldError::getDefaultMessage)
                        .map(StringUtils::capitalize)
                        .sorted()
                        .toList();
        String message = String.join(". ",errors).concat(".");
        ErrorMessage errorMessage = new ErrorMessage(message.replace("..","."));
        return new ResponseEntity<>(errorMessage,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(Throwable.class)
    public ResponseEntity<?> handleAllException(
            Throwable throwable, WebRequest webRequest, HttpServletRequest httpServletRequest
    ){
        return buildErrorResponse(new Exception(throwable),webRequest, httpServletRequest, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<?> buildErrorResponse(
            Exception ex, WebRequest webRequest, HttpServletRequest httpServletRequest,HttpStatus status){
        log.error("Exception handler: message={}", ex.getMessage(),ex);
        webRequest.setAttribute(ErrorAttributes.ERROR_ATTRIBUTE, ex, WebRequest.SCOPE_REQUEST);
        webRequest.setAttribute(
                RequestDispatcher.ERROR_STATUS_CODE,status.value(),webRequest.SCOPE_REQUEST);
        webRequest.setAttribute(
                RequestDispatcher.ERROR_REQUEST_URI,httpServletRequest.getRequestURL().toString(),
                webRequest.SCOPE_REQUEST);

        var resolver = new DefaultErrorAttributes();
        Map<String, Object> result =
                resolver.getErrorAttributes(
                        webRequest,
                        ErrorAttributeOptions.defaults()
                                .including(
                                        ErrorAttributeOptions.Include.EXCEPTION,
                                        ErrorAttributeOptions.Include.MESSAGE,
                                        ErrorAttributeOptions.Include.BINDING_ERRORS
                                ));
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON).body(result);
    }
}
