package com.logicluminaries.safedex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @NotBlank
    private String name;

    private int safetyScore;//from 1-100

    @NotNull
    private double latitude;

    @NotNull
    private double longitude;

    @NotNull
    @Positive
    private int population;//estimated population

    @ElementCollection
    @CollectionTable(name = "neighbourhood_crime_totals", joinColumns = @JoinColumn(name = "neighbourhood_id"))
    @MapKeyColumn(name = "category")
    @Column(name = "total")
    private Map<String, Integer> crimeTotalsByType = new HashMap<>();//stores total of each crime in the previous year by type in a map

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "neighbourhood_id")//creates foreign key in crimeRecord
    private List<CrimeRecord> recentCrimes;//stores most recent month of crimes
}
