package com.alitinart.fml.agent.service;

import com.alitinart.fml.agent.domain.QuestionDto;
import com.alitinart.fml.book.collection.domain.Book;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface AgentService {
    void ask(QuestionDto questionDto, SseEmitter emitter);

    Book ingestBook(MultipartFile file, String collectionName, String bookTitle, String guid, SseEmitter emitter);
}
