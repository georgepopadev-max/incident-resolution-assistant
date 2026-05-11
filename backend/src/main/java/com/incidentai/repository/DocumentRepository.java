package com.incidentai.repository;

import com.incidentai.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByThreadId(Long threadId);
    List<Document> findBySourceType(String sourceType);
}