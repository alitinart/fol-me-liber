package com.alitinart.fml.exception;

import lombok.Data;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Data
public class PdfReadingException extends RuntimeException {
    private SseEmitter emitter;
    public PdfReadingException(String message, SseEmitter emitter) {
        super(message);
        this.emitter = emitter;
    }
}
