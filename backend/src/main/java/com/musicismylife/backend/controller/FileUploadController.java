package com.musicismylife.backend.controller;

import com.musicismylife.backend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 파일 업로드 API 컨트롤러
 * 
 * API 엔드포인트:
 * - POST /api/upload/image : 단일 이미지 업로드
 * - POST /api/upload/images : 여러 이미지 업로드
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * 단일 이미지 파일 업로드
     * 
     * POST /api/upload/image
     * Content-Type: multipart/form-data
     * 
     * Form Data:
     * - file: 이미지 파일
     * 
     * @param file 업로드할 이미지 파일
     * @return 업로드된 파일의 URL
     */
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        
        try {
            // 1. 파일이 비어있는지 확인
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "파일이 비어있습니다.");
                return ResponseEntity.badRequest().body(error);
            }

            // 2. 이미지 파일 형식 확인
            if (!fileUploadService.isValidImageFile(file)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "이미지 파일만 업로드 가능합니다. (jpg, png, gif, webp)");
                return ResponseEntity.badRequest().body(error);
            }

            // 3. 파일 크기 확인 (10MB 제한)
            long maxSize = 10 * 1024 * 1024; // 10MB
            if (file.getSize() > maxSize) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "파일 크기는 10MB를 초과할 수 없습니다.");
                return ResponseEntity.badRequest().body(error);
            }

            // 4. 파일 업로드
            String imageUrl = fileUploadService.uploadImage(file);

            // 5. 응답 반환
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("originalFilename", file.getOriginalFilename());
            response.put("size", String.valueOf(file.getSize()));

            log.info("이미지 업로드 성공: " + imageUrl);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("이미지 업로드 실패: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "파일 업로드에 실패했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 여러 이미지 파일 업로드
     * 
     * POST /api/upload/images
     * Content-Type: multipart/form-data
     * 
     * Form Data:
     * - files: 이미지 파일들 (여러 개)
     * 
     * @param files 업로드할 이미지 파일 목록
     * @return 업로드된 파일들의 URL 목록
     */
    @PostMapping("/images")
    public ResponseEntity<?> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        
        try {
            // 1. 파일 개수 확인 (최대 3개)
            if (files.size() > 3) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "최대 3개의 이미지만 업로드 가능합니다.");
                return ResponseEntity.badRequest().body(error);
            }

            // 2. 각 파일 유효성 검사
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                if (!fileUploadService.isValidImageFile(file)) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "이미지 파일만 업로드 가능합니다.");
                    return ResponseEntity.badRequest().body(error);
                }

                if (file.getSize() > 10 * 1024 * 1024) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "각 파일 크기는 10MB를 초과할 수 없습니다.");
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // 3. 파일 업로드
            List<String> imageUrls = fileUploadService.uploadImages(files);

            // 4. 응답 반환
            Map<String, Object> response = new HashMap<>();
            response.put("urls", imageUrls);
            response.put("count", imageUrls.size());

            log.info("이미지 " + imageUrls.size() + "개 업로드 성공");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("이미지 업로드 실패: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "파일 업로드에 실패했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
