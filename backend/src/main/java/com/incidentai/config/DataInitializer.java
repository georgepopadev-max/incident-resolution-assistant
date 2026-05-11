package com.incidentai.config;

import com.incidentai.entity.ChatMessage;
import com.incidentai.entity.Document;
import com.incidentai.entity.IncidentThread;
import com.incidentai.repository.ChatMessageRepository;
import com.incidentai.repository.DocumentRepository;
import com.incidentai.repository.IncidentThreadRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(IncidentThreadRepository threadRepository,
                               ChatMessageRepository messageRepository,
                               DocumentRepository documentRepository) {
        return args -> {
            if (threadRepository.count() == 0) {
                // Thread 1
                IncidentThread t1 = new IncidentThread();
                t1.setTitle("Database connection timeout");
                t1.setStatus("OPEN");
                t1.setPriority("HIGH");
                t1.setAssignee("alice");
                t1.setDescription("Production database returning connection timeouts during peak hours");
                t1 = threadRepository.save(t1);

                ChatMessage m1 = new ChatMessage();
                m1.setThread(t1);
                m1.setContent("We are experiencing intermittent database connection timeouts on the production cluster.");
                m1.setSender("USER");
                m1.setSenderName("Bob");
                m1.setRead(true);
                messageRepository.save(m1);

                ChatMessage m2 = new ChatMessage();
                m2.setThread(t1);
                m2.setContent("I understand the issue. Let me analyze the connection pool metrics and database load patterns.");
                m2.setSender("ASSISTANT");
                m2.setSenderName("AI Assistant");
                m2.setRead(true);
                m2.setCitations("[{\"documentId\":\"doc-001\",\"title\":\"DB Tuning Guide\",\"sourceType\":\"wiki\",\"relevanceScore\":0.92}]");
                messageRepository.save(m2);

                Document d1 = new Document();
                d1.setThread(t1);
                d1.setTitle("DB Connection Pool Configuration");
                d1.setSourceType("WIKI");
                d1.setContent("Best practices for HikariCP connection pool sizing and timeouts");
                documentRepository.save(d1);

                // Thread 2
                IncidentThread t2 = new IncidentThread();
                t2.setTitle("API gateway returning 503 errors");
                t2.setStatus("IN_PROGRESS");
                t2.setPriority("CRITICAL");
                t2.setAssignee("charlie");
                t2.setDescription("Multiple services returning 503 Service Unavailable from API gateway");
                t2 = threadRepository.save(t2);

                ChatMessage m3 = new ChatMessage();
                m3.setThread(t2);
                m3.setContent("API gateway is returning 503 errors for all authenticated requests since 14:30 UTC.");
                m3.setSender("USER");
                m3.setSenderName("Diana");
                m3.setRead(true);
                messageRepository.save(m3);

                // Thread 3
                IncidentThread t3 = new IncidentThread();
                t3.setTitle("Memory leak in user service");
                t3.setStatus("RESOLVED");
                t3.setPriority("MEDIUM");
                t3.setAssignee("eve");
                t3.setDescription("User service showing gradual memory increase over 48h period");
                t3.setResolvedAt(LocalDateTime.now().minusHours(5));
                threadRepository.save(t3);

                // Thread 4
                IncidentThread t4 = new IncidentThread();
                t4.setTitle("SSL certificate expiring soon");
                t4.setStatus("OPEN");
                t4.setPriority("LOW");
                t4.setAssignee("frank");
                t4.setDescription("SSL certificate for api.example.com expires in 7 days");
                threadRepository.save(t4);
            }
        };
    }
}