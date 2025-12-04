package com.stoicron.stoicron_back.pomodore.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "pomodores")
public class Pomodore {
    @Id
    private String pomodoreId;
    private String userId;    
    private int durationMinutes;
    private String status; // e.g., "completed", "in_progress", "abandoned"
    private Instant createdAt;
    private Instant updatedAt;     
}
