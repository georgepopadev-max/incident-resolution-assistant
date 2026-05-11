package com.incidentai.controller;

import com.incidentai.dto.ChatRequest;
import com.incidentai.dto.ChatResponse;
import com.incidentai.entity.ChatMessage;
import com.incidentai.entity.IncidentThread;
import com.incidentai.repository.ChatMessageRepository;
import com.incidentai.repository.IncidentThreadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatMessageRepository messageRepository;
    private final IncidentThreadRepository threadRepository;
    private final Random random = new Random();

    private static final List<String> AI_RESPONSES = List.of(
        "I understand the issue. Let me analyze the logs and provide recommendations.",
        "Based on the error details, this appears to be a configuration issue. Check the service settings.",
        "I'm seeing similar patterns in the knowledge base. Here are the recommended steps to resolve this.",
        "This looks like a known issue. Let me provide you with the standard resolution procedure.",
        "Thank you for the details. I'll help you troubleshoot this step by step."
    );

    public ChatController(ChatMessageRepository messageRepository, IncidentThreadRepository threadRepository) {
        this.messageRepository = messageRepository;
        this.threadRepository = threadRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        Long threadId = request.getThreadId();

        // Save user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setContent(request.getMessage());
        userMessage.setSender("USER");
        userMessage.setSenderName(request.getSenderName() != null ? request.getSenderName() : "User");
        userMessage.setRead(true);

        if (threadId != null) {
            threadRepository.findById(threadId).ifPresent(thread -> {
                userMessage.setThread(thread);
                messageRepository.save(userMessage);
            });
        }

        // Generate AI response
        String aiResponse = AI_RESPONSES.get(random.nextInt(AI_RESPONSES.size()));

        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setContent(aiResponse);
        aiMessage.setSender("ASSISTANT");
        aiMessage.setSenderName("AI Assistant");
        aiMessage.setRead(false);

        if (threadId != null) {
            final Long finalThreadId = threadId;
            threadRepository.findById(finalThreadId).ifPresent(thread -> {
                aiMessage.setThread(thread);
                messageRepository.save(aiMessage);
            });
        }

        // Build response
        ChatResponse response = new ChatResponse();
        response.setMessage(aiResponse);
        response.setThreadId(threadId);

        ChatResponse.Citation citation = new ChatResponse.Citation();
        citation.setDocumentId("doc-001");
        citation.setTitle("Internal Knowledge Base");
        citation.setSourceType("wiki");
        citation.setRelevanceScore(0.95);
        citation.setSnippet("Standard troubleshooting procedures for common infrastructure issues");
        response.setCitations(List.of(citation));

        return ResponseEntity.ok(response);
    }
}