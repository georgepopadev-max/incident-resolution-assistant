package com.incidentai.dto;

import java.time.LocalDateTime;

public class ChatRequest {
    private Long threadId;
    private String message;
    private String senderName;

    public Long getThreadId() { return threadId; }
    public void setThreadId(Long threadId) { this.threadId = threadId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
}