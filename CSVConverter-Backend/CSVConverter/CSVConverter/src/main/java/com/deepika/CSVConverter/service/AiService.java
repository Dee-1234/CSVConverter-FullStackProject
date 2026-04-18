package com.deepika.CSVConverter.service;

import com.deepika.CSVConverter.model.AiInstruction;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiService {

    @Value("${google.gemini.api.key}")
    private String apiKey;

    public AiInstruction getInstructions(String userQuery, List<String> headers) {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper objectMapper = new ObjectMapper();

        String fullUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey.trim();


        String systemPrompt = String.format(
                "You are a Data Analyst. Based on these CSV headers: %s, " +
                        "return a JSON object with the following fields: " +
                        "'operation' (must be SUM, AVG, or COUNT), " +
                        "'groupBy' (must be one of the provided headers), " +
                        "'target' (the numeric column to calculate), " +
                        "'chartType' (bar, line, or pie), " +
                        "'summary' (a brief explanation of what the chart shows). " +
                        "Output MUST be valid JSON only. Do not include markdown formatting.",
                headers.toString()
        );
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", systemPrompt + "\n\nUser Question: " + userQuery);
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(textPart));
        requestBody.put("contents", List.of(content));
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.1);
        requestBody.put("generationConfig", generationConfig);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, requestBody, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            String jsonOutput = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();
            jsonOutput = jsonOutput.replace("```json", "").replace("```", "").trim();
            System.out.println("Cleaned AI Output: " + jsonOutput);
            return objectMapper.readValue(jsonOutput, AiInstruction.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gemini Analysis failed: " + e.getMessage());
        }
    }
}