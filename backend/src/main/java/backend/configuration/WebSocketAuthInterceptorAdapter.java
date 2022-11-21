package backend.configuration;

import backend.security.AwsCognitoIdTokenProcessor;
import backend.security.configuration.CustomUserDetail;
import backend.security.configuration.JwtAuthentication;
import backend.security.configuration.JwtConfiguration;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.config.GlobalChannelInterceptor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.List.of;

@Component
@GlobalChannelInterceptor
@Slf4j
@RequiredArgsConstructor
public class WebSocketAuthInterceptorAdapter implements ChannelInterceptor {

    private final AwsCognitoIdTokenProcessor authenticate;

    @Override
    public void postSend(Message<?> msg, MessageChannel mc, boolean bln) {
    }

    @Override
    public void afterSendCompletion(Message<?> msg, MessageChannel mc, boolean bln, Exception excptn) {
    }

    @Override
    public boolean preReceive(MessageChannel mc) {
        return true;
    }
    @SneakyThrows
    @Override
    public Message<?> preSend(final Message<?> message, final MessageChannel channel) throws AuthenticationException {
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null)
            return message;

        StompCommand cmd = accessor.getCommand();
        if (StompCommand.SEND == cmd) {
            String authorization = accessor.getFirstNativeHeader("Authorization");
            String idToken = authorization;
            if (idToken != null) {
                JWTClaimsSet claims = authenticate.getClaims(authenticate.getBearerToken(idToken));
                authenticate.validateIssuer(claims);
                authenticate.verifyIfIdToken(claims);
                String username = authenticate.getUserNameFrom(claims);
                if (username != null) {
                    List<GrantedAuthority> grantedAuthorities = of( new SimpleGrantedAuthority("ROLE_" + authenticate.getRoleFrom(claims).get(0)));
                    UsernamePasswordAuthenticationToken user2 = new UsernamePasswordAuthenticationToken(
                        username,
                        null, grantedAuthorities);

                    accessor.setUser(user2);
                }
            }
        }
        return message;
    }
}