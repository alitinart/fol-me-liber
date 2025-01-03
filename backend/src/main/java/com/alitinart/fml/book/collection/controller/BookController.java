package com.alitinart.fml.book.collection.controller;

import com.alitinart.fml.agent.domain.AgentResponseDto;
import com.alitinart.fml.book.collection.domain.Book;
import com.alitinart.fml.book.collection.repo.BookRepo;
import com.alitinart.fml.book.collection.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/book")
@CrossOrigin()
@Slf4j
public class BookController {
    private final BookRepo bookRepo;
    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService,
                          BookRepo bookRepo) {
        this.bookService = bookService;
        this.bookRepo = bookRepo;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<AgentResponseDto> deleteCollection(@PathVariable String bookId) {
        bookService.deleteCollection(bookId);
        return ResponseEntity.ok(AgentResponseDto.from("Deleted Book Collection", HttpStatus.OK));
    }

    //    TODO: DONT FORGET TO REMOVE THIS
    @DeleteMapping
    public ResponseEntity<String> deleteAll() {
        bookRepo.deleteAll();
        return ResponseEntity.ok("Deleted");
    }
}
