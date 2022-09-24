package backend.security.config;

import backend.security.AuthAccessDeniedHandler;
import backend.security.AuthEntryPointJwt;
import backend.security.filter.AwsCognitoJwtAuthFilter;
import backend.security.configuration.SecurityConfigurationProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
@Configuration
@Slf4j
public class WebSecurityConfig extends BaseConfig {

    @Autowired
    private AwsCognitoJwtAuthFilter awsCognitoJwtAuthenticationFilter;
    private SecurityConfigurationProperties securityProperties;

    public WebSecurityConfig(SecurityConfigurationProperties securityProperties) {
        super(securityProperties);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.cors().and().csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);

        httpSecurity.headers().cacheControl();
        this.cors(httpSecurity);
        this.configureAuthorizeRequests(httpSecurity);
        httpSecurity.addFilterBefore(awsCognitoJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

}
