package com.stoicron.stoicron_back.quote.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "quotes")
public class Quote {
    @Id
    private String quoteId;
    private String text;
    private String author;
    private Instant createdAt;
    private Instant updatedAt;
}
