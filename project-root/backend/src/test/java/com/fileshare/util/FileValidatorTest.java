package com.fileshare.util;

import com.fileshare.exception.InvalidFileException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

public class FileValidatorTest {
    private FileValidator validator;

    @BeforeEach
    void setUp() throws Exception {
        validator = new FileValidator();
        java.lang.reflect.Field allowed = FileValidator.class.getDeclaredField("allowedExtensions");
        allowed.setAccessible(true);
        allowed.set(validator, "txt,pdf,jpg,png");
        java.lang.reflect.Field max = FileValidator.class.getDeclaredField("maxFileSize");
        max.setAccessible(true);
        max.setLong(validator, 1024L * 1024L); // 1 MB
    }

    @Test
    void validate_acceptsValidFile() {
        MockMultipartFile file = new MockMultipartFile("file", "hello.txt", "text/plain", "hello".getBytes());
        assertDoesNotThrow(() -> validator.validate(file));
    }

    @Test
    void validate_rejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("file", "", "text/plain", new byte[0]);
        assertThrows(InvalidFileException.class, () -> validator.validate(file));
    }

    @Test
    void validate_rejectsInvalidExtension() {
        MockMultipartFile file = new MockMultipartFile("file", "malicious.exe", "application/octet-stream", "data".getBytes());
        assertThrows(InvalidFileException.class, () -> validator.validate(file));
    }

    @Test
    void validate_rejectsPathTraversal() {
        MockMultipartFile file = new MockMultipartFile("file", "../secret.txt", "text/plain", "data".getBytes());
        assertThrows(InvalidFileException.class, () -> validator.validate(file));
    }

    @Test
    void validate_rejectsTooLarge() {
        byte[] big = new byte[1024 * 1024 + 1];
        MockMultipartFile file = new MockMultipartFile("file", "big.pdf", "application/pdf", big);
        assertThrows(InvalidFileException.class, () -> validator.validate(file));
    }
}
