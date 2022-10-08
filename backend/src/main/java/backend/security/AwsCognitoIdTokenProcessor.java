package backend.security;

import backend.security.configuration.CustomUserDetail;
import backend.security.configuration.JwtAuthentication;
import backend.security.configuration.JwtConfiguration;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import static java.util.List.of;

@Component
@Slf4j
public class AwsCognitoIdTokenProcessor {
    @Autowired
    private JwtConfiguration jwtConfiguration;

    @Autowired
    private ConfigurableJWTProcessor configurableJWTProcessor;

    public Authentication authenticate(HttpServletRequest request) throws Exception {
        String idToken = request.getHeader(this.jwtConfiguration.getHttpHeader());
        if (idToken != null) {
            JWTClaimsSet claims = this.getClaims(this.getBearerToken(idToken));
            validateIssuer(claims);
            verifyIfIdToken(claims);
            String username = getUserNameFrom(claims);
            String email = getEmailFrom(claims);
            boolean isVerify = getEmailVerifyFrom(claims);
            if (username != null) {
                List<GrantedAuthority> grantedAuthorities = of( new SimpleGrantedAuthority("ROLE_" + getRoleFrom(claims).get(0)));
                CustomUserDetail user = new CustomUserDetail(username,"",isVerify,email,grantedAuthorities);
                return new JwtAuthentication(user, claims, grantedAuthorities);
            }
        }
        return null;
    }

    private String getUserNameFrom(JWTClaimsSet claims)throws Exception {
        if(claims.getClaims().get(this.jwtConfiguration.getUserNameField()) == null){
            throw new MalformedJwtException("JWT Token is not valid");
        }
        return claims.getClaims().get(this.jwtConfiguration.getUserNameField()).toString();
    }

    private String getEmailFrom(JWTClaimsSet claims)throws Exception {
        if(claims.getClaims().get(this.jwtConfiguration.getEmail()) == null){
            throw new MalformedJwtException("JWT Token is not valid");
        }
        return claims.getClaims().get(this.jwtConfiguration.getEmail()).toString();
    }

    private boolean getEmailVerifyFrom(JWTClaimsSet claims)throws Exception {
        if(claims.getClaims().get(this.jwtConfiguration.getEmail_verified()) == null){
            throw new MalformedJwtException("JWT Token is not valid");
        }
        String rs = claims.getClaims().get(this.jwtConfiguration.getEmail_verified()).toString();
        return  rs.equals("true") ? true : false;
    }

    private List getRoleFrom(JWTClaimsSet claims) {
        if(claims.getClaims().get(this.jwtConfiguration.getRole()) == null || claims.getClaims().get(this.jwtConfiguration.getIsFirstLogin()).equals("true")){
            return List.of("GUEST");
        }
        return List.of(claims.getClaims().get(this.jwtConfiguration.getRole()));
    }

    private void verifyIfIdToken(JWTClaimsSet claims) throws Exception {
        if (!claims.getIssuer().equals(this.jwtConfiguration.getCognitoIdentityPoolUrl())) {
            throw new UnsupportedJwtException("JWT Token is not an ID Token");
        }
    }

    private void validateIssuer(JWTClaimsSet claims) throws Exception {
        if (!claims.getIssuer().equals(this.jwtConfiguration.getCognitoIdentityPoolUrl())) {
            throw new UnsupportedJwtException(String.format("Issuer %s does not match cognito idp %s", claims.getIssuer(), this.jwtConfiguration.getCognitoIdentityPoolUrl()));
        }
    }

    private String getBearerToken(String token) {
        return token.startsWith("Bearer ") ? token.substring("Bearer ".length()) : token;
    }

    private JWTClaimsSet getClaims(String idToken){
        try{
           return this.configurableJWTProcessor.process(this.getBearerToken(idToken),null);
        }catch (Exception ex){
            throw new MalformedJwtException("Invalid JWT token");
        }
    }
}