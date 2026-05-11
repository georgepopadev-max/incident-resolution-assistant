package com.incidentai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IncidentResolutionApplication {
    public static void main(String[] args) {
        SpringApplication.run(IncidentResolutionApplication.class, args);
    }
}