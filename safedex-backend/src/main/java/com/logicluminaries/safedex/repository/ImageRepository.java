package com.logicluminaries.safedex.repository;

import com.logicluminaries.safedex.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
