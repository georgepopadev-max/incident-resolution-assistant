package com.incidentai.repository;

import com.incidentai.entity.IncidentThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentThreadRepository extends JpaRepository<IncidentThread, Long> {
    List<IncidentThread> findByStatus(String status);
    List<IncidentThread> findByAssignee(String assignee);
    List<IncidentThread> findAllByOrderByCreatedAtDesc();
}