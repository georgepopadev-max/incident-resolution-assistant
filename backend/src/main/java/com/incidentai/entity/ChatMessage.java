package com.incidentai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private IncidentThread thread;

    @Column(nullable = false, length = 2000)
    private String content;

    private String sender; // USER, ASSISTANT, SYSTEM

    private String senderName;

    private LocalDateTime timestamp;

    private boolean isRead;

    private String citations; // JSON string of citation objects

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
        if (sender == null) sender = "USER";
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public IncidentThread getThread() { return thread; }
    public void setThread(IncidentThread thread) { this.thread = thread; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public String getCitations() { return citations; }
    public void setCitations(String citations) { this.citations = citations; }
}