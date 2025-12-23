package com.fileshare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "file_metadata", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_file_name", columnList = "fileName"),
        @Index(name = "idx_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileMetadata extends BaseEntity {
    @NotBlank
    @Column(nullable = false)
    private String fileName;
    @NotBlank
    @Column(nullable = false)
    private String originalFileName;
    @NotBlank
    @Column(nullable = false)
    private String contentType;
    @NotNull
    @Column(nullable = false)
    private Long fileSize;
    @NotBlank
    @Column(nullable = false)
    private String storagePath;
    @Column(length = 10)
    private String fileExtension;
    @Column(length = 64)
    private String checksum;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false)
    private Long downloadCount = 0L;
}
