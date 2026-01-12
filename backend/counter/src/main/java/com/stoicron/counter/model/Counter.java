package com.stoicron.counter.model;



import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "counters")
@Getter
@Setter
@RequiredArgsConstructor
public class Counter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "counter_id")
    private Long id;
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
    @Column(name = "last_start")
    private Instant lastStart;
    @Column(name = "accumulated_time")
    private Long accumulatedTime; // in seconds
    @Column(name = "counter_state")
    @Enumerated(EnumType.STRING)
    private EState counterState;
}
