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
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import static java.util.List.of;

@Component
@Slf4j
public class AwsCognitoIdTokenProcessor {
    @Autowired
    public JwtConfiguration jwtConfiguration;

    @Autowired
    public ConfigurableJWTProcessor configurableJWTProcessor;

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

    public String getUserNameFrom(JWTClaimsSet claims)throws Exception {
        if(claims.getClaims().get(this.jwtConfiguration.getUserNameField()) == null){
            throw new MalformedJwtException("JWT Token không hợp lệ");
        }
        return claims.getClaims().get(this.jwtConfiguration.getUserNameField()).toString();
    }

    public String getEmailFrom(JWTClaimsSet claims)throws Exception {
        if(claims.getClaims().get(this.jwtConfiguration.getEmail()) == null){
            throw new MalformedJwtException("JWT Token không hợp lệ");
        }
        return claims.getClaims().get(this.jwtConfiguration.getEmail()).toString();
    }

    public boolean getEmailVerifyFrom(JWTClaimsSet claims)throws Exception {
        if(claims.getClaims().get(this.jwtConfiguration.getEmail_verified()) == null){
            throw new MalformedJwtException("JWT Token không hợp lệ");
        }
        String rs = claims.getClaims().get(this.jwtConfiguration.getEmail_verified()).toString();
        return  rs.equals("true") ? true : false;
    }

    public List getRoleFrom(JWTClaimsSet claims) {
        if(claims.getClaims().get(this.jwtConfiguration.getRole()) == null || claims.getClaims().get(this.jwtConfiguration.getIsFirstLogin()).equals("true")){
            return List.of("GUEST");
        }
        return List.of(claims.getClaims().get(this.jwtConfiguration.getRole()));
    }

    public void verifyIfIdToken(JWTClaimsSet claims) throws Exception {
        if (!claims.getIssuer().equals(this.jwtConfiguration.getCognitoIdentityPoolUrl())) {
            throw new UnsupportedJwtException("JWT Token không phải là ID Token");
        }
    }

    public void validateIssuer(JWTClaimsSet claims) throws Exception {
        if (!claims.getIssuer().equals(this.jwtConfiguration.getCognitoIdentityPoolUrl())) {
            throw new UnsupportedJwtException(String.format("Người phát hành (Issuer) %s không khớp với Cognito IDP %s", claims.getIssuer(), this.jwtConfiguration.getCognitoIdentityPoolUrl()));
        }
    }

    public String getBearerToken(String token) {
        return token.startsWith("Bearer ") ? token.substring("Bearer ".length()) : token;
    }

    public JWTClaimsSet getClaims(String idToken){
        try{
           return this.configurableJWTProcessor.process(this.getBearerToken(idToken),null);
        }catch (Exception ex){
            throw new MalformedJwtException("JWT token không hợp lệ");
        }
    }
}