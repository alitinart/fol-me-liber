package com.alitinart.fml.agent.domain;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AgentResponseDto {
    private String responseMessage;
    private HttpStatus status;
    private LocalDateTime ts;

    public static AgentResponseDto from(String responseMessage, HttpStatus status) {
        return new AgentResponseDto(responseMessage, status, LocalDateTime.now());
    }
}
