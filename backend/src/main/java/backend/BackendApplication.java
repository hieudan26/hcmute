package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Properties;


@EnableSwagger2
@EnableWebMvc
@SpringBootApplication
@EnableCaching
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		Properties props = System.getProperties();
		props.setProperty("aws.region", "ap-southeast-1");
		props.setProperty("aws.accessKeyId", "AKIAWGH2PX7YNHVLL564");
		props.setProperty("aws.secretAccessKey", "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");

	}
}
