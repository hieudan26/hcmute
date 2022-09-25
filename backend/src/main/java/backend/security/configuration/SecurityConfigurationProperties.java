package backend.security.configuration;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@ConfigurationProperties("security")
@Component
public class SecurityConfigurationProperties {
    @JsonProperty("use-webflux")
    private boolean useWebflux;
    @JsonProperty("clients")
    private Map<String, SecurityConfigurationProperties.Client> clients;

    @JsonProperty("cors")
    private SecurityConfigurationProperties.Cors cors =new SecurityConfigurationProperties.Cors();

    @JsonProperty("path-matcher")
    private SecurityConfigurationProperties.PathMatcherConfig pathMatcher = new SecurityConfigurationProperties.PathMatcherConfig();

    @Data
    public static class PathMatcherConfig {
        @JsonProperty("permit-all-methods")
        private Set<HttpMethod> permitAllMethods = null;

        @JsonProperty("permit-all-path-patterns")
        private Set<String> permitAllPathPatterns = Set.of(
                "/swagger-ui/**",
                "/swagger-resources/**",
                "/swagger-ui.html",
                "/v2/api-docs",
                "/webjars/**");

        @JsonProperty("permit-all-map")
        private Map<HttpMethod, Set<String>> permitAllMap = null;
    }

    @Data
    public static class Cors {
        @JsonProperty("allowed-origins")
        private List<String> allowedOrigins;

        @JsonProperty("allowed-methods")
        private List<String> allowedMethods;

        @JsonProperty("allowed-headers")
        private List<String> allowedHeaders;
    }

    @Data
    public static class RestEndpoint {
        @JsonProperty("uri")
        private String uri;
    }

    @Data
    public static class Client {
        @JsonProperty("rest")
        private SecurityConfigurationProperties.RestEndpoint rest;
        @JsonProperty("properties")
        private Map<String, String> properties;
    }
}
