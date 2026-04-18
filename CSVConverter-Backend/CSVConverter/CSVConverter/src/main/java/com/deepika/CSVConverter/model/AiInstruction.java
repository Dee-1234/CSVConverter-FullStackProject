package com.deepika.CSVConverter.model;

import lombok.Data;

@Data
public class AiInstruction {
    private String operation;
    private String groupBy;
    private String target;
    private String chartType;
    private String summary;
}