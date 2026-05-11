package com.incidentai.controller;

import com.incidentai.entity.ChatMessage;
import com.incidentai.entity.Document;
import com.incidentai.entity.IncidentThread;
import com.incidentai.repository.ChatMessageRepository;
import com.incidentai.repository.DocumentRepository;
import com.incidentai.repository.IncidentThreadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ThreadController {

    private final IncidentThreadRepository threadRepository;
    private final ChatMessageRepository messageRepository;
    private final DocumentRepository documentRepository;

    public ThreadController(IncidentThreadRepository threadRepository,
                           ChatMessageRepository messageRepository,
                           DocumentRepository documentRepository) {
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.documentRepository = documentRepository;
    }

    @GetMapping("/threads")
    public ResponseEntity<List<IncidentThread>> getAllThreads() {
        return ResponseEntity.ok(threadRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<IncidentThread> getThread(@PathVariable Long id) {
        return threadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/threads")
    public ResponseEntity<IncidentThread> createThread(@RequestBody IncidentThread thread) {
        IncidentThread saved = threadRepository.save(thread);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/threads/{id}")
    public ResponseEntity<IncidentThread> updateThread(@PathVariable Long id, @RequestBody IncidentThread updated) {
        return threadRepository.findById(id).map(thread -> {
            thread.setTitle(updated.getTitle());
            thread.setStatus(updated.getStatus());
            thread.setPriority(updated.getPriority());
            thread.setAssignee(updated.getAssignee());
            thread.setDescription(updated.getDescription());
            return ResponseEntity.ok(threadRepository.save(thread));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/threads/{id}/messages")
    public ResponseEntity<List<ChatMessage>> getThreadMessages(@PathVariable Long id) {
        return ResponseEntity.ok(messageRepository.findByThreadIdOrderByTimestampAsc(id));
    }

    @PostMapping("/threads/{id}/messages")
    public ResponseEntity<ChatMessage> addMessage(@PathVariable Long id, @RequestBody ChatMessage message) {
        return threadRepository.findById(id).map(thread -> {
            message.setThread(thread);
            return ResponseEntity.ok(messageRepository.save(message));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/threads/{id}/documents")
    public ResponseEntity<List<Document>> getThreadDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(documentRepository.findByThreadId(id));
    }

    @PostMapping("/threads/{id}/documents")
    public ResponseEntity<Document> addDocument(@PathVariable Long id, @RequestBody Document document) {
        return threadRepository.findById(id).map(thread -> {
            document.setThread(thread);
            return ResponseEntity.ok(documentRepository.save(document));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/threads/{id}/resolution")
    public ResponseEntity<Map<String, Object>> getThreadResolution(@PathVariable Long id) {
        return threadRepository.findById(id).map(thread -> {
            Map<String, Object> resolution = new HashMap<>();
            resolution.put("threadId", thread.getId());
            resolution.put("summary", "Resolution for: " + thread.getTitle());
            resolution.put("resolved", "RESOLVED".equals(thread.getStatus()));
            resolution.put("resolvedAt", thread.getResolvedAt());
            return ResponseEntity.ok(resolution);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/threads/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveThread(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return threadRepository.findById(id).map(thread -> {
            thread.setStatus("RESOLVED");
            thread.setResolvedAt(java.time.LocalDateTime.now());
            threadRepository.save(thread);
            Map<String, Object> result = new HashMap<>();
            result.put("threadId", id);
            result.put("status", "resolved");
            result.put("summary", body.getOrDefault("summary", ""));
            return ResponseEntity.ok(result);
        }).orElse(ResponseEntity.notFound().build());
    }
}