package com.alitinart.fml.agent.controller;

import com.alitinart.fml.agent.domain.AgentResponseDto;
import com.alitinart.fml.agent.domain.QuestionDto;
import com.alitinart.fml.agent.service.AgentService;
import com.alitinart.fml.book.collection.domain.Book;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/assistant")
@CrossOrigin()
@Slf4j
public class AgentController {
    private final AgentService agentService;
    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    @Autowired
    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping("/session")
    public SseEmitter eventEmitter() throws IOException {
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        UUID guid = UUID.randomUUID();
        sseEmitters.put(guid.toString(), sseEmitter);
        sseEmitter.send(SseEmitter.event().name("GUI_ID").data(guid));
        sseEmitter.onCompletion(() -> sseEmitters.remove(guid.toString()));
        sseEmitter.onTimeout(() -> sseEmitters.remove(guid.toString()));
        return sseEmitter;
    }

    @PostMapping(value = "/ask")
    public ResponseEntity<AgentResponseDto> ask(@RequestBody QuestionDto questionDto) {
        agentService.ask(questionDto, sseEmitters.get(questionDto.getGuid()));
        return ResponseEntity.ok(AgentResponseDto.from("Answer Returned", HttpStatus.OK));
    }

    @PostMapping("/ingest")
    public ResponseEntity<Book> ingest(@RequestParam("file") MultipartFile file,
                                       @RequestParam("collectionName") String collectionName,
                                       @RequestParam("bookTitle") String bookTitle,
                                       @RequestParam("guid") String guid) {

        return ResponseEntity.ok(agentService.ingestBook(file, collectionName, bookTitle, guid, sseEmitters.get(guid)));
    }
}
