package com.fileshare.service;

import com.fileshare.dto.response.FileResponse;
import com.fileshare.dto.response.PageResponse;
import com.fileshare.entity.FileMetadata;
import com.fileshare.entity.User;
import com.fileshare.exception.FileStorageException;
import com.fileshare.exception.ResourceNotFoundException;
import com.fileshare.repository.FileMetadataRepository;
import com.fileshare.util.FileValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {
    private final FileMetadataRepository fileRepository;
    private final FileValidator fileValidator;
    @Value("${app.storage.location}")
    private String storageLocation;

    private Path getStoragePath() { return Paths.get(storageLocation).toAbsolutePath().normalize(); }

    @Transactional
    public FileResponse uploadFile(MultipartFile file, User user) {
        fileValidator.validate(file);
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
        try {
            Path targetLocation = getStoragePath().resolve(uniqueFilename);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            String checksum = calculateChecksum(file.getBytes());
            FileMetadata metadata = FileMetadata.builder()
                    .fileName(uniqueFilename)
                    .originalFileName(originalFilename)
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .storagePath(targetLocation.toString())
                    .fileExtension(fileExtension)
                    .checksum(checksum)
                    .user(user)
                    .downloadCount(0L)
                    .build();
            metadata = fileRepository.save(metadata);
            log.info("File uploaded successfully: {} by user: {}", originalFilename, user.getUsername());
            return mapToFileResponse(metadata);
        } catch (IOException ex) {
            throw new FileStorageException("Failed to store file: " + originalFilename, ex);
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<FileResponse> getUserFiles(User user, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<FileMetadata> filePage = fileRepository.findByUser(user, pageable);
        return PageResponse.<FileResponse>builder()
                .content(filePage.getContent().stream().map(this::mapToFileResponse).collect(Collectors.toList()))
                .pageNumber(filePage.getNumber())
                .pageSize(filePage.getSize())
                .totalElements(filePage.getTotalElements())
                .totalPages(filePage.getTotalPages())
                .last(filePage.isLast())
                .first(filePage.isFirst())
                .build();
    }

    @Transactional
    public Resource downloadFile(Long fileId, User user) {
        FileMetadata metadata = fileRepository.findByIdAndUser(fileId, user).orElseThrow(() -> new ResourceNotFoundException("File not found"));
        try {
            Path filePath = Paths.get(metadata.getStoragePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) { throw new ResourceNotFoundException("File not found: " + metadata.getOriginalFileName()); }
            fileRepository.incrementDownloadCount(fileId);
            log.info("File downloaded: {} by user: {}", metadata.getOriginalFileName(), user.getUsername());
            return resource;
        } catch (MalformedURLException ex) {
            throw new FileStorageException("File not found: " + metadata.getOriginalFileName(), ex);
        }
    }

    @Transactional
    public void deleteFile(Long fileId, User user) {
        FileMetadata metadata = fileRepository.findByIdAndUser(fileId, user).orElseThrow(() -> new ResourceNotFoundException("File not found"));
        try {
            Path filePath = Paths.get(metadata.getStoragePath()).normalize();
            Files.deleteIfExists(filePath);
            metadata.setDeleted(true);
            fileRepository.save(metadata);
            log.info("File deleted: {} by user: {}", metadata.getOriginalFileName(), user.getUsername());
        } catch (IOException ex) {
            throw new FileStorageException("Failed to delete file: " + metadata.getOriginalFileName(), ex);
        }
    }

    @Transactional(readOnly = true)
    public FileMetadata getFileMetadata(Long fileId, User user) {
        return fileRepository.findByIdAndUser(fileId, user).orElseThrow(() -> new ResourceNotFoundException("File not found"));
    }

    private String getFileExtension(String filename) { int lastDotIndex = filename.lastIndexOf('.'); return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : ""; }

    private String calculateChecksum(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) { String hex = Integer.toHexString(0xff & b); if (hex.length() == 1) hexString.append('0'); hexString.append(hex); }
            return hexString.toString();
        } catch (Exception ex) { log.error("Failed to calculate checksum", ex); return null; }
    }

    private FileResponse mapToFileResponse(FileMetadata metadata) {
        return FileResponse.builder()
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
    }
}
