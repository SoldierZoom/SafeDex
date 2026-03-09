package com.logicluminaries.safedex.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Data
public class Neighbourhood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int safetyScore;//from 1-100
    private double latitude;//will make arrays later so can cover crimes in area better
    private double longitude;

    @ElementCollection
    @CollectionTable(name = "neighbourhood_crime_totals", joinColumns = @JoinColumn(name = "neighbourhood_id"))
    @MapKeyColumn(name = "category")
    @Column(name = "total")
    private Map<String, Integer> crimeTotalsByCategory = new HashMap<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "neighbourhood_id")//creates foreign key in crimeRecord
    private List<CrimeRecord> recentCrimes;
}
