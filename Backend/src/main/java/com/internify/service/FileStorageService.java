package com.internify.service;

import com.internify.exception.BadRequestException;
import com.internify.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.fileStorageLocation.resolve("resumes"));
            Files.createDirectories(this.fileStorageLocation.resolve("job_descriptions"));
        } catch (Exception ex) {
            throw new BadRequestException("Could not create the directory where the uploaded files will be stored.");
        }
    }

    public String storeFile(MultipartFile file, String subDirectory) {
        String fileName = UUID.randomUUID().toString() + "_" + Objects.requireNonNull(file.getOriginalFilename()).replaceAll("\\s+", "_");
        try {
            if (fileName.contains("..")) {
                throw new BadRequestException("Filename contains invalid path sequence " + fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(subDirectory).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return subDirectory + "/" + fileName; // Return relative path for storage in DB
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file " + fileName + ". Please try again!");
        }
    }

    public Path loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            if (Files.exists(filePath)) {
                return filePath;
            } else {
                throw new ResourceNotFoundException("File not found " + fileName);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException("File not found " + fileName, ex);
        }
    }
}