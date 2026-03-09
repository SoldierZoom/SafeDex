package com.logicluminaries.safedex.repository;

import com.logicluminaries.safedex.model.Neighbourhood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NeighbourhoodRepository extends JpaRepository<Neighbourhood, Long> {
    Neighbourhood findByName(String name);
}
