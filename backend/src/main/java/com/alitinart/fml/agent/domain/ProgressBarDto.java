package com.alitinart.fml.agent.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressBarDto {
    private Integer progessValue;
    private String collectionName;
}
