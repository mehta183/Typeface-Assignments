package com.fileshare.util;

import com.fileshare.exception.InvalidFileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Component
public class FileValidator {
    @Value("${app.storage.allowed-extensions}")
    private String allowedExtensions;
    @Value("${app.storage.max-file-size}")
    private long maxFileSize;

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) { throw new InvalidFileException("File cannot be empty"); }
        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) { throw new InvalidFileException("File name cannot be empty"); }
        if (originalFilename.contains("..")) { throw new InvalidFileException("Invalid file name: " + originalFilename); }
        String fileExtension = getFileExtension(originalFilename);
        if (!isAllowedExtension(fileExtension)) { throw new InvalidFileException("File type not allowed: " + fileExtension); }
        if (file.getSize() > maxFileSize) { throw new InvalidFileException("File size exceeds maximum allowed size"); }
    }

    private String getFileExtension(String filename) { int lastDotIndex = filename.lastIndexOf('.'); return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1).toLowerCase() : ""; }

    private boolean isAllowedExtension(String extension) { List<String> allowed = Arrays.asList(allowedExtensions.split(",")); return allowed.contains(extension.toLowerCase()); }
}
