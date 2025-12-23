package com.fileshare.controller;

import com.fileshare.dto.response.ApiResponse;
import com.fileshare.dto.response.FileResponse;
import com.fileshare.dto.response.PageResponse;
import com.fileshare.entity.FileMetadata;
import com.fileshare.entity.User;
import com.fileshare.repository.UserRepository;
import com.fileshare.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FileResponse>> uploadFile(
            @RequestParam("file") MultipartFile file, Authentication authentication) {
        User user = getCurrentUser(authentication);
        FileResponse response = fileStorageService.uploadFile(file, user);
        return ResponseEntity.ok(ApiResponse.success(response, "File uploaded successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FileResponse>>> getAllFiles(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy, @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        PageResponse<FileResponse> response = fileStorageService.getUserFiles(user, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(response, "Files retrieved successfully"));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Resource resource = fileStorageService.downloadFile(id, user);
        FileMetadata metadata = fileStorageService.getFileMetadata(id, user);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getOriginalFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FileResponse>> getFileById(
            @PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        FileMetadata metadata = fileStorageService.getFileMetadata(id, user);
        FileResponse response = FileResponse.builder()
                .id(metadata.getId())
                .fileName(metadata.getFileName())
                .originalFileName(metadata.getOriginalFileName())
                .contentType(metadata.getContentType())
                .fileSize(metadata.getFileSize())
                .fileExtension(metadata.getFileExtension())
                .downloadCount(metadata.getDownloadCount())
                .createdAt(metadata.getCreatedAt())
                .updatedAt(metadata.getUpdatedAt())
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "File retrieved successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        fileStorageService.deleteFile(id, user);
        return ResponseEntity.ok(ApiResponse.success(null, "File deleted successfully"));
    }

    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
