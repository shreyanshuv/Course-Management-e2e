package com.iitb.coursemanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI courseManagementOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Course Management System API")
                .description("REST API for managing courses and their prerequisites at IIT Bombay")
                .version("1.0.0")
                .contact(new Contact()
                    .name("IIT Bombay")
                    .url("https://www.iitb.ac.in")
                    .email("contact@iitb.ac.in"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .tags(Arrays.asList(
                new Tag()
                    .name("Course Management")
                    .description("APIs for managing courses and their prerequisites"),
                new Tag()
                    .name("Course Instance Management")
                    .description("APIs for managing course instances and their schedules")
            ));
    }
} 