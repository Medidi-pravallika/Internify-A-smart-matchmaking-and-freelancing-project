package com.internify.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internify.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class MatchingService {

    @Value("${ml.api.base-url}")
    private String mlApiBaseUrl;

    private final RestTemplate restTemplate;

    public MatchingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getStudentJobMatches(MultipartFile resumeFile) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("resume", new ByteArrayResource(resumeFile.getBytes()) {
            @Override
            public String getFilename() {
                return resumeFile.getOriginalFilename();
            }
        });
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String url = mlApiBaseUrl + "/match/student";
        try {
            return restTemplate.postForObject(url, requestEntity, String.class);
        } catch (HttpClientErrorException e) {
            throw new BadRequestException("ML API error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get matches from ML service: " + e.getMessage(), e);
        }
    }

    public String getRecruiterResumeMatches(MultipartFile jdFile) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("jd", new ByteArrayResource(jdFile.getBytes()) {
            @Override
            public String getFilename() {
                return jdFile.getOriginalFilename();
            }
        });
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String url = mlApiBaseUrl + "/match/recruiter";
        try {
            return restTemplate.postForObject(url, requestEntity, String.class);
        } catch (HttpClientErrorException e) {
            throw new BadRequestException("ML API error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get matches from ML service: " + e.getMessage(), e);
        }
    }

    public Double getMatchScore(Path resumePath, Path jdPath) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("resume", new ByteArrayResource(Files.readAllBytes(resumePath)) {
            @Override
            public String getFilename() {
                return resumePath.getFileName().toString();
            }
        });

        body.add("jd", new ByteArrayResource(Files.readAllBytes(jdPath)) {
            @Override
            public String getFilename() {
                return jdPath.getFileName().toString();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String url = mlApiBaseUrl + "/match/score";

        try {
            ObjectMapper mapper = new ObjectMapper();
            String response = restTemplate.postForObject(url, requestEntity, String.class);

            // 🔎 Debug log: print raw ML API response
            System.out.println(">>> ML API Raw Response: " + response);

            JsonNode root = mapper.readTree(response);

            // ✅ Flexible parsing
            if (root.has("score")) {
                return root.get("score").asDouble();
            } else if (root.has("matchScore")) {
                return root.get("matchScore").asDouble();
            } else if (root.has("similarity")) {
                return root.get("similarity").asDouble() * 100; // ratio → %
            } else if (root.isNumber()) {
                return root.asDouble();
            } else if (root.isTextual()) {
                return Double.parseDouble(root.asText());
            }

            throw new RuntimeException("ML API response does not contain a valid score field.");
        } catch (HttpClientErrorException e) {
            throw new BadRequestException("ML API error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get match score from ML service: " + e.getMessage(), e);
        }
    }
}
