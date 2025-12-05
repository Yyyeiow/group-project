package com.musicismylife.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 파일 업로드 서비스
 * 
 * 이미지 파일을 서버에 저장하고 URL을 반환합니다.
 */
@Service
@Slf4j
public class FileUploadService {

    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;

    @Value("${server.port:8080}")
    private String serverPort;

    /**
     * 단일 이미지 파일 업로드
     * 
     * @param file 업로드할 파일
     * @return 저장된 파일의 URL
     * 
     * 동작 순서:
     * 1. 업로드 디렉토리가 없으면 생성
     * 2. 파일 이름을 UUID로 변경 (중복 방지)
     * 3. 파일을 디렉토리에 저장
     * 4. 접근 가능한 URL 반환
     */
    public String uploadImage(MultipartFile file) {
        try {
            // 1. 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("업로드 디렉토리 생성: " + uploadPath.toAbsolutePath());
            }

            // 2. 원본 파일명과 확장자 추출
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 3. UUID로 고유한 파일명 생성
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // 4. 파일 저장
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            log.info("파일 업로드 성공: " + uniqueFilename);

            // 5. 접근 가능한 URL 생성
            return "http://localhost:" + serverPort + "/uploads/images/" + uniqueFilename;

        } catch (IOException e) {
            log.error("파일 업로드 실패: " + e.getMessage());
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 여러 이미지 파일 업로드
     * 
     * @param files 업로드할 파일 목록
     * @return 저장된 파일들의 URL 목록
     */
    public List<String> uploadImages(List<MultipartFile> files) {
        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String url = uploadImage(file);
                uploadedUrls.add(url);
            }
        }

        log.info("총 " + uploadedUrls.size() + "개 파일 업로드 완료");
        return uploadedUrls;
    }

    /**
     * 파일 삭제
     * 
     * @param fileUrl 삭제할 파일의 URL
     */
    public void deleteImage(String fileUrl) {
        try {
            // URL에서 파일명 추출
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);

            // 파일 삭제
            Files.deleteIfExists(filePath);
            log.info("파일 삭제 성공: " + filename);

        } catch (IOException e) {
            log.error("파일 삭제 실패: " + e.getMessage());
        }
    }

    /**
     * 허용된 이미지 파일 형식인지 확인
     * 
     * @param file 확인할 파일
     * @return 허용된 형식이면 true
     */
    public boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) {
            return false;
        }

        return contentType.equals("image/jpeg") ||
               contentType.equals("image/png") ||
               contentType.equals("image/gif") ||
               contentType.equals("image/webp");
    }
}
