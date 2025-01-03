package com.alitinart.fml.exception;

import com.alitinart.fml.exception.domain.ErrorDto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private ResponseEntity<ErrorDto> buildResponse(HttpStatus status, String message, String details) {
        return ResponseEntity.status(status).body(new ErrorDto(status, message, details));
    }

    @ExceptionHandler(value = NotFoundException.class)
    public ResponseEntity<ErrorDto> handleNotFoundException(HttpServletRequest req, NotFoundException e) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", e.getMessage());
    }

    @ExceptionHandler(value = MissingParameterException.class)
    public ResponseEntity<ErrorDto> handleMissingParameterException(HttpServletRequest req, MissingParameterException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Missing parameter", e.getMessage());
    }

    @ExceptionHandler(value = PdfReadingException.class)
    public ResponseEntity<ErrorDto> handlePdfReadingException(HttpServletRequest req, PdfReadingException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Error while reading pdf", e.getMessage());
    }

    @ExceptionHandler(value = ScanningException.class)
    public ResponseEntity<ErrorDto> handleScanningException(HttpServletRequest req, ScanningException e) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Error while scanning PDF", e.getMessage());
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorDto> handleDefaultException(HttpServletRequest req, Exception e) {
        log.error(e.getMessage(), e);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", e.getMessage());
    }
}
