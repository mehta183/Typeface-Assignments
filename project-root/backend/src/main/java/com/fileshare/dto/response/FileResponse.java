package com.fileshare.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileResponse {
    private Long id;
    private String fileName;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
    private String fileExtension;
    private Long downloadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
