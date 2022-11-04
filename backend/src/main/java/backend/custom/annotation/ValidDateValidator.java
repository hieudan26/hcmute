package backend.custom.annotation;

import com.google.common.base.Strings;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ValidDateValidator implements ConstraintValidator<ValidDateTime, String> {

    private Boolean isOptional;

    @Override
    public void initialize(ValidDateTime validDate) {
        this.isOptional = validDate.optional();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {

        boolean validDate = isValidFormat("dd/MM/yyyy HH:mm:ss", value);

        return isOptional ? (validDate || (Strings.isNullOrEmpty(value))) : validDate;
    }

    private static boolean isValidFormat(String format, String value) {
        Date date = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            if (value != null){
                date = sdf.parse(value);
                if (!value.equals(sdf.format(date))) {
                    date = null;
                }
            }

        } catch (ParseException ex) {
        }
        return date != null;
    }
}