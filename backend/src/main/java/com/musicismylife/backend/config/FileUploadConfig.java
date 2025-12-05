package com.musicismylife.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 파일 업로드 설정
 * 
 * 업로드된 이미지 파일을 저장하고 제공하기 위한 설정입니다.
 */
@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;

    /**
     * 업로드된 파일에 접근할 수 있도록 정적 리소스 핸들러 등록
     * 
     * 예: http://localhost:8080/uploads/images/abc123.jpg
     * → D:/YeonWoo/.../backend/uploads/images/abc123.jpg 파일 반환
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
