package com.alitinart.fml.exception.domain;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorDto {
    private HttpStatus status;
    private String title;
    private String message;
    private LocalDateTime timestamp;

    public ErrorDto(HttpStatus status, String title, String message) {
        this.status = status;
        this.title = title;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
