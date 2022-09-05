package backend.security;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jose.util.ResourceRetriever;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.net.URL;

import static com.nimbusds.jose.JWSAlgorithm.RS256;

@Component
public class ConfigurableJWTProcessor2 {
    @Autowired
    private JwtConfiguration jwtConfiguration;
    @Bean
    public DefaultJWTProcessor configurableJWTProcessor() throws MalformedURLException {
        ResourceRetriever resourceRetriever =
                new DefaultResourceRetriever(jwtConfiguration.getConnectionTimeout(),
                        jwtConfiguration.getReadTimeout());
        URL jwkSetURL= new URL(jwtConfiguration.getJwkUrl());
        JWKSource keySource= new RemoteJWKSet(jwkSetURL, resourceRetriever);
        DefaultJWTProcessor jwtProcessor= new DefaultJWTProcessor();
        JWSKeySelector keySelector= new JWSVerificationKeySelector(RS256, keySource);
        jwtProcessor.setJWSKeySelector(keySelector);
        return jwtProcessor;
    }
}
