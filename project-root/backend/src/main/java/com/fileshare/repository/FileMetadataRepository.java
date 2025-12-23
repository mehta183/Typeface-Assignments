package com.fileshare.repository;

import com.fileshare.entity.FileMetadata;
import com.fileshare.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    @Query("SELECT f FROM FileMetadata f WHERE f.user = :user AND f.deleted = false")
    Page<FileMetadata> findByUser(User user, Pageable pageable);

    @Query("SELECT f FROM FileMetadata f WHERE f.id = :id AND f.user = :user AND f.deleted = false")
    Optional<FileMetadata> findByIdAndUser(Long id, User user);

    @Query("SELECT f FROM FileMetadata f WHERE f.fileName = :fileName AND f.user = :user AND f.deleted = false")
    Optional<FileMetadata> findByFileNameAndUser(String fileName, User user);

    @Modifying
    @Query("UPDATE FileMetadata f SET f.downloadCount = f.downloadCount + 1 WHERE f.id = :id")
    void incrementDownloadCount(Long id);

    @Query("SELECT COUNT(f) FROM FileMetadata f WHERE f.user = :user AND f.deleted = false")
    Long countByUser(User user);

    @Query("SELECT SUM(f.fileSize) FROM FileMetadata f WHERE f.user = :user AND f.deleted = false")
    Long sumFileSizeByUser(User user);
}
