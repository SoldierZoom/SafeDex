package com.logicluminaries.safedex.repository;

import com.logicluminaries.safedex.model.Neighbourhood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NeighbourhoodRepository extends JpaRepository<Neighbourhood, Long> {
    Neighbourhood findByName(String name);
}
