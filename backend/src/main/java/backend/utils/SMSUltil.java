package backend.utils;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.ValidationRequest;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SMSUltil {
    public static final String ACCOUNT_SID = "ACa5bee0a873cbe7232e123034a6484cd7";
    public static final String MESSAGE_SERVICE_SID = "ACa5bee0a873cbe7232e123034a6484cd7";
    public static final String AUTH_TOKEN = "8fbfb811479ddd196f43d6adb09bee90";

    public void sendSMS(String phoneNumber, String content){
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        //addFriendly(phoneNumber);
        Message message = Message.creator(new PhoneNumber(phoneNumber),
                "MG71aa7666612d3fe87876c31ad1ab8249",  content).create();

        System.out.println(message.getSid());
    }

    public void addFriendly(String phoneNumber){
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        ValidationRequest validationRequest = ValidationRequest.creator(
                        new com.twilio.type.PhoneNumber(phoneNumber))
                .setFriendlyName("My Home Phone Number")
                .create();

        System.out.println(validationRequest.getFriendlyName());
    }
}
