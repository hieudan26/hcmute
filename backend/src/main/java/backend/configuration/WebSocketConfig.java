package backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompReactorNettyCodec;
import org.springframework.messaging.tcp.reactor.ReactorNettyTcpClient;
import org.springframework.web.socket.config.annotation.*;
import reactor.netty.tcp.SslProvider;

@Configuration
@EnableWebSocketMessageBroker
@Order()
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        ReactorNettyTcpClient<byte[]> tcpClient = new ReactorNettyTcpClient<>(configurer -> configurer
                .host("b-bc338530-9c97-4b54-89c4-62eff6edbc26-1.mq.ap-southeast-1.amazonaws.com")
                .port(61614)
                .secure(SslProvider.defaultClientProvider()), new StompReactorNettyCodec());

        registry.enableStompBrokerRelay("/topic")
                .setAutoStartup(true)
                .setSystemLogin("lumiere")
                .setSystemPasscode("lumiere-123-lumiere")
                .setClientLogin("lumiere")
                .setClientPasscode("lumiere-123-lumiere")
                .setTcpClient(tcpClient);

        registry.setApplicationDestinationPrefixes("/app");
    }
}