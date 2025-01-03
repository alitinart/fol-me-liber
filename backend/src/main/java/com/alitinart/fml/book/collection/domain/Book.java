package com.alitinart.fml.book.collection.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
@Document("BookCollection")
public class Book {
    @Id
    private String id;
    private String title;
    private String collectionName;
    private Integer pages;
    private String thumbnail;
    private LocalDateTime lastUsed;

    public Book(String title, String collectionName, Integer pages, String thumbnail, LocalDateTime lastUsed) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.collectionName = collectionName;
        this.pages = pages;
        this.thumbnail = thumbnail;
        this.lastUsed = lastUsed;
    }
}
